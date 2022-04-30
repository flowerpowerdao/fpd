import { writable, get } from "svelte/store";
import type { Principal } from "@dfinity/principal";
import { Actor } from "@dfinity/agent";
import { HttpAgent } from "@dfinity/agent";
import { StoicIdentity } from "ic-stoic-identity";
import {
  fromVariantToString,
  getVariantValue,
  principalToAccountId,
} from "./utils";
import {
  dao as daoActor,
  createActor as createDaoActor,
  canisterId as daoCanisterId,
  idlFactory as daoIdlFactory,
} from "../declarations/dao";
import {
  btcflowerActor,
  createActor as createBtcflowerActor,
  canisterId as btcflowerCanisterId,
  idlFactory as btcflowerIdlFactory,
} from "../declarations/btcflower";
import type { ProposalView } from "../declarations/dao/dao.did";

export const HOST =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://ic0.app";

type Filters = {
  open: boolean;
  adopted: boolean;
  rejected: boolean;
};

type State = {
  isAuthed: "plug" | "stoic" | null;
  daoActor: typeof daoActor;
  principal: Principal;
  btcflowerActor: typeof btcflowerActor;
  votingPower: number;
  error: string;
  proposals: ProposalView[];
  filteredProposals: ProposalView[];
  filters: Filters;
  votingHistory: { id: bigint; option: bigint }[];
  proposalHistory: bigint[];
  isLoading: boolean;
};

export type NewProposal = {
  title: string;
  description: string;
  options: string[];
};

const defaultState: State = {
  isAuthed: null,
  daoActor,
  btcflowerActor,
  principal: null,
  votingPower: 0,
  error: "",
  proposals: [],
  filteredProposals: [],
  filters: { open: false, adopted: false, rejected: false },
  votingHistory: [],
  proposalHistory: [],
  isLoading: false,
};

export const createStore = ({
  whitelist,
  host,
}: {
  whitelist?: string[];
  host?: string;
}) => {
  const { subscribe, update } = writable<State>(defaultState);

  const stoicConnect = () => {
    StoicIdentity.load().then(async (identity) => {
      if (identity !== false) {
        //ID is a already connected wallet!
      } else {
        //No existing connection, lets make one!
        identity = await StoicIdentity.connect();
      }

      const daoStoic = createDaoActor(daoCanisterId, {
        agentOptions: {
          identity,
          host: HOST,
        },
      });

      const btcflowerStoic = createBtcflowerActor(btcflowerCanisterId, {
        agentOptions: {
          identity,
          host: HOST,
        },
      });

      if (!daoStoic || !btcflowerStoic) {
        console.warn("couldn't create actors");
        return;
      }

      const principal = identity.getPrincipal();

      update((state) => ({
        ...state,
        daoActor: daoStoic,
        btcflowerActor: btcflowerStoic,
        principal,
        isAuthed: "stoic",
      }));

      initStore(principal, btcflowerStoic);
    });
  };

  const plugConnect = async () => {
    // check if plug is installed in the browser
    if (window.ic?.plug === undefined) {
      window.open("https://plugwallet.ooo/", "_blank");
      return;
    }

    // check if plug is connected
    const connected = await window.ic?.plug?.isConnected();
    if (!connected) {
      try {
        await window.ic?.plug.requestConnect({
          whitelist,
          host,
        });
        console.log("plug connected");
      } catch (e) {
        console.warn(e);
        return;
      }
    }

    // check wether agent is present
    // if not create it
    if (!window.ic?.plug?.agent) {
      console.warn("no agent found");
      const result = await window.ic?.plug?.createAgent({
        whitelist,
        host,
      });
      result
        ? console.log("agent created")
        : console.warn("agent creation failed");
    }
    // check of if createActor method is available
    if (!window.ic?.plug?.createActor) {
      console.warn("no createActor found");
      return;
    }

    // Fetch root key for certificate validation during development
    if (process.env.NODE_ENV !== "production") {
      window.ic.plug.agent.fetchRootKey().catch((err) => {
        console.warn(
          "Unable to fetch root key. Check to ensure that your local replica is running",
        );
        console.error(err);
      });
    }

    const daoPlug = (await window.ic?.plug.createActor({
      canisterId: daoCanisterId,
      interfaceFactory: daoIdlFactory,
    })) as typeof daoActor;

    const btcflowerPlug = (await window.ic?.plug.createActor({
      canisterId: btcflowerCanisterId,
      interfaceFactory: btcflowerIdlFactory,
    })) as typeof btcflowerActor;

    if (!daoPlug || !btcflowerPlug) {
      console.warn("couldn't create actors");
      return;
    }

    const principal = await window.ic.plug.agent.getPrincipal();
    update((state) => ({
      ...state,
      daoActor: daoPlug,
      btcflowerActor: btcflowerPlug,
      principal,
      isAuthed: "plug",
    }));

    console.log("plug is authed");

    initStore(principal, btcflowerPlug);
  };

  const initStore = async (
    principal: Principal,
    btcflower: typeof btcflowerActor,
  ) => {
    update((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    const [proposals, votingHistory, votingPower] = await Promise.all([
      fetchProposals(),
      fetchVotingHistory(),
      getVotingPower(principal, btcflower),
    ]);

    update((prevState) => ({
      ...prevState,
      votingPower,
      isLoading: false,
    }));
  };

  const fetchProposals = async () => {
    const proposals = await get({ subscribe }).daoActor.listProposals();
    proposals.sort((a, b) => Number(b.id - a.id));

    update((prevState) => {
      return {
        ...prevState,
        proposals,
      };
    });
  };

  const filterProposals = () => {
    const store = get({ subscribe });
    update((state) => ({
      ...state,
      // filter proposals according to the selected filters
      filteredProposals: !Object.values(store.filters).includes(true)
        ? store.proposals
        : store.proposals.filter((proposal) => {
            return Object.keys(state.filters)
              .filter((key) => {
                return state.filters[key];
              })
              .includes(fromVariantToString(proposal.state));
          }),
    }));
  };

  const fetchVotingHistory = async () => {
    let votingHistory = await get({ subscribe }).daoActor.getVotingHistory();
    update((prevState) => {
      return {
        ...prevState,
        votingHistory,
      };
    });
  };

  const fetchProposalHistory = async () => {
    let proposalHistory = await get({
      subscribe,
    }).daoActor.getProposalHistory();
    console.log(Actor.agentOf(get({ subscribe }).daoActor));
    console.log("store: ", proposalHistory);
    update((prevState) => {
      return {
        ...prevState,
        proposalHistory,
      };
    });
  };

  const disconnect = async () => {
    console.log("disconnected");
    StoicIdentity.disconnect();
    window.ic?.plug?.deleteAgent();
    window.ic?.plug?.disconnect();
    // wait for 500ms to ensure that the disconnection is complete
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("plug status: ", await window.ic?.plug?.isConnected());
    update((prevState) => {
      return {
        ...defaultState,
        proposals: prevState.proposals,
        filteredProposals: prevState.filteredProposals,
      };
    });
  };

  const submitProposal = async (proposal: NewProposal) => {
    const daoActor = get({ subscribe }).daoActor;
    try {
      //@TODO validate the proposal before submitting
      await daoActor.submitProposal(
        proposal.title,
        proposal.description,
        proposal.options,
      );
    } catch (err) {
      console.error("ERROR", err);
      update((prevState) => {
        return {
          ...prevState,
          error: err,
        };
      });
    }
  };

  return {
    subscribe,
    update,
    plugConnect,
    stoicConnect,
    disconnect,
    submitProposal,
    fetchProposals,
    fetchVotingHistory,
    fetchProposalHistory,
    filterProposals,
  };
};

const getVotingPower = async (
  principal: Principal,
  btcflower: typeof btcflowerActor,
): Promise<number> => {
  // if we have a principal, get the voting power
  let result = await btcflower.tokens(principalToAccountId(principal, null));
  if (fromVariantToString(result) === "ok") {
    return getVariantValue(result).length;
  } else {
    console.error(
      `error getting voting power: ${JSON.stringify(getVariantValue(result))}`,
    );
    return 0;
  }
};

export const store = createStore({
  whitelist: [daoCanisterId, btcflowerCanisterId],
  host: HOST,
});

declare global {
  interface Window {
    ic: {
      plug: {
        agent: HttpAgent;
        getPrincipal: () => Promise<Principal>;
        deleteAgent: () => void;
        requestConnect: (options?: {
          whitelist?: string[];
          host?: string;
        }) => Promise<any>;
        createActor: (options: {}) => Promise<
          typeof daoActor | typeof btcflowerActor
        >;
        isConnected: () => Promise<boolean>;
        disconnect: () => Promise<boolean>;
        createAgent: (args?: {
          whitelist: string[];
          host?: string;
        }) => Promise<undefined>;
        requestBalance: () => Promise<
          Array<{
            amount: number;
            canisterId: string | null;
            image: string;
            name: string;
            symbol: string;
            value: number | null;
          }>
        >;
        requestTransfer: (arg: {
          to: string;
          amount: number;
          opts?: {
            fee?: number;
            memo?: number;
            from_subaccount?: number;
            created_at_time?: {
              timestamp_nanos: number;
            };
          };
        }) => Promise<{ height: number }>;
      };
    };
  }
}

import { writable, get } from "svelte/store";
import type { Principal } from "@dfinity/principal";
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
import {
  ethflowerActor,
  createActor as createEthflowerActor,
  canisterId as ethflowerCanisterId,
  idlFactory as ethflowerIdlFactory,
} from "../declarations/ethflower";
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
  ethflowerActor: typeof ethflowerActor;
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
  ethflowerActor,
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

  console.log(ethflowerCanisterId);
  console.log(btcflowerCanisterId);

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

      const ethflowerStoic = createEthflowerActor(ethflowerCanisterId, {
        agentOptions: {
          identity,
          host: HOST,
        },
      });

      if (!daoStoic || !btcflowerStoic || !ethflowerStoic) {
        console.warn("couldn't create actors");
        return;
      }

      const principal = identity.getPrincipal();

      update((state) => ({
        ...state,
        daoActor: daoStoic,
        btcflowerActor: btcflowerStoic,
        ethflowerActor: ethflowerStoic,
        principal,
        isAuthed: "stoic",
      }));

      initStore(principal, btcflowerStoic, ethflowerStoic);
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

    console.log(ethflowerCanisterId);

    const ethflowerPlug = (await window.ic?.plug.createActor({
      canisterId: ethflowerCanisterId,
      interfaceFactory: ethflowerIdlFactory,
    })) as typeof ethflowerActor;

    if (!daoPlug || !btcflowerPlug || !ethflowerPlug) {
      console.warn("couldn't create actors");
      return;
    }

    const principal = await window.ic.plug.agent.getPrincipal();
    update((state) => ({
      ...state,
      daoActor: daoPlug,
      btcflowerActor: btcflowerPlug,
      ethflowerActor: ethflowerPlug,
      principal,
      isAuthed: "plug",
    }));

    console.log("plug is authed");

    initStore(principal, btcflowerPlug, ethflowerPlug);
  };

  const initStore = async (
    principal: Principal,
    btcflower: typeof btcflowerActor,
    ethflower: typeof ethflowerActor,
  ) => {
    console.log("init store");

    // set state to loading
    update((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    const [proposals, votingHistory, proposalHistory, votingPower] =
      await Promise.all([
        fetchProposals(),
        fetchVotingHistory(),
        fetchProposalHistory(),
        getVotingPower(principal, btcflower, ethflower),
      ]);

    // we have to populate the filtered propsals bc that's what the Proposals component uses
    filterProposals();

    update((prevState) => ({
      ...prevState,
      votingPower,
      isLoading: false,
    }));
  };

  const fetchProposals = async () => {
    const proposals = await daoActor.listProposals();
    proposals.sort((a, b) => Number(b.id - a.id));

    console.log("proposals fetched");

    update((prevState) => {
      return {
        ...prevState,
        proposals,
      };
    });
  };

  const filterProposals = () => {
    const store = get({ subscribe });

    console.log("proposals filtered");

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

    console.log("voting history fetched");

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
    console.log("proposal history fetched");
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
  ethflower: typeof ethflowerActor,
): Promise<number> => {
  // if we have a principal, get the voting power
  let [btcflowerResult, ethflowerResult] = await Promise.all([
    btcflower.tokens(principalToAccountId(principal, null)),
    ethflower.tokens(principalToAccountId(principal, null)),
  ]);

  console.log("voting power fetched");

  // this if statement has to come first, otherwise we miss voting power
  if (
    fromVariantToString(btcflowerResult) === "ok" &&
    fromVariantToString(ethflowerResult) === "ok"
  ) {
    return (
      getVariantValue(btcflowerResult).length * 2 +
      getVariantValue(ethflowerResult).length
    );
  } else if (fromVariantToString(btcflowerResult) === "ok") {
    return getVariantValue(btcflowerResult).length;
  } else if (fromVariantToString(ethflowerResult) === "ok") {
    return getVariantValue(ethflowerResult).length;
  } else {
    console.error(
      `error getting voting power: ${JSON.stringify(
        // error message is the same for both canisters so we can just take btcflowers
        getVariantValue(btcflowerResult),
      )}`,
    );
    return 0;
  }
};

export const store = createStore({
  whitelist: [daoCanisterId, btcflowerCanisterId, ethflowerCanisterId],
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
          typeof daoActor | typeof btcflowerActor | typeof ethflowerActor
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

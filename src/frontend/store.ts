import { writable, get } from "svelte/store";
import type { Principal } from "@dfinity/principal";
import { Actor, HttpAgent } from "@dfinity/agent";
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
import {
  icpflowerActor,
  createActor as createIcpflowerActor,
  canisterId as icpflowerCanisterId,
  idlFactory as icpflowerIdlFactory,
} from "../declarations/icpflower";
import type { ProposalViewV3 } from "../declarations/dao/dao.did";
import { InterfaceFactory } from "@dfinity/candid/lib/cjs/idl";

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
  isAuthed: "plug" | "stoic" | "bitfinity" | null;
  daoActor: typeof daoActor;
  principal: Principal;
  btcflowerActor: typeof btcflowerActor;
  ethflowerActor: typeof ethflowerActor;
  icpflowerActor: typeof icpflowerActor;
  votingPower: number;
  error: string;
  proposals: ProposalViewV3[];
  filteredProposals: ProposalViewV3[];
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
  daoActor: createDaoActor(daoCanisterId, { agentOptions: { host: HOST } }),
  btcflowerActor: createBtcflowerActor(btcflowerCanisterId, {
    agentOptions: { host: HOST },
  }),
  ethflowerActor: createEthflowerActor(ethflowerCanisterId, {
    agentOptions: { host: HOST },
  }),
  icpflowerActor: createIcpflowerActor(icpflowerCanisterId, {
    agentOptions: { host: HOST },
  }),
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
  const checkConnections = async () => {
    await checkStoicConnection();
    await checkPlugConnection();
    await checkBitfinityConnection();
  };

  const checkStoicConnection = async () => {
    StoicIdentity.load().then(async (identity) => {
      if (identity !== false) {
        //ID is a already connected wallet!
        await stoicConnect();
      }
    });
  };

  const checkPlugConnection = async () => {
    const connected = await window.ic?.plug?.isConnected();
    if (connected) {
      console.log("plug connection detected");
      await plugConnect();
    }
  };

  const checkBitfinityConnection = async () => {
    const connected = await window.ic?.bitfinityWallet?.isConnected();
    if (connected) {
      console.log("bitfinity connection detected");
      await bitfinityConnect();
    }
  };

  const stoicConnect = async () => {
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

      const icpflowerStoic = createIcpflowerActor(icpflowerCanisterId, {
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
        icpflowerActor: icpflowerStoic,
        principal,
        isAuthed: "stoic",
      }));

      initStore(principal, btcflowerStoic, ethflowerStoic, icpflowerStoic);
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

    const ethflowerPlug = (await window.ic?.plug.createActor({
      canisterId: ethflowerCanisterId,
      interfaceFactory: ethflowerIdlFactory,
    })) as typeof ethflowerActor;

    const icpflowerPlug = (await window.ic?.plug.createActor({
      canisterId: icpflowerCanisterId,
      interfaceFactory: icpflowerIdlFactory,
    })) as typeof icpflowerActor;

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
      icpflowerActor: icpflowerPlug,
      principal,
      isAuthed: "plug",
    }));

    console.log("plug is authed");

    initStore(principal, btcflowerPlug, ethflowerPlug, icpflowerPlug);
  };

  const bitfinityConnect = async () => {
    // check if bitfinity is installed in the browser
    if (window.ic?.bitfinityWallet === undefined) {
      window.open("https://wallet.infinityswap.one/", "_blank");
      return;
    }

    // check if bitfinity is connected
    const bitfinityConnected = await window.ic?.bitfinityWallet?.isConnected();
    if (!bitfinityConnected) {
      try {
        await window.ic?.bitfinityWallet.requestConnect({ whitelist });
        console.log("bitfinity connected");
      } catch (e) {
        console.warn(e);
        return;
      }
    }

    await initBitfinity();
  };

  const initBitfinity = async () => {
    const daoActorBitfinity = (await window.ic.bitfinityWallet.createActor({
      canisterId: daoCanisterId,
      interfaceFactory: daoIdlFactory,
      host: HOST,
    })) as typeof daoActor;

    const btcflowerActorBitfinity =
      (await window.ic.bitfinityWallet.createActor({
        canisterId: btcflowerCanisterId,
        interfaceFactory: btcflowerIdlFactory,
        host: HOST,
      })) as typeof btcflowerActor;

    const ethflowerActorBitfinity =
      (await window.ic.bitfinityWallet.createActor({
        canisterId: ethflowerCanisterId,
        interfaceFactory: ethflowerIdlFactory,
        host: HOST,
      })) as typeof ethflowerActor;

    const icpflowerActorBitfinity =
      (await window.ic.bitfinityWallet.createActor({
        canisterId: icpflowerCanisterId,
        interfaceFactory: icpflowerIdlFactory,
        host: HOST,
      })) as typeof icpflowerActor;

    if (!daoActor || !btcflowerActor || !ethflowerActor || !icpflowerActor) {
      console.warn("couldn't create actors");
      return;
    }

    const principal = await window.ic.bitfinityWallet.getPrincipal();

    update((state) => ({
      ...state,
      daoActor: daoActorBitfinity,
      btcflowerActor: btcflowerActorBitfinity,
      ethflowerActor: ethflowerActorBitfinity,
      icpflowerActor: icpflowerActorBitfinity,
      principal,
      isAuthed: "bitfinity",
    }));

    await initStore(
      principal,
      btcflowerActorBitfinity,
      ethflowerActorBitfinity,
      icpflowerActorBitfinity,
    );

    console.log("bitfinity is authed");
  };

  const initStore = async (
    principal: Principal,
    btcflower: typeof btcflowerActor,
    ethflower: typeof ethflowerActor,
    icpflower: typeof icpflowerActor,
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
        getVotingPower(principal, btcflower, ethflower, icpflower),
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
    // we need to recreate the actor here so the service working runs, the HOST is important in production
    // https://forum.dfinity.org/t/icfront-bug-with-actors-making-calls/12854
    const proposals = await createDaoActor(daoCanisterId, {
      agentOptions: { host: HOST },
    }).listProposals();
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
    const store = get({ subscribe });
    if (store.isAuthed === "stoic") {
      StoicIdentity.disconnect();
    } else if (store.isAuthed === "plug") {
      // awaiting this fails, promise never returns
      window.ic.plug.disconnect();
    } else if (store.isAuthed === "bitfinity") {
      await window.ic.bitfinityWallet.disconnect();
    }
    console.log("disconnected");
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
      await daoActor.submitProposal(proposal);
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
    bitfinityConnect,
    disconnect,
    checkConnections,
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
  icpflower: typeof icpflowerActor,
): Promise<number> => {
  // if we have a principal, get the voting power
  let [btcflowerResult, ethflowerResult, icpflowerResult] = await Promise.all([
    btcflower.tokens(principalToAccountId(principal, null)),
    ethflower.tokens(principalToAccountId(principal, null)),
    icpflower.tokens(principalToAccountId(principal, null)),
  ]);

  console.log(
    "voting power fetched",
    btcflowerResult,
    ethflowerResult,
    icpflowerResult,
  );

  let votingPower = 0;
  if (fromVariantToString(btcflowerResult) === "ok") {
    votingPower += getVariantValue(btcflowerResult).length * 2;
  }
  if (fromVariantToString(ethflowerResult) === "ok") {
    votingPower += getVariantValue(ethflowerResult).length;
  }
  if (fromVariantToString(icpflowerResult) === "ok") {
    votingPower += getVariantValue(icpflowerResult).length;
  }

  if (
    fromVariantToString(btcflowerResult) === "err" &&
    fromVariantToString(ethflowerResult) === "err" &&
    fromVariantToString(icpflowerResult) === "err"
  ) {
    console.error(
      `error getting voting power: ${JSON.stringify(
        // error message is the same for both canisters so we can just take btcflowers
        getVariantValue(btcflowerResult),
      )}`,
    );
  }

  return votingPower;
};

export const store = createStore({
  whitelist: [
    daoCanisterId,
    btcflowerCanisterId,
    ethflowerCanisterId,
    icpflowerCanisterId,
  ],
  host: HOST,
});

declare global {
  interface Window {
    ic: {
      bitfinityWallet: {
        requestConnect: (options?: {
          whitelist?: string[];
          timeout?: number;
        }) => Promise<{ derKey: Buffer; rawKey: Buffer }>;
        isConnected: () => Promise<boolean>;
        createActor: (options: {
          canisterId: string;
          interfaceFactory: InterfaceFactory;
          host: string;
        }) => Promise<Actor>;
        getPrincipal: () => Promise<Principal>;
        disconnect: () => Promise<boolean>;
        getAccountID: () => Promise<string>;
        getUserAssets: () => Promise<
          {
            id: string;
            name: string;
            fee: string;
            symbol: string;
            balance: string;
            decimals: number;
            hide: boolean;
            isTestToken: boolean;
            logo: string;
            standard: string;
          }[]
        >;
      };
      plug: {
        agent: HttpAgent;
        sessionManager: {
          sessionData: {
            accountId: string;
          };
        };
        getPrincipal: () => Promise<Principal>;
        deleteAgent: () => void;
        requestConnect: (options?: {
          whitelist?: string[];
          host?: string;
        }) => Promise<any>;
        createActor: (options: {}) => Promise<Actor>;
        isConnected: () => Promise<boolean>;
        disconnect: () => Promise<void>;
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
            memo?: string;
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

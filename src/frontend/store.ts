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
} from "../canisters/btcflower";

export const HOST =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://ic0.app";

type State = {
  isAuthed: "plug" | "stoic" | null;
  daoActor: typeof daoActor;
  principal: Principal;
  btcflowerActor: typeof btcflowerActor;
  votingPower: number;
  proposal: {
    title: string;
    description: string;
    duration: number;
    options: string[];
  };
  error: string;
};

const defaultState = {
  isAuthed: null,
  daoActor,
  btcflowerActor,
  principal: null,
  votingPower: 0,
  proposal: {
    title: "",
    description: "",
    duration: 0,
    options: [""],
  },
  error: "",
};

export const createStore = ({
  whitelist,
  host,
}: {
  whitelist?: string[];
  host?: string;
}) => {
  const { subscribe, update, set } = writable<State>(defaultState);

  return {
    subscribe,
    set,
    update,
    plugConnect: async () => {
      // check if plug is installed in the browser
      if (window.ic?.plug === undefined) {
        window.open("https://plugwallet.ooo/", "_blank");
        return;
      }

      const connected = await window.ic?.plug?.isConnected();
      if (!connected) {
        const hasAllowed = await window.ic?.plug.requestConnect({
          whitelist,
          host,
        });
        if (!hasAllowed) {
          console.warn("plug connection refused");
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

      const votingPower = await getVotingPower(principal, btcflowerPlug);

      update((prevState) => ({
        ...prevState,
        daoActor: daoPlug,
        btcflowerActor: btcflowerPlug,
        principal,
        isAuthed: "plug",
        votingPower,
      }));
    },
    stoicConnect: () => {
      StoicIdentity.load().then(async (identity) => {
        if (identity !== false) {
          //ID is a already connected wallet!
        } else {
          //No existing connection, lets make one!
          identity = await StoicIdentity.connect();
        }
        const agent = new HttpAgent({
          identity,
          host: HOST,
        });

        // Fetch root key for certificate validation during development
        if (process.env.NODE_ENV !== "production") {
          agent.fetchRootKey().catch((err) => {
            console.warn(
              "Unable to fetch root key. Check to ensure that your local replica is running",
            );
            console.error(err);
          });
        }

        const daoStoic = createDaoActor(daoCanisterId, {
          agentOptions: {
            source: agent,
          },
        });

        const btcflowerStoic = createBtcflowerActor(btcflowerCanisterId, {
          agentOptions: {
            source: agent,
          },
        });

        const votingPower = await getVotingPower(
          identity.getPrincipal(),
          btcflowerStoic,
        );

        update((prevState) => ({
          ...prevState,
          daoActor: daoStoic,
          btcflowerActor: btcflowerStoic,
          principal: identity.getPrincipal(),
          isAuthed: "stoic",
          votingPower,
        }));
      });
    },
    disconnect: () => {
      console.log("disconnected");
      StoicIdentity.disconnect();
      window.ic?.plug?.deleteAgent();
      window.ic?.plug?.disconnect();
      update(() => defaultState);
    },
    submitProposal: async () => {
      const daoActor = get({ subscribe }).daoActor;
      const proposal = get({ subscribe }).proposal;
      try {
        //@TODO validate the proposal before submitting
        await daoActor.submitProposal(
          proposal.title,
          proposal.description,
          proposal.options,
          BigInt(proposal.duration),
        );
        // reset proposal eo empty after successful submission
        update((prevState) => {
          return {
            ...prevState,
            proposal: defaultState.proposal,
          };
        });
      } catch (err) {
        console.error("ERROR", err);
        update((prevState) => {
          return {
            ...prevState,
            error: err,
          };
        });
      }
    },
    fetchProposals: async () => {
      let proposals = await get({ subscribe }).daoActor.listProposalOverviews();

      const openProposals = proposals.filter(
        (proposal) => fromVariantToString(proposal.state) === "open",
      );
      const closedProposals = proposals.filter(
        (proposal) => fromVariantToString(proposal.state) === "closed",
      );
      return {
        openProposals,
        closedProposals,
      };
    },
  };
};

const getVotingPower = async (
  principal: Principal,
  btcflower: typeof btcflowerActor,
) => {
  // if we have a principal, get the voting power
  let result = await btcflower.tokens(principalToAccountId(principal, null));
  if (fromVariantToString(result) === "ok") {
    return getVariantValue(result).length;
  } else {
    console.error(`error getting voting power: ${JSON.stringify(getVariantValue(result))}`);
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
        }) => Promise<boolean>;
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

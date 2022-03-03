import { writable } from "svelte/store";
import type { Principal } from "@dfinity/principal";
import { HttpAgent } from "@dfinity/agent";
import { StoicIdentity } from "ic-stoic-identity";
import {
  dao,
  canisterId as daoCanisterId,
  idlFactory,
  createActor as createDaoActor,
} from "../declarations/dao";
import {
  createActor as createBtcflowerActor,
  btcflowerActor,
  canisterId as btcflowerCanisterId,
  idlFactory as btcflowerIdlFactory,
} from "../canisters/btcflower";

export const HOST =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://ic0.app";

export const defaultAgent = new HttpAgent({
  host: HOST,
});

type State = {
  isAuthed: "plug" | "stoic" | null;
  agent: HttpAgent;
  daoActor: typeof dao;
  principal: Principal;
  btcflowerActor: typeof btcflowerActor;
};

const defaultState = {
  isAuthed: null,
  agent: defaultAgent,
  daoActor: dao,
  btcflowerActor: btcflowerActor,
  principal: null,
};

export const createStore = ({
  whitelist,
  host,
}: {
  whitelist?: string[];
  host?: string;
}) => {
  const { subscribe, update } = writable<State>(defaultState);

  return {
    subscribe,
    plugConnect: async () => {
      console.log("plug");
      if (window.ic?.plug === undefined) {
        window.open("https://plugwallet.ooo/", "_blank");
        return;
      }

      window.ic?.plug.requestConnect({ whitelist, host }).then(async () => {
        if (!window.ic?.plug?.agent) return;

        if (!window.ic?.plug?.createActor) return;
        const agent = await window.ic?.plug.agent;

        // Fetch root key for certificate validation during development
        if (process.env.NODE_ENV !== "production") {
          agent.fetchRootKey().catch((err) => {
            console.warn(
              "Unable to fetch root key. Check to ensure that your local replica is running",
            );
            console.error(err);
          });
        }

        const daoActor = (await window.ic?.plug.createActor({
          daoCanisterId,
          interfaceFactory: idlFactory,
        })) as typeof dao;

        const btcActor = (await window.ic?.plug.createActor({
          canisterId: btcflowerCanisterId,
          interfaceFactory: btcflowerIdlFactory,
        })) as typeof btcflowerActor;

        if (!daoActor || !btcflowerActor) {
          console.warn("couldn't create actors");
          return;
        }
        const principal = await agent.getPrincipal();
        update(() => ({
          daoActor,
          btcflowerActor: btcActor,
          agent,
          principal,
          isAuthed: "plug",
        }));
      });
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
          console.log("moin");
          agent.fetchRootKey().catch((err) => {
            console.warn(
              "Unable to fetch root key. Check to ensure that your local replica is running",
            );
            console.error(err);
          });
        }

        const daoActor = createDaoActor(daoCanisterId, {
          agentOptions: {
            source: agent,
          },
        });

        const btcActor = createBtcflowerActor(btcflowerCanisterId, {
          agentOptions: {
            source: agent,
          },
        });

        update(() => ({
          agent,
          daoActor,
          btcflowerActor: btcActor,
          principal: identity.getPrincipal(),
          isAuthed: "stoic",
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
  };
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
        }) => Promise<void>;
        createActor: (options: {}) => Promise<
          typeof dao | typeof btcflowerActor
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

import { writable } from "svelte/store";
import type { Principal } from "@dfinity/principal";
import { Actor, HttpAgent } from "@dfinity/agent";
import { StoicIdentity } from "ic-stoic-identity";
import { dao, canisterId, idlFactory, createActor } from "../declarations/dao";

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
  actor: typeof dao;
  principal: Principal;
};

const defaultState = {
  isAuthed: null,
  agent: defaultAgent,
  actor: dao,
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
      // seems like the agent is deleted when the page is reloaded
      // and createActor needs an agent to work properly. this is supposed to be fixed in a
      // future release, but for now we can't create a new actor without prompting the user again

      // if (await window.ic?.plug.isConnected()) {
      //   let principal = await window.ic?.plug.getPrincipal();
      //   update((state) => ({
      //     ...state,
      //     isAuthed: "plug",
      //     principal: principal,
      //   }));
      //   return;
      // }

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

        const actor = await window.ic?.plug.createActor({
          canisterId,
          interfaceFactory: idlFactory,
        });
        if (!actor) return;
        const principal = await agent.getPrincipal();
        update((state) => ({
          ...state,
          actor,
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

        //Create an actor canister
        const actor: typeof dao = Actor.createActor(idlFactory, {
          agent,
          canisterId,
        });

        update((state) => ({
          ...state,
          agent,
          actor,
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
      update((state) => defaultState);
    },
  };
};

export const store = createStore({
  whitelist: [canisterId],
  host: HOST,
});

declare global {
  interface Window {
    ic: {
      plug: {
        agent: any;
        getPrincipal: () => Promise<Principal>;
        deleteAgent: () => void;
        requestConnect: (options?: {
          whitelist?: string[];
          host?: string;
        }) => Promise<void>;
        createActor: (options: {}) => Promise<typeof dao>;
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

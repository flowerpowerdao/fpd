import { writable } from "svelte/store";
import type { Principal } from "@dfinity/principal";
import { Actor, HttpAgent } from "@dfinity/agent";
import { StoicIdentity } from "ic-stoic-identity";
import { dao, canisterId, idlFactory, createActor } from "canisters/dao";

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
  actor: Actor;
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
      if (await window.ic?.plug.isConnected()) {
        let principal = await window.ic?.plug.getPrincipal();
        update((state) => ({
          ...state,
          isAuthed: "plug",
          principal: principal,
        }));
        return;
      }
      if (window.ic?.plug === undefined) {
        window.open("https://plugwallet.ooo/", "_blank");
        return;
      }

      window.ic?.plug.requestConnect({ whitelist, host }).then(async () => {
        if (!window.ic?.plug?.agent) return;

        if (!window.ic?.plug?.createActor) return;
        const agent = await window.ic?.plug.agent;
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
        const actor = createActor(canisterId, {
          agentOptions: { identity, host: HOST },
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

export const store = createStore({ whitelist: [process.env.DAO_CANISTER_ID] });

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
        createActor: (options: {}) => Promise<Actor>;
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

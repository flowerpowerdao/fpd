<script>
  import { onMount } from "svelte";
  import { StoicIdentity } from "ic-stoic-identity";

  import { store } from "../store";

  onMount(async () => {
    StoicIdentity.load().then(async (identity) => {
      if (identity !== false) {
        //ID is a already connected wallet!
        store.stoicConnect();
      }
    });
  });
</script>

{#if $store.isAuthed === "stoic"}
  <button
    class="flex items-center px-3 py-2 rounded-lg bg-white border-gray-300 border-2 hover:ring-2 hover:ring-opacity-50 hover:ring-indigo-500 hover:border-indigo-500"
    on:click={store.disconnect}
  >
    <img
      src="https://raw.githubusercontent.com/FloorLamp/cubic/main/src/ui/public/img/stoic.png"
      class="w-4 mr-2"
      alt="stoic logo"
    />

    <span>
      {$store.principal.toString().slice(0, 5) +
        "..." +
        $store.principal.toString().slice(-5)}
    </span>
  </button>
{:else if !$store.isAuthed}
  <button
    class="flex items-center px-3 py-2 rounded-lg bg-white border-gray-300 border-2 hover:ring-2 hover:ring-opacity-50 hover:ring-indigo-500 hover:border-indigo-500"
    on:click={store.stoicConnect}
  >
    <img
      src="https://raw.githubusercontent.com/FloorLamp/cubic/main/src/ui/public/img/stoic.png"
      class="w-4 mr-2"
      alt="stoic logo"
    /> Stoic
  </button>
{/if}

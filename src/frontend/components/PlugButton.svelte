<script lang="ts">
  import { onMount } from "svelte";
  import { store } from "../store";

  onMount(async () => {
    const connected = await window.ic?.plug?.isConnected();
    if (connected) store.plugConnect();
  });
</script>

<!-- {#if $store.isAuthed === "plug"}
  <div class="flex justify-end p-2 items-center">
    <button
      class="plug-button p-2 flex justify-between items-center"
      on:click={store.disconnect}
    >
      <div class="flex items-center mr-2">
        <img class="plug-logo" src={plugLogo} alt="plug-logo" />
        {$store.principal.toString().slice(0, 5) +
          "..." +
          $store.principal.toString().slice(-2)}
      </div>
      <span>{$store.votingPower + " "} Flowers</span>
    </button>
  </div>
  {/if} -->

<button
  class="font-mono background-white w-full mx-2 h-10 border-2 border-black rounded-3xl flex justify-center items-center"
  on:click={store.plugConnect}
>
  plug
</button>

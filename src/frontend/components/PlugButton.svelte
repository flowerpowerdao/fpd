<script lang="ts">
  import { onMount } from "svelte";
  import { store } from "../store";

  onMount(async () => {
    const connected = await window.ic?.plug?.isConnected();
    if (connected) store.plugConnect();
  });
</script>

<button
  class="font-mono background-white w-full mx-2 h-10 border-2 border-black rounded-3xl flex justify-center items-center"
  on:click={store.plugConnect}
>
  plug
</button>

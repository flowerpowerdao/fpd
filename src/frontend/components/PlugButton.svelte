<script lang="ts">
  import { onMount } from "svelte";
  import { store } from "../store";

  import spinner from "../assets/loading.gif";
  import Button from "./Button.svelte";

  export let loading;

  onMount(async () => {
    const connected = await window.ic?.plug?.isConnected();
    if (connected) store.plugConnect();
  });

  async function connect() {
    loading = "plug";
    await store.plugConnect();
    loading = undefined;
  }
</script>

<Button eventHandler={connect} disabled={loading}>
  {#if loading === "plug"}
    <img class="h-6 block" src={spinner} alt="loading animation" />
  {:else}
    plug
  {/if}
</Button>

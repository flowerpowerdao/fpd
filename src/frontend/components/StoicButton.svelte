<script>
  import { onMount } from "svelte";
  import { StoicIdentity } from "ic-stoic-identity";
  import { store } from "../store";

  import Button from "./Button.svelte";
  import spinner from "../assets/loading.gif";

  export let loading;

  onMount(async () => {
    StoicIdentity.load().then(async (identity) => {
      if (identity !== false) {
        //ID is a already connected wallet!
        store.stoicConnect();
      }
    });
  });

  async function connect() {
    loading = "stoic";
    await store.stoicConnect();
    loading = undefined;
  }
</script>

<Button eventHandler={connect} disabled={loading}>
  {#if loading === "stoic"}
    <img class="h-6 block" src={spinner} alt="loading animation" />
  {:else}
    stoic
  {/if}
</Button>

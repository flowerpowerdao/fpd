<script>
  import { onMount } from "svelte";
  import { StoicIdentity } from "ic-stoic-identity";

  import { store } from "../store";
  import SpinningCursor from "./SpinningCursor.svelte";

  onMount(async () => {
    StoicIdentity.load().then(async (identity) => {
      if (identity !== false) {
        //ID is a already connected wallet!
        store.stoicConnect();
      }
    });
  });
</script>

<button
  class="relative font-mono background-white w-full mx-2 h-10 border-2 border-black rounded-3xl flex justify-center items-center"
  on:click={store.stoicConnect}
>
  stoic
</button>

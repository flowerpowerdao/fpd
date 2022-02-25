<script lang="ts">
  import Intro from "../components/Intro.svelte";
  import PlugButton from "../components/PlugButton.svelte";
  import StoicButton from "../components/StoicButton.svelte";

  import { store } from "../store";

  console.log($store.btcflowerActor.getTokens());
</script>

<div class="text-center">
  <div class="flex flex-col items-stretch gap-4 py-4">
    <StoicButton />
    <PlugButton />
  </div>
  <Intro />
</div>

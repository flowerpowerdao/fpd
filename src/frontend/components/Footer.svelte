<script lang="ts">
  import { store } from "../store";
  import DarkMode from "./DarkMode.svelte";
  import Login from "./Login.svelte";
  import Menu from "./Menu.svelte";
  import VotingPower from "./VotingPower.svelte";
</script>

<div class="fixed bottom-0 flex flex-row w-full">
  <!-- we create a separate div where the item algined is end -->
  <!-- https://stackoverflow.com/questions/66019763/stretching-items-in-a-flexbox-with-a-max-height -->
  <div class="flex flex-row items-end">
    <DarkMode />
  </div>
  {#if !$store.isAuthed}
    <Login />
  {:else}
    <div class="flex-1 flex flex-col">
      <Menu />
      <VotingPower />
    </div>
  {/if}
</div>

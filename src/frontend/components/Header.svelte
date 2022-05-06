<script lang="ts">
  import { store } from "../store";
  import DarkMode from "./DarkMode.svelte";
  import Login from "./Login.svelte";
  import Menu from "./Menu.svelte";
  import VotingPower from "./VotingPower.svelte";

  // get random number between 1 and 18
  let randomLogo = Math.floor(Math.random() * 18) + 1;
</script>

<!-- mobile -->
<div class="lg:hidden">
  <a href="/#">
    <img
      class="h-auto w-full dark:invert dark:border-none"
      src={`/BP_FPDAO_Logo_BlackOnWhite_sRGB_${randomLogo}.svg`}
      alt="fpdao logo"
    />
  </a>
</div>

<!-- desktop -->
<div
  class="hidden fixed top-0 lg:flex flex-row w-full justify-between {!$store.isAuthed
    ? 'items-start'
    : ''}"
>
  <a href="/#">
    <img
      class="h-auto max-h-28 w-full dark:invert dark:border-none"
      src={`/BP_FPDAO_Logo_BlackOnWhite_sRGB_${randomLogo}.svg`}
      alt="fpdao logo"
    />
  </a>
  <div class="flex flex-row ">
    <!-- we create a separate div where the item algined is end -->
    <!-- https://stackoverflow.com/questions/66019763/stretching-items-in-a-flexbox-with-a-max-height -->
    <div class="flex flex-row items-start">
      <DarkMode />
    </div>
    {#if !$store.isAuthed}
      <Login />
    {:else}
      <div class="flex-1 flex flex-col">
        <VotingPower />
        <Menu />
      </div>
    {/if}
  </div>
</div>

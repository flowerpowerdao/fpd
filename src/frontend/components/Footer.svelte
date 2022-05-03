<script lang="ts">
  import { store } from "../store";
  import DarkMode from "./DarkMode.svelte";
  import Login from "./Login.svelte";
  import Menu from "./Menu.svelte";
  import VotingPower from "./VotingPower.svelte";

  let show = false;

  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      show = true;
    } else {
      show = false;
    }
  }

  // When the user clicks on the button, scroll to the top of the document
  function topFunction() {
    // document.body.scrollTop = 0; // For Safari
    // document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
</script>

<div class="lg:hidden fixed bottom-0 flex flex-row w-full">
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

{#if show}
  <button
    on:click={topFunction}
    class="fixed bottom-0 right-0 hidden lg:flex items-center justify-center hover:shadow shadow-black dark:shadow-white text-base 2x:text-xl bg-white dark:bg-black  border-2 border-black dark:border-white dark:text-white h-[72px] w-14 rounded-[28.5px] font-mono -mb-0.5"
  >
    ↑
  </button>
{/if}

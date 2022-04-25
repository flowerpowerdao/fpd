<script lang="ts">
  import { store } from "../store";
  import { slide } from "svelte/transition";

  let openMenu = false;

  function toggleMenu() {
    openMenu = !openMenu;
  }
</script>

<div
  class="flex-1 flex flex-col items-center justify-center font-mono -ml-0.5 text-xl bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 gap-1 py-1 rounded-t-3xl"
>
  <button on:click={toggleMenu}>
    {$store.principal?.toString().slice(0, 5) +
      "…" +
      $store.principal?.toString().slice(-3)}
    {openMenu ? "↓" : "↑"}
  </button>
  {#if openMenu}
    <div class="flex flex-col justify-center items-center gap-1 ">
      <button> my proposals </button>
      <button> voting history </button>
      <button on:click={store.disconnect}> log out </button>
    </div>
  {/if}
</div>

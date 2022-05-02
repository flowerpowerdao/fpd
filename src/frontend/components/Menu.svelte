<script lang="ts">
  import { store } from "../store";
  import { push } from "svelte-spa-router";

  let openMenu = false;

  function toggleMenu() {
    openMenu = !openMenu;
  }
</script>

<div
  class="flex-1 flex flex-col items-center justify-center font-mono -ml-0.5 lg:-mt-0.5 lg:min-w-[300px] text-xl bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 gap-1 py-1 rounded-t-3xl lg:rounded-t-none lg:rounded-b-3xl"
>
  {#if openMenu}
    <div class="hidden lg:flex flex-col justify-center items-center gap-1 ">
      <button on:click={() => push("/submitted-proposals")}>
        submitted proposals</button
      >
      <button on:click={() => push("/voting-history")}> voting history </button>
      <button on:click={async () => await store.disconnect()}> log out </button>
    </div>
  {/if}
  <button on:click={toggleMenu}>
    {$store.principal?.toString().slice(0, 5) +
      "…" +
      $store.principal?.toString().slice(-3)}
    <p class="inline-block lg:hidden">{openMenu ? "↓" : "↑"}</p>
    <p class="hidden lg:inline-block">{openMenu ? "↑" : "↓"}</p>
  </button>
  {#if openMenu}
    <div class="lg:hidden flex flex-col justify-center items-center gap-1 ">
      <button on:click={() => push("/submitted-proposals")}>
        submitted proposals</button
      >
      <button on:click={() => push("/voting-history")}> voting history </button>
      <button on:click={async () => await store.disconnect()}> log out </button>
    </div>
  {/if}
</div>

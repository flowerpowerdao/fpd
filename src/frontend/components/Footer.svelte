<script lang="ts">
  import { store } from "../store";
  import DarkMode from "./DarkMode.svelte";
  import Login from "./Login.svelte";
</script>

<div class="fixed bottom-0 flex flex-row w-full">
  <DarkMode />
  {#if !$store.isAuthed}
    <Login />
  {:else}
    <button on:click={store.disconnect}> Logout </button>
  {/if}
</div>

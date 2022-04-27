<script lang="ts">
  import PlugButton from "./PlugButton.svelte";
  import StoicButton from "./StoicButton.svelte";

  export let toggleModal;

  let loading = "";
</script>

<div
  class="fixed flex justify-center items-center z-10 inset-0 bg-opacity-10 backdrop-blur-sm"
>
  <div
    class="flex flex-col bg-white dark:bg-black border-black dark:border-white border-2 rounded-xl h-1/2 w-full mx-2 pt-4 px-4"
  >
    <div class="flex flex-row justify-between">
      <p class="font-everett-medium text-3xl">login with…</p>
      <div
        class="cursor-pointer flex justify-center items-center font-mono text-lg rounded-full border-2 border-black w-10 h-10"
        on:click={toggleModal}
      >
        x
      </div>
    </div>
    <div class="flex gap-3 flex-col flex-1 justify-center items-center">
      <PlugButton bind:loading />
      <StoicButton bind:loading />
    </div>
  </div>
</div>

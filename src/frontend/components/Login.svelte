<script lang="ts">
  import PlugButton from "./PlugButton.svelte";
  import StoicButton from "./StoicButton.svelte";

  let openModal = false;

  function toggleModal() {
    openModal = !openModal;
  }

  function handleEscape({ key }) {
    if (key === "Escape") {
      openModal = false;
    }
  }
</script>

<svelte:window on:keyup={handleEscape} />

<button
  on:click={toggleModal}
  class="flex-1 font-mono -ml-0.5 text-xl bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-t-3xl"
  >login</button
>
<div>
  {#if openModal}
    <div
      class="fixed flex justify-center items-center z-10 inset-0 bg-opacity-10 backdrop-blur-sm"
    >
      <div
        class="dark:invert flex flex-col bg-white border-black border-2 rounded-xl h-1/2 w-full mx-2 pt-4 px-4"
      >
        <div class="flex flex-row justify-between">
          <p class="font-everett-medium text-3xl">login with…</p>
          <div
            class="flex justify-center items-center font-mono text-lg rounded-full border-2 border-black w-10 h-10"
            on:click={toggleModal}
          >
            x
          </div>
        </div>
        <div class="flex gap-3 flex-col flex-1 justify-center items-center">
          <PlugButton />
          <StoicButton />
        </div>
      </div>
    </div>
  {/if}
</div>

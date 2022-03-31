<script lang="ts">
  import VoteModal from "./VoteModal.svelte";

  export let option: Text;
  let showModal = false;
</script>

{#if showModal}
  <div
    class="z-50 fixed left-0 top-0 w-full h-full bg-slate-700 bg-opacity-90 flex justify-center items-center"
    on:click={() => (showModal = false)}
  >
    <VoteModal />
  </div>
{/if}

<div class="text-center" on:click={() => (showModal = true)}>
  {option}
</div>

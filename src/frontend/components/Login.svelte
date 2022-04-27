<script lang="ts">
  import LoginModal from "./LoginModal.svelte";

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
<div class={openModal ? "" : "hidden"}>
  <LoginModal {toggleModal} />
</div>

<script lang="ts">
  import Modal from "./Modal.svelte";
  import PlugButton from "./PlugButton.svelte";
  import StoicButton from "./StoicButton.svelte";
  import BitfinityButton from "./BitfinityButton.svelte";

  export let toggleModal;

  let loading = "";
</script>

<Modal title={"login with …"} {toggleModal}>
  <div class="flex gap-3 flex-col flex-1 justify-center items-center">
    <PlugButton bind:loading {toggleModal} />
    <StoicButton bind:loading {toggleModal} />
    <BitfinityButton bind:loading {toggleModal} />
  </div>
</Modal>

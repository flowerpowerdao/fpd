<script lang="ts">
  import Button from "../components/Button.svelte";
  import CreateProposalForm from "../components/CreateProposalForm.svelte";

  import { pop } from "svelte-spa-router";

  let preview = false;
</script>

<!-- mobile -->
<div class="pb-24 lg:hidden">
  <!-- header buttons -->
  <div class="my-10">
    <Button eventHandler={() => pop()}>← back</Button>
    <Button eventHandler={() => (preview = !preview)}>preview</Button>
  </div>
  <CreateProposalForm {preview} />
</div>

<!-- desktop -->
<div class="hidden lg:flex pb-24 pt-40">
  <Button style={"max-w-[150px]"} eventHandler={() => pop()}>← back</Button>
  <div class="flex flex-col w-full gap-4">
    <CreateProposalForm {preview} />
  </div>
  <div class="2xl:min-w-[430px] min-w-[350px]">
    <Button eventHandler={() => (preview = !preview)}>preview</Button>
  </div>
</div>

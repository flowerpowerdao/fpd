<script lang="ts">
  import VotingHistoryTable from "../components/VotingHistoryTable.svelte";
  import Button from "../components/Button.svelte";

  import { pop } from "svelte-spa-router";
</script>

<!-- mobile -->
<div class="pb-24 lg:hidden">
  <!-- header buttons -->
  <div class="my-10">
    <Button on:click={() => pop()}>← back</Button>
  </div>
  <VotingHistoryTable />
</div>

<!-- desktop -->
<div class="hidden lg:flex pb-24 pt-40">
  <Button style={"max-w-[150px]"} on:click={() => pop()}>← back</Button>
  <div class="flex flex-col w-full gap-4">
    <VotingHistoryTable />
  </div>
  <div class="2xl:min-w-[430px] min-w-[350px]" />
</div>

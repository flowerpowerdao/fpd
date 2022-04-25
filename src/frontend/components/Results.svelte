<script lang="ts">
  import ProgressBar from "./ProgressBar.svelte";
  import type { ProposalView as Proposal } from "../../declarations/dao/dao.did";
  import { fromVariantToString } from "../utils";

  export let proposal: Proposal;
</script>

<div
  class=" bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-xl mx-2 my-10"
>
  <div class="p-2 flex flex-col justify-between">
    <button
      class="cursor-default active: text-xl bg-white dark:bg-black border-2 border-black dark:border-white dark:text-white rounded-3xl h-12 w-full font-mono italic"
    >
      current results:
    </button>
    {#if fromVariantToString(proposal.state) === "open"}
      <div class="pt-7">
        <ProgressBar
          votesCast={Number(proposal.votesCast)}
          title={"votes cast"}
        />
      </div>
    {/if}
  </div>
</div>

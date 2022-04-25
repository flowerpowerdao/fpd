<script lang="ts">
  import {
    fromVariantToString,
    fromTimestamp,
    getWinningOption,
  } from "../utils";
  import type { ProposalView as Proposal } from "../../declarations/dao/dao.did";
  export let proposal: Proposal;
</script>

<div class="flex justify-end">
  {#if fromVariantToString(proposal.state) === "open"}
    <button
      class="text-xl flex-1 bg-white dark:bg-black  border-2 border-black dark:border-white dark:text-white h-12 rounded-3xl font-mono italic"
    >
      ends: {fromTimestamp(proposal.expiryDate).toLocaleDateString(undefined, {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      })}
    </button>
    <button
      class="text-xl bg-white dark:bg-black  border-2 border-black dark:border-white dark:text-white h-12 w-[calc(100vw*(1/3))] -ml-0.5 rounded-3xl font-mono italic"
    >
      open
    </button>
  {:else if fromVariantToString(proposal.state) === "adopted"}
    <button
      class="text-xl flex-1 bg-white dark:bg-black  border-2 border-black dark:border-white dark:text-white h-12 rounded-3xl font-mono italic"
    >
      {getWinningOption(proposal)}
    </button>
    <button
      class="text-xl bg-white dark:bg-black border-2 border-black dark:border-white dark:text-white h-12 w-[calc(100vw*(1/3))] -ml-0.5 font-mono italic"
    >
      adopted
    </button>
  {:else}
    <button
      class="text-xl bg-white dark:bg-black border-2 border-black dark:border-white dark:text-white h-12 w-[calc(100vw*(1/3))] -ml-0.5 rounded-t-3xl font-mono italic"
    >
      rejected
    </button>
  {/if}
</div>

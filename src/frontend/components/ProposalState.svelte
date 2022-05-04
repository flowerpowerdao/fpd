<script lang="ts">
  import {
    fromVariantToString,
    fromTimestamp,
    getWinningOption,
  } from "../utils";
  import type { ProposalView as Proposal } from "../../declarations/dao/dao.did";

  export let proposal: Proposal;
  export let detail = false;
</script>

<div class="flex justify-end lg:text-base 2xl:text-xl text-xl">
  {#if fromVariantToString(proposal.state) === "open"}
    <button
      class="cursor-default disabled flex-1 bg-white dark:bg-black  border-2 border-black dark:border-white dark:text-white h-12 lg:h-10 lg:max-w-xs rounded-3xl font-mono italic"
    >
      {#if detail}
        ends: {fromTimestamp(proposal.expiryDate).toLocaleDateString(
          navigator.language,
          {
            month: "2-digit",
            day: "2-digit",
          },
        ) +
          " " +
          fromTimestamp(proposal.expiryDate).toLocaleTimeString(
            navigator.language,
            {
              hour: "2-digit",
              minute: "2-digit",
            },
          )}
      {:else}
        ends: {fromTimestamp(proposal.expiryDate).toLocaleDateString(
          navigator.language,
          {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
          },
        )}
      {/if}
    </button>
    <button
      class="cursor-default disabled bg-white dark:bg-black  border-2 border-black dark:border-white dark:text-white h-12 lg:h-10 w-[calc(100vw*(1/3))] lg:w-40 -ml-0.5 rounded-3xl font-mono italic"
    >
      open
    </button>
  {:else if fromVariantToString(proposal.state) === "adopted"}
    <button
      class="truncate px-4 cursor-default disabled flex-1 bg-white dark:bg-black  border-2 border-black dark:border-white dark:text-white h-12 lg:h-10 lg:max-w-xs rounded-3xl font-mono italic"
    >
      {getWinningOption(proposal)}
    </button>
    <button
      class="cursor-default disabled bg-white dark:bg-black border-2 border-black dark:border-white dark:text-white h-12 lg:h-10 w-[calc(100vw*(1/3))] lg:w-40 -ml-0.5 font-mono italic"
    >
      adopted
    </button>
  {:else}
    <button
      class="cursor-default disabled bg-white dark:bg-black border-2 border-black dark:border-white dark:text-white h-12 lg:h-10 w-[calc(100vw*(1/3))] lg:w-40 -ml-0.5 rounded-t-3xl font-mono italic"
    >
      rejected
    </button>
  {/if}
</div>

<script lang="ts">
  import { fromVariantToString, fromTimestamp } from "../utils";
  import type { ProposalView as Proposal } from "../../declarations/dao/dao.did";
  export let proposal: Proposal;

  // get winning option
  function getWinningOption(proposal: Proposal): string {
    // get winning option
    let outcome = {};
    proposal.votes.forEach((vote) => {
      if (Number(vote[1].option) in outcome) {
        outcome[Number(vote[1].option)] += vote[1].votesCast;
      } else {
        outcome[Number(vote[1].option)] = vote[1].votesCast;
      }
    });

    console.log(outcome);

    // get biggest value in outcome
    let biggest;
    try {
      biggest = Object.keys(outcome).reduce((a, b) =>
        outcome[a] > outcome[b] ? a : b,
      );
    } catch (error) {
      console.log(error);
      return "";
    }

    // return option
    return proposal.options[biggest];
  }
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

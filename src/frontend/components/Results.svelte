<script lang="ts">
  import ProgressBar from "./ProgressBar.svelte";
  import type { ProposalViewV3 as Proposal } from "../../declarations/dao/dao.did";
  import { fromVariantToString, getVotesForOption } from "../utils";
  import Card from "./Card.svelte";

  export let proposal: Proposal;
</script>

<Card style="mx-2 lg:mx-0">
  <div class="p-2 flex flex-col justify-between">
    <button
      class="cursor-default text-xl lg:text-base 2xl:text-xl bg-white dark:bg-black border-2 border-black dark:border-white dark:text-white rounded-3xl h-12 lg:h-10 w-full font-mono italic"
    >
      {fromVariantToString(proposal.state) === "open"
        ? "current results:"
        : "final results:"}
    </button>
    <div class="pt-7 flex flex-col gap-2">
      {#if fromVariantToString(proposal.state) === "open"}
        <ProgressBar
          votesCast={Number(proposal.votesCast)}
          expiryDate={Number(proposal.expiryDate)}
          title={"votes cast"}
        />
      {:else}
        <div class="mb-5">
          <ProgressBar
            votesCast={Number(proposal.votesCast)}
            expiryDate={Number(proposal.expiryDate)}
            title={"votes cast"}
          />
        </div>
        {#each proposal.options as option, index}
          <ProgressBar
            votesCast={getVotesForOption(proposal, index)}
            expiryDate={Number(proposal.expiryDate)}
            title={option}
          />
        {/each}
      {/if}
    </div>
  </div>
</Card>

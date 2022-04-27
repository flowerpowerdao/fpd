<script lang="ts">
  import type { ProposalView as Proposal } from "../../declarations/dao/dao.did.d";
  import SvelteMarkdown from "svelte-markdown";
  import { truncate } from "../utils";
  import Card from "./Card.svelte";

  export let proposal: Proposal;

  let showText = false;
  const toggleText = () => {
    showText = !showText;
  };
</script>

<Card>
  <div class="p-2 flex flex-col">
    <h1 class="font-everett-medium text-3xl">
      {proposal.title}
    </h1>
    <div class="flex justify-between mt-3">
      <p>id: #{proposal.id}</p>
      <p>
        {#if proposal.core}
          <button
            class="bg-white dark:bg-black  border-2 border-black dark:border-white dark:text-white leading-4 w-[calc(100vw*(1/3))] h-full rounded-3xl font-mono italic"
          >
            core
          </button>
        {:else}
          by {proposal.proposer.toString().slice(0, 5) +
            "…" +
            proposal.proposer.toString().slice(-3)}
        {/if}
      </p>
    </div>
    <p class="mt-6">
      {#if showText}
        <article class="prose prose-black dark:prose-invert max-w-none">
          <SvelteMarkdown source={proposal.description} />
        </article>
      {:else}
        <article class="prose prose-black dark:prose-invert max-w-none">
          <SvelteMarkdown source={truncate(proposal.description, 100)} />
        </article>
      {/if}
    </p>
    {#if proposal.description.length > 100}
      <button
        class="mt-4 flex-1 font-mono -ml-0.5 text-xl bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-b-3xl min-h-[40px]"
        on:click={toggleText}
      >
        {showText ? "hide ↑" : "show more ↓"}
      </button>
    {/if}
  </div>
</Card>

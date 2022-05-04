<script lang="ts">
  import type { ProposalView as Proposal } from "../../declarations/dao/dao.did.d";
  import SvelteMarkdown from "svelte-markdown";
  import { truncate } from "../utils";
  import Card from "./Card.svelte";
  import Proposer from "./Proposer.svelte";
  import ShowMore from "./ShowMore.svelte";

  export let proposal: Proposal;

  let showText = false;
  const toggleText = () => {
    showText = !showText;
  };
</script>

<Card style="mx-2">
  <div class="p-2 lg:p-4 flex flex-col">
    <h1 class="font-everett-medium text-3xl 2xl:text-4xl">
      {proposal.title}
    </h1>
    <div class="lg:w-1/2 2xl:text-xl flex justify-between items-center mt-3">
      <p>id: #{proposal.id}</p>
      <Proposer {proposal} />
    </div>
    <p class="mt-6">
      {#if showText}
        <article
          class="prose prose-black 2xl:prose-xl dark:prose-invert max-w-none"
        >
          <SvelteMarkdown source={proposal.description} />
        </article>
      {:else}
        <article
          class="prose prose-black 2xl:prose-xl dark:prose-invert max-w-none"
        >
          <SvelteMarkdown source={truncate(proposal.description, 100)} />
        </article>
      {/if}
    </p>
    {#if proposal.description.length > 100}
      <ShowMore show={showText} toggle={toggleText} />
    {/if}
  </div>
</Card>

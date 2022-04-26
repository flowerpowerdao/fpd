<script lang="ts">
  import { push } from "svelte-spa-router";

  import type { ProposalView as Proposal } from "../../declarations/dao/dao.did.d";
  import CastVote from "./CastVote.svelte";
  import ProposalState from "./ProposalState.svelte";
  import ProposalText from "./ProposalText.svelte";
  import Results from "./Results.svelte";
  import Votes from "./Votes.svelte";

  export let proposal: Proposal;
</script>

<!-- mobile -->
<div class="pb-24">
  <div class="my-10">
    <button
      class="text-xl bg-white dark:bg-black  border-2 border-black dark:border-white dark:text-white h-12 w-full rounded-3xl font-mono -mb-0.5"
      on:click={() => push("/")}
    >
      ← back
    </button>
    <ProposalState {proposal} />
  </div>
  <ProposalText {proposal} />
  <CastVote {proposal} />
  <Votes {proposal} />
  <Results {proposal} />
</div>

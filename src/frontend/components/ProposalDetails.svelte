<script lang="ts">
  import { pop } from "svelte-spa-router";

  import type { ProposalView as Proposal } from "../../declarations/dao/dao.did.d";
  import Button from "./Button.svelte";
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
    <Button eventHandler={() => pop()}>← back</Button>
    <ProposalState {proposal} />
  </div>
  <ProposalText {proposal} />
  <CastVote {proposal} />
  <Votes {proposal} />
  <Results {proposal} />
</div>

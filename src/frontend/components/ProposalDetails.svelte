<script lang="ts">
  import { pop } from "svelte-spa-router";

  import type { ProposalViewV3 as Proposal } from "../../declarations/dao/dao.did.d";
  import Button from "./Button.svelte";
  import CastVote from "./CastVote.svelte";
  import ProposalState from "./ProposalState.svelte";
  import ProposalText from "./ProposalText.svelte";
  import Results from "./Results.svelte";
  import Votes from "./Votes.svelte";

  export let proposal: Proposal;
  export let fetchProposal;
</script>

<!-- mobile -->
<div class="lg:hidden pb-24">
  <div class="my-10">
    <Button on:click={() => pop()}>← back</Button>
    <ProposalState {proposal} detail={true} />
  </div>
  <div class="flex flex-col gap-4">
    <ProposalText {proposal} />
    <CastVote {proposal} {fetchProposal} />
    <Votes {proposal} />
    <Results {proposal} />
  </div>
</div>

<!-- desktop -->
<div class="hidden lg:flex pb-24 pt-40">
  <Button style={"max-w-[150px]"} on:click={() => pop()}>← back</Button>
  <div class="flex flex-col w-full gap-4">
    <ProposalText {proposal} />
    <CastVote {proposal} {fetchProposal} />
    <Votes {proposal} />
  </div>
  <div class="2xl:min-w-[430px] min-w-[350px]">
    <ProposalState {proposal} detail={true} />
    <div class="mt-12">
      <Results {proposal} />
    </div>
  </div>
</div>

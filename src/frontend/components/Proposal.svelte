<script lang="ts">
  import { onMount } from "svelte";
  import type { Proposal as ProposalType } from "../../declarations/dao/dao.did";

  import type { Proposal } from "../../declarations/dao/dao.did";
  import { fromTimestamp, fromNullable } from "../utils";
  import { store } from "../store";

  // props

  // this is needed for URL params
  export let params;

  // variables
  let proposal: Proposal | undefined;

  const fetchProposal = async () => {
    let temp = await $store.actor.get_proposal(BigInt(params.id));
    proposal = fromNullable(temp);
    console.log(proposal);
  };

  onMount(async () => {
    await fetchProposal();
  });
</script>

{#if proposal}
  <div class="flex flex-col m-5 rounded-3xl bg-slate-400 text-center">
    <div class="text-2xl flex justify-between px-4">
      <div>#{proposal.id}</div>
      <div>{proposal.description}</div>
    </div>
    <div class="">
      Expiry Date: {fromTimestamp(proposal.expiryDate).toLocaleString()}
    </div>
    <div class="">
      Total Votes Cast: {proposal.totalVotes}
    </div>
    <div class="">
      Distinct Voters: {proposal.voters.length}
    </div>
  </div>
{/if}

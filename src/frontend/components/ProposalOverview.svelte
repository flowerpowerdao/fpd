<script lang="ts">
  import type { Proposal } from "../../declarations/dao/dao.did";
  import { fromTimestamp } from "../utils";
  import { push } from "svelte-spa-router";

  export let bg;
  export let proposal: Proposal;
</script>

<div
  class="flex flex-col m-5 rounded-3xl text-center"
  style:background-color={bg}
  on:click={() => push(`/proposal/${proposal.id}`)}
>
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

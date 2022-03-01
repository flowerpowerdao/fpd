<script lang="ts">
  import ProposalOverview from "./ProposalOverview.svelte";
  import { push } from "svelte-spa-router";
  import type { ProposalOverview as ProposalOverviewType } from "../../declarations/dao/dao.did";

  export let proposal: ProposalOverviewType;
</script>

<div
  class="flex flex-col m-5 rounded-3xl text-center bg-green-400 hover:bg-green-700 cursor-pointer "
  on:click={() => push(`/proposal/${proposal.id}`)}
>
  <ProposalOverview {proposal} />
</div>

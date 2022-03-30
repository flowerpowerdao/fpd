<script lang="ts">
  import { NewProposal, store } from "../store";
  import { onDestroy, onMount } from "svelte";
  import CreateProposalModal from "../components/CreateProposalModal.svelte";
  import { fromVariantToString } from "../utils";
  import ProposalOverview from "../components/ProposalOverview.svelte";

  $: openProposals = $store.proposals.filter(
    (proposal) => fromVariantToString(proposal.state) === "open",
  );
  $: closedProposals = $store.proposals.filter(
    (proposal) =>
      fromVariantToString(proposal.state) === "adopted" ||
      fromVariantToString(proposal.state) === "rejected",
  );

  let proposal: NewProposal = {
    title: "",
    description: "",
    options: [""],
  };

  onMount(async () => {
    await store.fetchProposals();
  });

  const interval = setInterval(async () => {
    await store.fetchProposals();
    // fetch every minute
  }, 60000);

  onDestroy(() => clearInterval(interval));
</script>

<header class="proposals">
  {#if $store.error}
    <div class="error">
      {$store.error}
    </div>
  {/if}

  {#if $store.isAuthed && $store.votingPower > 0}
    <CreateProposalModal {proposal} />
  {/if}
</header>
<div class="text-xl">Open Proposals</div>
<div>
  {#each openProposals as proposal}
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">
        <ProposalOverview {proposal} />
      </ul>
    </div>
  {/each}
</div>

<div class="text-xl">Closed Proposals</div>
<div>
  {#each closedProposals as proposal}
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">
        <ProposalOverview {proposal} />
      </ul>
    </div>
  {/each}
</div>

<style>
  .proposals {
    margin-top: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
  }
</style>

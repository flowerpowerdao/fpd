<script lang="ts">
  import { store } from "../store";
  import { pop } from "svelte-spa-router";
  import { onMount } from "svelte";
  import spinner from "../assets/loading.gif";

  import Button from "../components/Button.svelte";
  import ProposalCard from "../components/ProposalCard.svelte";

  let loading = false;

  onMount(async () => {
    if ($store.proposals.length === 0 || $store.proposalHistory.length === 0) {
      loading = true;
      await Promise.all([store.fetchProposals(), store.fetchProposalHistory()]);
      loading = false;
    }
  });

  // filter proposals for propsals that are in voting history
  $: proposals = $store.proposals.filter((proposal) => {
    return $store.proposalHistory.includes(proposal.id);
  });
</script>

<div class="pb-24">
  <!-- header buttons -->
  <div class="my-10">
    <Button eventHandler={() => pop()}>← back</Button>
  </div>
  {#if !$store.isAuthed}
    <p class="mt-14 text-2xl">
      You need to be logged in to see your proposal history ¯\_(ツ)_/¯
    </p>
  {:else if loading}
    <img src={spinner} alt="loading animation" />
  {:else}
    <!-- mobile -->
    <!-- voting history -->

    <ul class="">
      {#each proposals as proposal}
        <ProposalCard {proposal} />
      {/each}
    </ul>
  {/if}
</div>

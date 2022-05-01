<script lang="ts">
  import { store } from "../store";
  import { pop } from "svelte-spa-router";
  import spinner from "../assets/loading.gif";

  import Button from "../components/Button.svelte";
  import ProposalCard from "../components/ProposalCard.svelte";

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
  {:else if $store.isLoading}
    <img src={spinner} alt="loading animation" />
  {:else if proposals.length === 0}
    <p class="mt-14 text-2xl">You haven't submitted any proposals yet 🥺</p>
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

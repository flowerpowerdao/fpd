<script lang="ts">
  import { onMount } from "svelte";
  import { store } from "../store";
  import ProposalOverview from "../components/ProposalOverview.svelte";

  let fetchVotingHistory = async () => {
    await store.fetchProposals();
    await store.fetchVotingHistory();
  };

  $: proposals = $store.proposals.filter((proposal) => {
    return $store.votingHistory.includes(proposal.id);
  });

  onMount(fetchVotingHistory);
</script>

{#if !proposals}
  <p>Fetching voting history..</p>
{:else}
  <div class="px-4">
    <div>Voting history</div>
    <div class="flow-root mt-6">
      <ul class="-my-5 divide-y divide-gray-200">
        {#each proposals as proposal}
          <ProposalOverview {proposal} />
        {/each}
      </ul>
    </div>
  </div>
{/if}

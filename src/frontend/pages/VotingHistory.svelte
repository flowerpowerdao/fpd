<script lang="ts">
  import { store } from "../store";
  import ProposalOverview from "../components/ProposalOverview.svelte";

  $: proposals = $store.proposals.filter((proposal) => {
    return $store.votingHistory.includes(proposal.id);
  });
</script>

{#if !$store.isAuthed}
  <p>You need to be logged in to see your voting history.</p>
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

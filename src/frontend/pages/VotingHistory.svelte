<script lang="ts">
  import { store } from "../store";
  import { push } from "svelte-spa-router";

  import ProposalOverview from "../components/ProposalCard.svelte";
  import Button from "../components/Button.svelte";
import Card from "../components/Card.svelte";

  $: proposals = $store.proposals.filter((proposal) => {
    return $store.votingHistory.includes(proposal.id);
  });
</script>

{#if !$store.isAuthed}
  <p class="mt-14 text-2xl">
    You need to be logged in to see your voting history ¯\_(ツ)_/¯
  </p>
{:else}
  <Button eventHandler={() => push("/")}>← back</Button>
  <Card>
    <h1 class="text-2xl">voting history:</h1>
  </Card>
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

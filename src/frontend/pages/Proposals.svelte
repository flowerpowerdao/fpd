<script lang="ts">
  import { store } from "../store";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";

  import ProposalOverview from "../components/ProposalCard.svelte";
  import Filters from "../components/Filters.svelte";
  import Button from "../components/Button.svelte";

  async function fetchProposals() {
    await store.fetchProposals();
    await store.filterProposals();
  }

  onMount(async () => {
    if ($store.proposals.length === 0) {
      fetchProposals();
    }
  });
</script>

<!-- mobile -->
<header class="my-10">
  {#if $store.isAuthed && $store.votingPower > 0}
    <Button eventHandler={() => push("/create-proposal")}
      >create proposal</Button
    >
  {/if}
  <Filters />
</header>

<ul class="pb-24">
  {#each $store.filteredProposals as proposal}
    <ProposalOverview {proposal} />
  {/each}
</ul>

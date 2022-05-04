<script lang="ts">
  import { store } from "../store";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";

  import ProposalCard from "../components/ProposalCard.svelte";
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
<header class="lg:hidden py-10">
  {#if $store.isAuthed && $store.votingPower > 0}
    <Button eventHandler={() => push("/create-proposal")}
      >create proposal</Button
    >
  {/if}
  <Filters />
</header>

<!-- desktop -->
<header class="hidden lg:flex pt-40 pb-8 justify-between mx-[11%]">
  <div class="flex justify-start lg:max-w-xs 2xl:max-w-md flex-1">
    {#if $store.isAuthed && $store.votingPower > 0}
      <Button eventHandler={() => push("/create-proposal")}
        >create proposal</Button
      >
    {/if}
  </div>
  <div class="flex justify-end flex-1">
    <Filters />
  </div>
</header>

<!-- mobile & desktop -->
<ul class="pb-24 flex flex-col gap-4">
  {#each $store.filteredProposals as proposal}
    <ProposalCard {proposal} />
  {/each}
</ul>

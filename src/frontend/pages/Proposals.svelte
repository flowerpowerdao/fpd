<script lang="ts">
  import { NewProposal, store } from "../store";
  import { onDestroy, onMount } from "svelte";
  import CreateProposalModal from "../components/CreateProposalModal.svelte";
  import ProposalOverview from "../components/ProposalCard.svelte";
  import Filters from "../components/Filters.svelte";
  import { push } from "svelte-spa-router";
  import Button from "../components/Button.svelte";

  let newProposal: NewProposal = {
    title: "",
    description: "",
    options: [""],
  };

  onMount(async () => {
    await store.fetchProposals();
    store.filterProposals();
  });

  // fetch every minute
  const interval = setInterval(async () => {
    await store.fetchProposals();
    store.filterProposals();
  }, 60000);

  onDestroy(() => clearInterval(interval));
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

<!-- desktop -->
<header
  class="hidden sm:flex mt-36 flex-col items-center justify-center [font-size:calc(10px+2vmin)]"
>
  {#if $store.error}
    <div class="error">
      {$store.error}
    </div>
  {/if}

  {#if $store.isAuthed && $store.votingPower > 0}
    <CreateProposalModal proposal={newProposal} />
  {/if}
</header>

<ul class="pb-14">
  {#each $store.filteredProposals as proposal}
    <ProposalOverview {proposal} />
  {/each}
</ul>

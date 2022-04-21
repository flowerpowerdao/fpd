<script lang="ts">
  import { NewProposal, store } from "../store";
  import { onDestroy, onMount } from "svelte";
  import CreateProposalModal from "../components/CreateProposalModal.svelte";
  import ProposalOverview from "../components/ProposalOverview.svelte";
  import Filters from "../components/Filters.svelte";
  import DarkMode from "../components/DarkMode.svelte";

  let newProposal: NewProposal = {
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

<!-- mobile -->
<header class="my-10">
  <Filters />
</header>

<DarkMode />

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

<div>
  {#each $store.proposals as proposal}
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">
        <ProposalOverview {proposal} />
      </ul>
    </div>
  {/each}
</div>

<script lang="ts">
  import { store } from "../store";
  import type { ProposalOverview as ProposalOverviewType } from "../../declarations/dao/dao.did";
  import { onMount } from "svelte";
  import OpenProposal from "../components/OpenProposal.svelte";
  import ClosedProposal from "../components/ClosedProposal.svelte";
  import Modal from "../components/Modal.svelte";

  let openProposals: ProposalOverviewType[] = [];
  let closedProposals: ProposalOverviewType[] = [];

  onMount(async () => {
    const proposals = await store.fetchProposals();
    openProposals = proposals.openProposals;
    closedProposals = proposals.closedProposals;
  });
</script>

<header class="App-header">
  {#if $store.error}
    <div class="error">
      {$store.error}
    </div>
  {/if}

  {#if $store.isAuthed}
    <Modal />
  {/if}
</header>
<div class="text-4xl">Open Proposals</div>
<div>
  {#each openProposals as proposal}
    <OpenProposal {proposal} />
  {/each}
</div>

<div class="text-4xl">Closed Proposals</div>
<div>
  {#each closedProposals as proposal}
    <ClosedProposal {proposal} />
  {/each}
</div>

<style global>
  .App-logo {
    height: 15vmin;
    pointer-events: none;
  }

  .App-header {
    margin-top: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
  }

  .App-link {
    color: rgb(26, 117, 255);
  }

  .demo-button {
    background: #a02480;
    padding: 0 1.3em;
    margin-top: 1em;
    border-radius: 60px;
    font-size: 0.7em;
    height: 35px;
    outline: 0;
    border: 0;
    cursor: pointer;
    color: white;
  }

  .demo-button:active {
    color: white;
    background: #979799;
  }
</style>

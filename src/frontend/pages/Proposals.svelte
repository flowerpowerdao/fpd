<script lang="ts">
  import { store } from "../store";
  import type {
    ProposalOverview as ProposalOverviewType,
    Result_1,
  } from "../../declarations/dao/dao.did";
  import { fromErr, fromOk, isOk } from "../utils";
  import { onMount } from "svelte";
  import OpenProposal from "../components/OpenProposal.svelte";
  import ClosedProposal from "../components/ClosedProposal.svelte";
  import { fromVariantToString } from "../utils";

  let openProposals: ProposalOverviewType[] = [];
  let closedProposals: ProposalOverviewType[] = [];
  let proposalReturn: Result_1;
  let principal: string = "";

  const fetchProposals = async () => {
    let proposals = await $store.actor.listProposalOverviews();

    openProposals = proposals.filter(
      (proposal) => fromVariantToString(proposal.state) === "open",
    );
    closedProposals = proposals.filter(
      (proposal) => fromVariantToString(proposal.state) === "closed",
    );
  };

  const whoAmI = async () => {
    principal = await $store.actor.whoAmI();
  };

  const submitProposal = async () => {
    proposalReturn = await $store.actor.submitProposal(
      "My first proposal",
      "a great description",
      ["fishing", "swimming", "dancing"],
      BigInt(1),
    );
  };

  onMount(async () => {
    await fetchProposals();
  });
</script>

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

<header class="App-header">
  <button class="demo-button" on:click={submitProposal}>
    Create Proposal: <br />{proposalReturn
      ? isOk(proposalReturn)
        ? fromOk(proposalReturn)
        : fromErr(proposalReturn)
      : "hi"}
  </button>
  <button class="demo-button" on:click={fetchProposals}>
    List Proposals
  </button>
  <button class="demo-button" on:click={whoAmI}>
    {principal}
  </button>
</header>

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

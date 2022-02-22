<script lang="ts">
  import { dao } from "canisters/dao";
  import type { Proposal, Result_1 } from ".dfx/local/canisters/dao/dao.did";
  import { fromErr, fromOk, isOk } from "../utils";

  let proposals: Proposal[] = [];
  let proposalReturn: Result_1;

  const listProposals = async () => {
    proposals = await dao.list_proposals();
  };

  const submitProposal = async () => {
    proposalReturn = await dao.submit_proposal("My first proposal", [
      "fishing",
      "swimming",
      "dancing",
    ]);
  };
</script>

<header class="App-header">
  <button class="demo-button" on:click={submitProposal}>
    Create Proposal: <br />{proposalReturn
      ? isOk(proposalReturn)
        ? fromOk(proposalReturn)
        : fromErr(proposalReturn)
      : "hi"}
  </button>
  <button class="demo-button" on:click={listProposals}>
    List Proposals:
    {#each proposals as proposal}
      {proposal.description}
    {/each}
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

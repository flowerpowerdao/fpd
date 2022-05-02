<script lang="ts">
  import type { ProposalView as Proposal } from "../../declarations/dao/dao.did.d";
  import { store } from "../store";
  import spinner from "../assets/loading.gif";
  import Button from "./Button.svelte";

  let loading = false;
  let error;
  export let confetti;
  export let selected;
  export let proposal: Proposal;
  export let toggleModal;
  export let fetchProposal;

  async function castVote() {
    loading = true;
    const res = await $store.daoActor.vote({
      proposalId: proposal.id,
      option: BigInt(selected),
    });
    if ("ok" in res) {
      await Promise.all([store.fetchVotingHistory(), store.fetchProposals()]);
      store.filterProposals();
      await fetchProposal();
      confetti = false;
      confetti = true;
      toggleModal();
    } else if ("err" in res) {
      error = res.err;
    } else {
      error = "There was error casting your vote";
    }
    loading = false;
    console.log("vote cast", res);
  }
</script>

<!-- mobile -->
<div>
  <div
    class="fixed flex justify-center items-center z-10 inset-0 bg-opacity-10 backdrop-blur-sm"
  >
    <div
      class="flex flex-col bg-white dark:bg-black border-black dark:border-white border-2 rounded-xl h-1/2 w-full mx-2 pt-4 px-4"
    >
      <div class="flex flex-row justify-between dark:text-white">
        <p class="font-everett-medium text-3xl">are you sure?</p>
        <div
          class="cursor-pointer flex justify-center items-center font-mono text-lg rounded-full border-2 border-black dark:border-white  w-10 h-10"
          on:click={toggleModal}
        >
          x
        </div>
      </div>
      <div class="mt-2 dark:text-white">
        <p>selected option: {proposal.options[selected]}</p>
        <p>voting power: {$store.votingPower}</p>
      </div>
      <div class="flex gap-3 flex-col flex-1 justify-center items-center">
        <Button eventHandler={castVote} disabled={loading}>
          {#if loading}
            <img class="h-6" src={spinner} alt="loading animation" />
          {:else}
            submit
          {/if}
        </Button>
        <Button eventHandler={toggleModal}>cancel</Button>
      </div>
      <div>
        {#if error}
          <p class="text-red-500">{error}</p>
        {/if}
      </div>
    </div>
  </div>
</div>

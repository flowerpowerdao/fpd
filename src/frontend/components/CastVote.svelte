<script lang="ts">
  import { fromVariantToString, truncate } from "../utils";
  import type { ProposalView as Proposal } from "../../declarations/dao/dao.did.d";
  import CastVoteModal from "./CastVoteModal.svelte";
  import { store } from "../store";
  import { onMount } from "svelte";

  let openModal = false;
  let selected;
  export let proposal: Proposal;

  $: alreadyVoted = $store.votingHistory.includes(proposal.id);

  function toggleModal() {
    openModal = !openModal;
  }
  function handleEscape({ key }) {
    if (key === "Escape") {
      openModal = false;
    }
  }

  onMount(async () => {
    // fetch voting history to mitigate the case where user open the proposal details page directly
    await store.fetchVotingHistory();
  });

  console.log($store);
</script>

<svelte:window on:keyup={handleEscape} />

{#if fromVariantToString(proposal.state) === "open"}
  <div
    class=" bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-xl mx-2 my-4"
  >
    <div class="p-2 flex flex-col justify-between min-h-[360px]">
      <h1 class="font-everett-medium text-3xl">cast your vote</h1>
      <div class="flex flex-col justify-center gap-2">
        {#each proposal.options as option, index}
          <button
            class="{index === selected
              ? 'shadow'
              : ''} text-xl bg-white dark:bg-black border-2 border-black dark:border-white dark:text-white rounded-3xl h-12 w-full font-mono"
            on:click={() => (selected = index)}
          >
            {truncate(option, 20)}
          </button>
        {/each}
      </div>
      <div>
        <button
          class="disabled:cursor-not-allowed active: text-xl bg-white dark:bg-black border-2 border-black dark:border-white dark:text-white rounded-3xl h-12 w-full font-mono"
          disabled={selected === undefined ||
            alreadyVoted ||
            $store.votingPower < 1}
          on:click={toggleModal}
        >
          submit vote →
        </button>
        {#if alreadyVoted}
          <p class="text-center">you already voted on this proposal</p>
        {/if}
      </div>
    </div>
  </div>

  {#if openModal}
    <CastVoteModal {selected} {proposal} {toggleModal} />
  {/if}
{/if}

<script lang="ts">
  import { fromVariantToString } from "../utils";
  import type { ProposalView as Proposal } from "../../declarations/dao/dao.did.d";
  import { store } from "../store";
  import { onMount } from "svelte";
  import { ConfettiExplosion } from "svelte-confetti-explosion";

  import CastVoteModal from "./CastVoteModal.svelte";
  import Card from "./Card.svelte";
  import LoginModal from "./LoginModal.svelte";

  let openModal = false;
  let openLogin = false;
  let confetti = false;
  let selected;

  export let proposal: Proposal;
  export let fetchProposal;

  $: alreadyVoted = $store.votingHistory
    .map((element) => element.id)
    .includes(proposal.id);

  function toggleModal() {
    openModal = !openModal;
  }

  function toggleLogin() {
    openLogin = !openLogin;
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
</script>

<svelte:window on:keyup={handleEscape} />

{#if confetti}
  <div class="fixed bottom-0">
    <ConfettiExplosion
      particlesShape="circles"
      colors={["#BB64D2", "#24A0F5", "#FED030", "#FC514B"]}
      force={1}
    />
  </div>
{/if}

{#if fromVariantToString(proposal.state) === "open"}
  <Card style="mx-2">
    {@const vote = $store.votingHistory.find(
      (element) => Number(element.id) === Number(proposal.id),
    )}
    <div
      class="p-2 lg:p-4 flex flex-col justify-between min-h-[360px] text-xl lg:text-base 2xl:text-xl"
    >
      <h1 class="font-everett-medium text-3xl 2xl:text-4xl mb-12">
        cast your vote
      </h1>
      <div class="flex flex-col justify-center gap-2">
        {#each proposal.options as option, index}
          <button
            class="
              {index === selected ? 'shadow' : ''} 
              {Number(vote?.option) === index ? 'shadow' : ''}
              truncate px-4 bg-white dark:bg-black border-2 border-black dark:border-white dark:text-white rounded-3xl h-12 w-full font-mono"
            on:click={() => (selected = index)}
            disabled={alreadyVoted}
          >
            {option}
          </button>
        {/each}
      </div>
      <div class="flex justify-center flex-col items-center mt-12">
        <button
          class="max-w-md disabled:cursor-not-allowed bg-white dark:bg-black border-2 border-black dark:border-white dark:text-white rounded-3xl h-12 w-full font-mono"
          disabled={selected === undefined || alreadyVoted}
          on:click={$store.isAuthed ? toggleModal : toggleLogin}
        >
          submit vote →
        </button>
        {#if alreadyVoted}
          <p class="text-center">you already voted on this proposal</p>
        {/if}
      </div>
    </div>
  </Card>
  {#if openModal}
    <CastVoteModal
      {selected}
      {proposal}
      {fetchProposal}
      {toggleModal}
      bind:confetti
    />
  {/if}
  {#if openLogin}
    <LoginModal toggleModal={toggleLogin} />
  {/if}
{/if}

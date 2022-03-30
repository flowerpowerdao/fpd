<script lang="ts">
  import { onMount } from "svelte";

  import type {
    OpenProposal,
    ClosedProposal,
  } from "../../declarations/dao/dao.did.d";
  import { store } from "../store";
  import { fromTimestamp } from "../utils";
  import CastVoteModal from "./CastVoteModal.svelte";

  export let openModal = false;
  export let loading = false;
  export let proposal: OpenProposal | ClosedProposal;
  export let error = "";
  let selectedOptionIndex = 0;

  let optionsGroup = 0;

  $: alreadyVoted = $store.votingHistory.includes(proposal.id);

  const toggleModal = () => {
    openModal = !openModal;
  };

  const castVote = async () => {
    loading = true;
    const res = await $store.daoActor.vote({
      proposalId: proposal.id,
      option: BigInt(selectedOptionIndex),
    });
    if ("ok" in res) {
      toggleModal();
    } else if ("err" in res) {
      error = res.err;
    } else {
      error = "There was error casting your vote";
    }
    loading = false;
    console.log("vote cast", res);
  };
  onMount(async () => {
    // fetch voting history to mitigate the case where user open the proposal details page directly
    // @TODO maybe we need an init store where we fetch all state?
    await store.fetchVotingHistory();
  });
</script>

<div class="mt-10 sm:mt-0">
  <div class="mt-5 md:mt-0 md:col-span-2">
    <form>
      <div class="shadow overflow-hidden sm:rounded-md ml-4 mr-4">
        <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
          <fieldset>
            <div>
              <legend class="text-base font-medium text-gray-900"
                >Proposal No. {proposal?.id}
              </legend>
              <p class="text-lg mt-3">
                {proposal.title}
              </p>

              <p class="text-xs text-gray-500">
                Expiry Date: {fromTimestamp(
                  proposal.expiryDate,
                ).toLocaleString()}
              </p>
              <p class="text-xs text-gray-500">
                Total Votes Casted: {proposal.totalVotes}
              </p>
              <p class="text-s mt-3">
                {proposal?.description}
              </p>
            </div>
            <div class="mt-4 space-y-4">
              {#each proposal.options as option, index}
                <div class="flex items-center">
                  <input
                    id={`option-${index}`}
                    name={`option-${index}`}
                    bind:group={optionsGroup}
                    value={index}
                    type="radio"
                    class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    on:change={() => {
                      selectedOptionIndex = index;
                    }}
                  />
                  <label
                    for={`option-${index}`}
                    class="ml-3 block text-sm font-medium text-gray-700"
                  >
                    {option.text}
                  </label>
                </div>
              {/each}
            </div>
          </fieldset>
          {#if alreadyVoted}
            <div class="rounded-md bg-yellow-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <!-- Heroicon name: solid/exclamation -->
                  <svg
                    class="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-yellow-800">
                    You already voted on this proposal
                  </h3>
                </div>
              </div>
            </div>
          {/if}
        </div>
        <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            disabled={alreadyVoted}
            on:click|preventDefault={(e) => {
              error = "";
              toggleModal();
            }}
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >{alreadyVoted ? "You aleady voted" : "Confirm your vote"}</button
          >
        </div>
      </div>
    </form>
  </div>
</div>

{#if true}
  <CastVoteModal
    votingPower={$store.votingPower}
    selectedOption={proposal.options[selectedOptionIndex].text}
    {toggleModal}
    {castVote}
    {openModal}
    {loading}
    {error}
  />
{/if}

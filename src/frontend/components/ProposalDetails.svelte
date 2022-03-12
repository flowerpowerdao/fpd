<script lang="ts">
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

  let optionsGroup = 1;

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
                      console.log(index);
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
        </div>
        <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            on:click={(e) => {
              e.preventDefault();
              error = "";
              toggleModal();
            }}
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >Confirm your vote</button
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

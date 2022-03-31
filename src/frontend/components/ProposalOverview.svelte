<script lang="ts">
  import { push } from "svelte-spa-router";
  import type { ProposalView as Proposal } from "../../declarations/dao/dao.did";
  import { store } from "../store";
  import { fromTimestamp, fromVariantToString } from "../utils";

  export let proposal: Proposal;
  $: alreadyVoted = $store.votingHistory.includes(proposal.id);
</script>

<div class="bg-white shadow overflow-hidden sm:rounded-md">
  <li>
    <!-- svelte-ignore a11y-missing-attribute -->
    <a
      on:click={() => push(`/proposals/${proposal.id}`)}
      class="block hover:bg-gray-50 cursor-pointer"
    >
      <div class="px-4 py-4 flex items-center sm:px-6">
        <div class="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
          <div class="truncate">
            <div class="flex items-center">
              <p class="mr-1 flex-shrink-0 font-normal text-gray-500 text-sm">
                #{proposal.id}
              </p>
              <p class="font-medium text-indigo-600 truncate text-lg">
                {proposal.title}
              </p>
            </div>

            <div class="mt-2 flex">
              <div class="flex items-center text-sm text-gray-500">
                <!-- Heroicon name: solid/calendar -->
                {#if fromVariantToString(proposal.state) === "open"}
                  <svg
                    class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <p>
                    Expiry Date
                    <time
                      datetime={fromTimestamp(
                        proposal.expiryDate,
                      ).toLocaleString()}
                      >{fromTimestamp(
                        proposal.expiryDate,
                      ).toLocaleString()}</time
                    >
                  </p>
                {:else}
                  <div class="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                    <div class="ml-2 flex-shrink-0 flex">
                      {#if fromVariantToString(proposal.state) === "rejected"}
                        <p
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                        >
                          rejected
                        </p>
                      {:else}
                        <p
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                        >
                          adopted
                        </p>
                      {/if}
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
        {#if $store.isAuthed && alreadyVoted}
          <div class="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
            <div class="ml-2 flex-shrink-0 flex">
              <p
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
              >
                voted
              </p>
            </div>
          </div>
        {/if}
        <div class="ml-5 flex-shrink-0">
          <!-- Heroicon name: solid/chevron-right -->
          <svg
            class="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
    </a>
  </li>
</div>

<script lang="ts">
  import { onMount } from "svelte";
  import { store } from "../store";
  import { getVariantValue } from "../utils";

  let fetchVotingHistory = async () => {
    await store.fetchVotingHistory();
    await store.fetchProposals();
  };

  $: proposals = $store.proposals
    .filter((proposal) => {
      return $store.votingHistory.includes(getVariantValue(proposal).id);
    })
    .map((proposal) => getVariantValue(proposal));

  onMount(fetchVotingHistory);
</script>

{#if !proposals}
  <p>Fetching voting history..</p>
{:else}
  <div class="px-4">
    <div>Voting history</div>
    <div class="flow-root mt-6">
      <ul class="-my-5 divide-y divide-gray-200">
        {#each proposals as p}
          <li class="py-4">
            <div class="flex items-center space-x-4">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {p.title}
                </p>
                <p class="text-sm text-gray-500 truncate">
                  {p.state["open"] === null ? "Open" : "Closed"}
                </p>
              </div>
              <div>
                Total votes {p.totalVotes}
              </div>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </div>
{/if}

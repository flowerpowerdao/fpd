<script lang="ts">
  import { store } from "../store";
  import { pop, push } from "svelte-spa-router";
  import spinner from "../assets/loading.gif";

  import Button from "../components/Button.svelte";
  import Card from "../components/Card.svelte";
  import { onMount } from "svelte";

  let loading = false;

  onMount(async () => {
    if ($store.proposals.length === 0 || $store.votingHistory.length === 0) {
      console.log("MOIN");
      loading = true;
      await Promise.all([store.fetchProposals(), store.fetchVotingHistory()]);
      loading = false;
    }
  });
</script>

<!-- mobile -->
<div class="pb-24">
  <!-- header buttons -->
  <div class="my-10">
    <Button eventHandler={() => pop()}>← back</Button>
  </div>
  {#if !$store.isAuthed}
    <p class="mt-14 text-2xl">
      You need to be logged in to see your voting history ¯\_(ツ)_/¯
    </p>
  {:else if loading}
    <img src={spinner} alt="loading spinner" />
  {:else}
    <!-- voting history -->
    <Card>
      <div class="p-2 flex flex-col">
        <h1 class="font-everett-medium text-3xl">voting history:</h1>
        <table class="mt-4">
          <thead>
            <tr class="font-mono">
              <th class="text-left">id</th>
              <th class="text-left">titel</th>
              <th class="text-right">option</th>
            </tr>
          </thead>
          <tbody>
            {#each $store.votingHistory as vote}
              {@const proposal = $store.proposals.find(
                (element) => Number(element.id) === Number(vote.id),
              )}
              <!-- this is needed, otherwise votingHistory might be fetched before
              proposals and proposal.title is undefined -->
              {#if proposal}
                <tr
                  class="cursor-pointer"
                  on:click={() => push(`/proposals/${Number(vote.id)}`)}
                >
                  <!-- max-w-0 is needed for truncate to work correctly 
                  https://stackoverflow.com/questions/9789723/css-text-overflow-in-a-table-cell -->
                  <td class="truncate max-w-0">{vote.id}</td>
                  <td class="truncate max-w-0">{proposal.title}</td>
                  <td class="text-right truncate max-w-0"
                    >{proposal.options[Number(vote.option)]}</td
                  >
                </tr>
              {/if}
            {/each}
          </tbody>
        </table>
      </div>
    </Card>
  {/if}
</div>

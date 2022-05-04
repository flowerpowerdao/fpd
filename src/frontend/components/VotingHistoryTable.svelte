<script lang="ts">
  import { store } from "../store";
  import { push } from "svelte-spa-router";
  import spinner from "../assets/loading.gif";

  import Card from "../components/Card.svelte";
</script>

{#if !$store.isAuthed}
  <p class="mt-14 text-2xl">
    You need to be logged in to see your voting history ¯\_(ツ)_/¯
  </p>
{:else if $store.isLoading}
  <img src={spinner} alt="loading spinner" />
{:else if $store.votingHistory.length === 0}
  <p class="mt-14 text-2xl">You haven't voted on any proposals yet 🥺</p>
{:else}
  <!-- voting history -->
  <Card style="lg:mx-2">
    <div class="p-2 flex flex-col lg:text-xl">
      <h1 class="font-everett-medium text-3xl 2xl:text-4xl">voting history:</h1>
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

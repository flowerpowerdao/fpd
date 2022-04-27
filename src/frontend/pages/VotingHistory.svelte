<script lang="ts">
  import { store } from "../store";
  import { pop, push } from "svelte-spa-router";
  import { truncate } from "../utils";

  import Button from "../components/Button.svelte";
  import Card from "../components/Card.svelte";
  import { onMount } from "svelte";

  onMount(async () => {
    if (!$store.proposals) {
      await store.fetchProposals();
    }
  });
</script>

{#if !$store.isAuthed}
  <p class="mt-14 text-2xl">
    You need to be logged in to see your voting history ¯\_(ツ)_/¯
  </p>
{:else}
  <!-- mobile -->
  <div class="pb-24">
    <!-- header buttons -->
    <div class="my-10">
      <Button eventHandler={() => pop()}>← back</Button>
    </div>
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
                  <td>{vote.id}</td>
                  <td>{truncate(proposal.title, 30)}</td>
                  <td class="text-right"
                    >{truncate(proposal.options[Number(vote.option)], 30)}</td
                  >
                </tr>
              {/if}
            {/each}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
{/if}

<script lang="ts">
  import { onMount } from "svelte";
  import type { ProposalView as Proposal } from "../../declarations/dao/dao.did.d";
  import { store } from "../store";
  import { fromVariantToString } from "../utils";

  export let proposal: Proposal;

  // Holds table sort state.  Initialized to reflect table sorted by id column ascending.
  let sortBy = { col: "votes", ascending: false };

  $: sort = (column) => {
    if (sortBy.col == column) {
      sortBy.ascending = !sortBy.ascending;
    } else {
      sortBy.col = column;
      sortBy.ascending = true;
    }

    // Modifier to sorting function for ascending or descending
    let sortModifier = sortBy.ascending ? 1 : -1;

    let sort;

    if (column === "votes") {
      sort = (a, b) =>
        a[1].votesCast < b[1].votesCast
          ? -1 * sortModifier
          : a[1].votesCast > b[1].votesCast
          ? 1 * sortModifier
          : 0;
    } else if (column === "option") {
      sort = (a, b) =>
        proposal.options[Number(a[1].option)] <
        proposal.options[Number(b[1].option)]
          ? -1 * sortModifier
          : proposal.options[Number(a[1].option)] >
            proposal.options[Number(b[1].option)]
          ? 1 * sortModifier
          : 0;
    } else if (column === "principal") {
      sort = (a, b) =>
        a[0].toString().localeCompare(b[0].toString()) * sortModifier;
    }

    proposal.votes = proposal.votes.sort(sort);
  };

  let showTable = false;
  const toggleTable = () => {
    showTable = !showTable;
  };

  onMount(() => {
    let sort = (a, b) =>
      a[1].votesCast < b[1].votesCast
        ? -1 * -1
        : a[1].votesCast > b[1].votesCast
        ? 1 * -1
        : 0;
    proposal.votes = proposal.votes.sort(sort);
  });
</script>

{#if !(fromVariantToString(proposal.state) === "open")}
  <div
    class=" bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-xl mx-2 my-4"
  >
    <div class="p-2 flex flex-col">
      <h1 class="font-everett-medium text-3xl">votes:</h1>
      <p>{proposal.votesCast}</p>
      <table class="mt-4">
        <thead>
          <tr class="font-mono">
            <th
              class="text-left cursor-pointer"
              on:click={() => sort("principal")}
              >principal {sortBy.col === "principal"
                ? sortBy.ascending
                  ? "↑"
                  : "↓"
                : ""}</th
            >
            <th class="text-left cursor-pointer" on:click={() => sort("option")}
              >option {sortBy.col === "option"
                ? sortBy.ascending
                  ? "↑"
                  : "↓"
                : ""}</th
            >
            <th class="text-right cursor-pointer" on:click={() => sort("votes")}
              >votes {sortBy.col === "votes"
                ? sortBy.ascending
                  ? "↑"
                  : "↓"
                : ""}</th
            >
          </tr>
        </thead>
        <tbody>
          {#each showTable ? proposal.votes : proposal.votes.slice(0, 10) as vote}
            <tr
              class="{vote[0].toString() === $store.principal?.toString()
                ? 'border-y-2 border-black'
                : ''} "
            >
              <td
                >{vote[0].toString().slice(0, 5) +
                  "…" +
                  vote[0].toString().slice(-3)}</td
              >
              <td>{proposal.options[Number(vote[1].option)]}</td>
              <td class="text-right">{Number(vote[1].votesCast)}</td>
            </tr>
          {/each}
        </tbody>
        <tbody />
      </table>
      <button
        class="mt-4 flex-1 font-mono -ml-0.5 text-xl bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-b-3xl min-h-[40px]"
        on:click={toggleTable}
      >
        {showTable ? "hide ↑" : "show more ↓"}
      </button>
    </div>
  </div>
{/if}

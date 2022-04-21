<script lang="ts">
  import { store } from "../store";
  import { fromVariantToString } from "../utils";

  export function filter() {
    store.update((state) => ({
      ...state,
      // filter proposals according to the selected filters
      filteredProposals: $store.proposals.filter((proposal) => {
        return Object.keys(state.filters)
          .filter((key) => {
            return state.filters[key];
          })
          .includes(fromVariantToString(proposal.state));
      }),
    }));
  }
</script>

<header class="flex flex-row">
  <button
    class:shadow={$store.filters.open}
    on:click={() => {
      // toggle the filter in the store
      store.update((state) => ({
        ...state,
        filters: { ...state.filters, open: !state.filters.open },
      }));
      // filter the proposals according to the filter
      filter();
    }}
    class="text-xl bg-white dark:bg-black flex-1 border-2 border-black dark:border-white dark:text-white h-12 rounded-3xl font-mono italic"
  >
    open
  </button>
  <button
    class:shadow={$store.filters.adopted}
    on:click={() => {
      // toggle the filter in the store
      store.update((state) => ({
        ...state,
        filters: { ...state.filters, adopted: !state.filters.adopted },
      }));
      // filter the proposals according to the filter
      filter();
    }}
    class="text-xl bg-white dark:bg-black flex-1 border-2 border-black dark:border-white dark:text-white h-12 -ml-0.5 font-mono italic"
  >
    adopted
  </button>
  <button
    class:shadow={$store.filters.rejected}
    on:click={() => {
      // toggle the filter in the store
      store.update((state) => ({
        ...state,
        filters: { ...state.filters, rejected: !state.filters.rejected },
      }));
      // filter the proposals according to the filter
      filter();
    }}
    class="text-xl bg-white dark:bg-black flex-1 border-2 border-black dark:border-white dark:text-white h-12 -ml-0.5 rounded-t-3xl font-mono italic"
  >
    rejected
  </button>
</header>

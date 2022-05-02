<script lang="ts">
  import { store } from "../store";
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
      store.filterProposals();
    }}
    class="text-xl dark:shadow-white bg-white dark:bg-black flex-1 border-2 border-black dark:border-white dark:text-white h-12 rounded-3xl font-mono italic"
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
      store.filterProposals();
    }}
    class="text-xl dark:shadow-white bg-white dark:bg-black flex-1 border-2 border-black dark:border-white dark:text-white h-12 -ml-0.5 font-mono italic"
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
      store.filterProposals();
    }}
    class="text-xl dark:shadow-white bg-white dark:bg-black flex-1 border-2 border-black dark:border-white dark:text-white h-12 -ml-0.5 rounded-t-3xl font-mono italic"
  >
    rejected
  </button>
</header>

<script lang="ts">
  import Router from "svelte-spa-router";
  import Dashboard from "./pages/Dashboard.svelte";

  const routes = {
    // Exact path
    "/": Dashboard,

    // Using named parameters, with last being optional
    // "/author/:first/:last?": Author,

    // Wildcard parameter
    // "/book/*": Book,

    // Catch-all
    // This is optional, but if present it must be the last
    // "*": NotFound,
  };
</script>

<Router {routes} />

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

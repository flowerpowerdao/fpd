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
  body {
    margin: 0;
    font-family: Ropota, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>

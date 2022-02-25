<script lang="ts">
  import Router from "svelte-spa-router";
  import Dashboard from "./pages/Dashboard.svelte";
  import Header from "./components/Header.svelte";
  import "./global.css";
  import Proposal from "./components/Proposal.svelte";

  const routes = {
    // Exact path
    "/": Dashboard,
    "/proposal/:id": Proposal,

    // Using named parameters, with last being optional
    // "/author/:first/:last?": Author,

    // Wildcard parameter
    // "/book/*": Book,

    // Catch-all
    // This is optional, but if present it must be the last
    // "*": NotFound,
  };
</script>

<Header />
<Router {routes} />

<script lang="ts">
  import Router from "svelte-spa-router";
  import Header from "./components/Header.svelte";
  import "./global.css";
  import Proposal from "./components/Proposal.svelte";
  import Proposals from "./pages/Proposals.svelte";

  const routes = {
    // Exact path
    "/": Proposals,
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

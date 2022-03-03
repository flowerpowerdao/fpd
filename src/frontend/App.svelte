<script lang="ts">
  import Router from "svelte-spa-router";
  import Header from "./components/Header.svelte";
  import "./global.css";
  import Proposal from "./pages/Proposal.svelte";
  import Proposals from "./pages/Proposals.svelte";
  import NotFound from "./pages/NotFound.svelte";

  const routes = {
    // Exact path
    "/": Proposals,
    "/proposal/:id": Proposal,

    // Catch-all
    // This is optional, but if present it must be the last
    "*": NotFound,
  };
</script>

<Header />
<Router {routes} />

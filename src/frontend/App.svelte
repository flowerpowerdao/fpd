<script lang="ts">
  import Router from "svelte-spa-router";
  import Header from "./components/Header.svelte";
  import "./global.css";
  import Proposal from "./pages/Proposal.svelte";
  import Proposals from "./pages/Proposals.svelte";
  import NotFound from "./pages/NotFound.svelte";
  import VotingHistory from "./pages/VotingHistory.svelte";

  const routes = {
    // Exact path
    "/proposals": Proposals,
    "/proposals/:id": Proposal,
    "/voting_history": VotingHistory,

    // Catch-all
    // This is optional, but if present it must be the last
    "*": NotFound,
  };
</script>

<Header />
<Router {routes} />

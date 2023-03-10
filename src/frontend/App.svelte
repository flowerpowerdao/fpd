<script lang="ts">
  import Router from "svelte-spa-router";
  import Header from "./components/Header.svelte";
  import "./global.css";
  import Proposal from "./pages/Proposal.svelte";
  import Proposals from "./pages/Proposals.svelte";
  import NotFound from "./pages/NotFound.svelte";
  import VotingHistory from "./pages/VotingHistory.svelte";
  import Footer from "./components/Footer.svelte";
  import CreateProposal from "./pages/CreateProposal.svelte";
  import SubmittedProposals from "./pages/SubmittedProposals.svelte";
  import CheckVote from "./pages/CheckVote.svelte";
  import { polyfill } from "seamless-scroll-polyfill";
  import { store } from "./store";
  import { onMount } from "svelte";

  onMount(async () => {
    await store.checkConnections();
  });

  polyfill();

  const routes = {
    // Exact path
    "/": Proposals,
    "/proposals/:id": Proposal,
    "/voting-history": VotingHistory,
    "/create-proposal": CreateProposal,
    "/submitted-proposals": SubmittedProposals,
    "/check-vote": CheckVote,

    // Catch-all
    // This is optional, but if present it must be the last
    "*": NotFound,
  };
</script>

<Header />
<Router {routes} />
<Footer />

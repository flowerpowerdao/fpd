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
  import { polyfill } from "seamless-scroll-polyfill";

  polyfill();

  const routes = {
    // Exact path
    "/": Proposals,
    "/proposals/:id": Proposal,
    "/voting-history": VotingHistory,
    "/create-proposal": CreateProposal,
    "/submitted-proposals": SubmittedProposals,

    // Catch-all
    // This is optional, but if present it must be the last
    "*": NotFound,
  };
</script>

<Header />
<Router {routes} />
<Footer />

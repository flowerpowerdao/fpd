<script lang="ts">
  import { onMount } from "svelte";
  import type { ProposalView as Proposal } from "../../declarations/dao/dao.did.d";
  import { fromTimestamp, fromVariantToString, isOk, fromOk } from "../utils";
  import { store } from "../store";
  import ProposalDetails from "../components/ProposalDetails.svelte";

  // this is needed for URL params
  export let params;

  // variables
  let proposal: Proposal;
  let proposalState: string;

  // functions

  const fetchProposal = async () => {
    let result = await $store.daoActor.getProposal(BigInt(params.id));
    if (isOk(result)) {
      proposal = fromOk(result);
      proposalState = fromVariantToString(proposal.state);
    }
  };

  const calculateResults = (proposal: Proposal, option: BigInt): number => {
    let votesCastForOption = 0;
    proposal.votes.forEach((vote) => {
      if (vote[1].option === option) {
        votesCastForOption += 1;
      }
    });

    return votesCastForOption;
  };

  onMount(async () => {
    // check wether the proposal is already available
    let proposalFromStore = $store.proposals.find(
      (p) => p.id === BigInt(params.id),
    );
    // if not, fetch it
    if (!proposalFromStore) {
      await fetchProposal();
    } else {
      proposal = proposalFromStore;
      proposalState = fromVariantToString(proposal.state);
    }
  });
</script>

{#if proposal}
  <ProposalDetails {proposal} />
{:else}
  <div>No proposal found for ID {params.id}</div>
{/if}

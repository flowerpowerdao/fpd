<script lang="ts">
  import { onMount } from "svelte";
  import type { ProposalView as Proposal } from "../../declarations/dao/dao.did.d";
  import { isOk, fromOk } from "../utils";
  import { store } from "../store";
  import ProposalDetails from "../components/ProposalDetails.svelte";

  // this is needed for URL params
  export let params;

  // variables
  let proposal: Proposal;

  // functions

  const fetchProposal = async () => {
    let result = await $store.daoActor.getProposal(BigInt(params.id));
    if (isOk(result)) {
      proposal = fromOk(result);
    }
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
    }
  });
</script>

{#if proposal}
  <ProposalDetails {proposal} {fetchProposal} />
{:else}
  <div>No proposal found for ID {params.id}</div>
{/if}

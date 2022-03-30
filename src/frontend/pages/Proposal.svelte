<script lang="ts">
  import { onMount } from "svelte";
  import type { Proposal } from "../../declarations/dao/dao.did.d";
  import { fromTimestamp, fromNullable, fromVariantToString } from "../utils";
  import { store } from "../store";
  import ProposalDetails from "../components/ProposalDetails.svelte";

  // this is needed for URL params
  export let params;

  // variables
  let proposal: Proposal;
  let proposalState: string;

  // functions

  const fetchProposal = async () => {
    proposal = fromNullable(
      await $store.daoActor.getProposal(BigInt(params.id)),
    );
    if (proposal) proposalState = fromVariantToString(proposal.state);
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
  {#if proposalState === "closed"}
    <div class="flex flex-col m-5 rounded-3xl bg-slate-400 text-center p-5">
      <div class="text-2xl flex justify-between">
        <div>#{proposal.id}</div>
        <div>{proposal.title}</div>
      </div>
      <div class="">
        Expiry Date: {fromTimestamp(proposal.expiryDate).toLocaleString()}
      </div>
      <div class="">
        Total Votes Cast: {proposal.totalVotes} out of 2009 with percentage {(Number(
          proposal.totalVotes,
        ) /
          2099) *
          100}%
      </div>
      <div class="">
        Proposal state: <span class="text-lg">{proposalState}</span>
      </div>
      <div>
        Proposal Description {proposal.description}
      </div>
      {#each proposal.options as option, index}
        <div>
          <input
            id={`option-${index}`}
            name={`option-${index}`}
            value={index}
            type="radio"
            disabled
          />
          <label for={`option-${index}`}>
            {option.text},
          </label>
          Votes {option.votes}, Voters {fromVariantToString(option.voters) ===
          "empty"
            ? "None"
            : fromVariantToString(option.voters)}
        </div>
      {/each}
    </div>
  {:else}
    <ProposalDetails {proposal} />
  {/if}
{:else}
  <div>No proposal found for ID {params.id}</div>
{/if}

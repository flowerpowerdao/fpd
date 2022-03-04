<script lang="ts">
  import { onMount } from "svelte";
  import type {
    OpenProposal,
    ClosedProposal,
  } from "../../declarations/dao/dao.did.d";
  import {
    fromTimestamp,
    fromNullable,
    fromVariantToString,
    getVariantValue,
  } from "../utils";
  import { store } from "../store";
  import OpenOption from "../components/OpenOption.svelte";

  // this is needed for URL params
  export let params;

  // variables
  let proposal: OpenProposal | ClosedProposal;
  let status: string;

  // functions
  const isClosedProposal = (
    proposal: OpenProposal | ClosedProposal,
  ): proposal is ClosedProposal => {
    if (fromVariantToString(proposal.state) === "closed") {
      return true;
    } else {
      return false;
    }
  };

  const fetchProposal = async () => {
    let proposalView = await $store.daoActor.getProposal(BigInt(params.id));
    let temp = fromNullable(proposalView); // undefined or ProposalView
    if (temp) {
      status = fromVariantToString(temp);
      proposal = getVariantValue(temp);
    }
  };

  onMount(async () => {
    await fetchProposal();
  });
</script>

{#if proposal}
  {#if isClosedProposal(proposal)}
    <div class="flex flex-col m-5 rounded-3xl bg-slate-400 text-center p-5">
      <div class="text-2xl flex justify-between">
        <div>#{proposal.id}</div>
        <div>{proposal.title}</div>
      </div>
      <div class="">
        Expiry Date: {fromTimestamp(proposal.expiryDate).toLocaleString()}
      </div>
      <div class="">
        Total Votes Cast: {proposal.totalVotes}
      </div>
      <div>
        {proposal.description}
      </div>
      {#each proposal.options as option}
        <div>{option.text}</div>
        <div>{option.votes}</div>
        <div>{option.voters}</div>
      {/each}
    </div>
  {:else}
    <div class="flex flex-col m-5 rounded-3xl bg-green-400 text-center p-5">
      <div class="text-2xl flex justify-between">
        <div>#{proposal.id}</div>
        <div>{proposal.title}</div>
      </div>
      <div class="">
        Expiry Date: {fromTimestamp(proposal.expiryDate).toLocaleString()}
      </div>
      <div class="">
        Total Votes Cast: {proposal.totalVotes}
      </div>
      <div>
        {proposal.description}
      </div>
      {#each proposal.options as option}
        <div class="flex justify-center">
          <OpenOption {option} />
        </div>
      {/each}
    </div>
  {/if}
{:else}
  <div>No proposal found for ID {params.id}</div>
{/if}

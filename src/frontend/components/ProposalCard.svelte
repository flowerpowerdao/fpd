<script lang="ts">
  import { push } from "svelte-spa-router";
  import type { ProposalViewV3 as Proposal } from "../../declarations/dao/dao.did";
  import { store } from "../store";
  import { truncate } from "../utils";
  import Card from "./Card.svelte";

  import ProposalState from "./ProposalState.svelte";
  import Proposer from "./Proposer.svelte";
  import Voted from "./Voted.svelte";

  export let proposal: Proposal;

  $: alreadyVoted = $store.votingHistory
    .map((element) => element.id)
    .includes(proposal.id);
</script>

<!-- mobile -->
<li class="lg:hidden">
  <Card
    style={"cursor-pointer hover:shadow active:shadow dark:shadow-white mx-2 lg:mx-[10%]"}
  >
    <div
      on:click={() => {
        push(`/proposals/${proposal.id}`);
        // reset scroll position
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE
      }}
    >
      <div class="p-2 flex flex-col">
        <div class="flex justify-between items-center">
          <p>id: #{proposal.id}</p>
          <Proposer {proposal} />
        </div>
        <h1 class="font-everett-medium text-3xl mt-4">
          {truncate(proposal.title, 50)}
        </h1>
        <p class="mt-6 mb-7">
          {truncate(proposal.description, 100)}
        </p>
        <ProposalState {proposal} />
        {#if alreadyVoted}
          <Voted />
        {/if}
      </div>
    </div>
  </Card>
</li>

<!-- desktop -->
<li class="hidden lg:block ">
  <Card
    style={"cursor-pointer hover:shadow active:shadow dark:shadow-white mx-2 lg:mx-[10%]"}
  >
    <div
      on:click={() => {
        push(`/proposals/${proposal.id}`);
        // reset scroll position
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE
      }}
    >
      <div class="p-4 flex flex-col">
        <div class="flex justify-between">
          <div class="w-1/2 flex justify-between items-center 2xl:text-xl">
            <p class="">id: #{proposal.id}</p>
            <Proposer {proposal} />
          </div>
          <div class="w-full">
            <ProposalState {proposal} />
          </div>
        </div>
        <div class="flex">
          <div class="">
            <h1 class="font-everett-medium text-3xl 2xl:text-4xl mt-4">
              {truncate(proposal.title, 100)}
            </h1>
            <p class="mt-6 2xl:text-xl">
              {truncate(proposal.description, 200)}
            </p>
          </div>
          <div class="flex items-end justify-end w-48">
            {#if alreadyVoted}
              <Voted />
            {/if}
          </div>
        </div>
      </div>
    </div>
  </Card>
</li>

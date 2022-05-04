<script lang="ts">
  import { NewProposal } from "../store";
  import { pop } from "svelte-spa-router";
  import { store } from "../store";
  import { ConfettiExplosion } from "svelte-confetti-explosion";
  import spinner from "../assets/loading.gif";
  import SvelteMarkdown from "svelte-markdown";
  import Button from "../components/Button.svelte";
  import Card from "./Card.svelte";

  let proposal: NewProposal = {
    title: "",
    description: "",
    options: [""],
  };
  let loading = false;
  let confetti = false;
  let preview = false;

  const addOption = () => {
    proposal.options = [...proposal.options, ""];
  };

  function removeOption(index: number) {
    proposal.options.splice(index, 1);
    proposal.options = proposal.options;
  }

  const clearProposal = () => {
    proposal = {
      description: "",
      title: "",
      options: [""],
    };
  };

  const submitProposal = async () => {
    loading = true;
    await store.submitProposal(proposal);
    confetti = false;
    confetti = true;
    loading = false;
    clearProposal();
    await store.fetchProposals();
    store.filterProposals();
  };
</script>

{#if confetti}
  <div class="fixed bottom-0">
    <ConfettiExplosion
      particlesShape="circles"
      colors={["#BB64D2", "#24A0F5", "#FED030", "#FC514B"]}
      force={1}
    />
  </div>
{/if}

<!-- mobile -->
<div class="pb-24">
  <!-- header buttons -->
  <div class="my-10">
    <Button eventHandler={() => pop()}>← back</Button>
    <Button eventHandler={() => (preview = !preview)}>preview</Button>
  </div>
  <!-- form -->
  <form>
    <Card>
      <div class="p-2 flex flex-col">
        <h1 class="font-everett-medium text-3xl">create new proposal:</h1>
        <!-- title -->
        <div class="mt-10 flex flex-col mx-2 font-mono">
          <p class="italic">title:</p>
          <input
            type="text"
            class="p-2 bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-xl my-2"
            placeholder="my new fpdao proposal title"
            bind:value={proposal.title}
            required
          />
        </div>
        <!-- description -->
        <div class="mt-10 flex flex-col mx-2 font-mono">
          <p class="italic">description:</p>
          {#if preview}
            <article
              class="prose prose-black 2xl:prose-xl dark:prose-invert font-sans max-w-none"
            >
              <SvelteMarkdown source={proposal.description} />
            </article>
          {:else}
            <textarea
              type="text"
              class="p-2 bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-xl my-2"
              placeholder="you can write markdown here! to see the outcome click the 'preview' button at the top :)"
              bind:value={proposal.description}
              minlength="50"
              maxlength="50000"
              required
              rows="5"
            />
          {/if}
        </div>
        <!-- options -->
        <div class="mt-10 flex flex-col mx-2 font-mono">
          <p class="italic">options:</p>
          {#each proposal.options as option, index}
            <div
              class="flex justify-between p-2 bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-xl my-2"
            >
              <input
                type="text"
                class="flex-1 bg-white dark:bg-black"
                placeholder="an option people can vote on"
                bind:value={option}
                required
              />
              <button
                type="button"
                tabindex="-1"
                on:click|preventDefault={() => removeOption(index)}
                class="px-2">x</button
              >
            </div>
          {/each}
          <button
            tabindex="-1"
            class="p-2 hover:shadow shadow-black dark:shadow-white bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-xl my-2"
            on:click|preventDefault={addOption}
          >
            add option
          </button>
          <Button
            eventHandler={submitProposal}
            disabled={loading}
            style={"mt-10"}
          >
            {#if loading}
              <img class="h-6 block" src={spinner} alt="loading animation" />
            {:else}
              submit proposal →
            {/if}
          </Button>
          <p>{$store.error}</p>
        </div>
      </div>
    </Card>
  </form>
</div>

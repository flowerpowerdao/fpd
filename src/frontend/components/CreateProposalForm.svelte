<script lang="ts">
  import { NewProposal } from "../store";
  import { push } from "svelte-spa-router";
  import { store } from "../store";
  import spinner from "../assets/loading.gif";
  import SvelteMarkdown from "svelte-markdown";

  let proposal: NewProposal = {
    title: "",
    description: "",
    options: [""],
  };
  let loading = false;
  let preview = false;

  const addOption = () => {
    proposal.options = [...proposal.options, ""];
  };

  function removeOption(index: number) {
    console.log(proposal.options);
    proposal.options.splice(index, 1);
    proposal.options = proposal.options;
    console.log(proposal.options);
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
    loading = false;
    clearProposal();
    await store.fetchProposals();
  };
</script>

<!-- mobile -->
<div class="pb-24">
  <!-- header buttons -->
  <div class="my-10">
    <button
      class="hover:shadow shadow-black dark:shadow-white text-xl bg-white dark:bg-black  border-2 border-black dark:border-white dark:text-white h-12 w-full rounded-3xl font-mono -mb-0.5"
      on:click={() => push("/")}
    >
      ← back
    </button>
    <button
      class="hover:shadow shadow-black dark:shadow-white text-xl bg-white dark:bg-black  border-2 border-black dark:border-white dark:text-white h-12 w-full rounded-3xl font-mono -mb-0.5"
      on:click={() => (preview = !preview)}
    >
      preview
    </button>
  </div>
  <!-- form -->
  <form>
    <div
      class=" bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-xl mx-2 my-4"
    >
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
              class="prose prose-black dark:prose-invert font-sans max-w-none"
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
                on:click|preventDefault={() => removeOption(index)}
                class="px-2">x</button
              >
            </div>
          {/each}
          <button
            class="p-2 hover:shadow shadow-black dark:shadow-white bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-xl my-2"
            on:click|preventDefault={addOption}
          >
            add option
          </button>
          <button
            class="flex items-center justify-center mt-10 disabled:shadow-none hover:shadow shadow-black dark:shadow-white text-xl bg-white dark:bg-black  border-2 border-black dark:border-white dark:text-white h-12 w-full rounded-3xl font-mono -mb-0.5"
            on:click|preventDefault={submitProposal}
            disabled={loading}
          >
            {#if loading}
              <img class="h-6 block" src={spinner} alt="loading animation" />
            {:else}
              submit proposal →
            {/if}
          </button>
          <p>{$store.error}</p>
        </div>
      </div>
    </div>
  </form>
</div>

<!-- desktop -->
<form class="hidden sm:block pb-24" action="#" method="POST">
  <div class="shadow overflow-hidden sm:rounded-md">
    <div class="px-4 py-5 bg-white sm:p-6">
      <div class="grid grid-cols-6 gap-6">
        <div class="col-span-6">
          <label for="title" class="block text-sm font-medium text-gray-700"
            >Title</label
          >
          <input
            bind:value={proposal.title}
            type="text"
            name="title"
            id="title"
            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>

        <div class="col-span-6">
          <label
            for="description"
            class="block text-sm font-medium text-gray-700">Description</label
          >
          <input
            bind:value={proposal.description}
            type="text"
            name="description"
            id="description"
            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>

        <div class="col-span-6">
          <button
            on:click={addOption}
            type="button"
            class="inline-flex items-center py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700"
            >+ Add new option</button
          >
          {#each proposal.options as option, index}
            <label
              for={`option-${index + 1}`}
              class="block text-sm font-medium text-gray-700"
              >Option {index + 1}</label
            >
            <input
              bind:value={option}
              type="text"
              name={`option-${index + 1}`}
              id={`option-${index + 1}`}
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          {/each}
        </div>
      </div>
    </div>
  </div>
</form>

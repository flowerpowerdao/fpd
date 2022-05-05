<script lang="ts">
  import { store } from "../store";
  import { ConfettiExplosion } from "svelte-confetti-explosion";
  import spinner from "../assets/loading.gif";
  import SvelteMarkdown from "svelte-markdown";
  import Button from "../components/Button.svelte";
  import Card from "./Card.svelte";

  import {
    createForm,
    Form,
    Field,
    ErrorMessage,
    Textarea,
  } from "svelte-forms-lib";
  import { object, string, array } from "yup";

  let loading = false;
  let confetti = false;
  export let preview;

  // validation schema
  const schema = object({
    title: string()
      .required("Title is required")
      .min(10, "Title must be at least 10 characters")
      .max(100, "Title must be less than 100 characters"),
    description: string()
      .required("Description is required")
      .min(200, "Description must be at least 200 characters")
      .max(50000, "Description must be less than 50000 characters"),
    options: array()
      .of(
        string()
          .min(1, "Option must be at least 1 character")
          .max(50, "Option must be less than 50 characters"),
      )
      .min(1, "You must provide at least 1 option")
      .max(10, "You can provide up to 10 options"),
  });

  const formContext = createForm({
    initialValues: {
      title: "",
      description: "",
      options: [""],
    },
    validationSchema: schema,
    onSubmit: submitProposal,
  });

  // this is needed so we can access the appropiate stores
  const { form, handleChange, errors } = formContext;
  $: console.log($errors);

  const addOption = () => {
    $form.options = [...$form.options, ""];
  };

  function removeOption(index: number) {
    $form.options = $form.options.filter((_, i) => i !== index);
  }

  const clearProposal = () => {
    $form = {
      description: "",
      title: "",
      options: [""],
    };
  };

  async function submitProposal(proposal) {
    loading = true;
    await store.submitProposal(proposal);
    confetti = false;
    confetti = true;
    loading = false;
    clearProposal();
    await store.fetchProposals();
    store.filterProposals();
  }
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

<!-- form -->
<Form context={formContext}>
  <Card style="lg:mx-2">
    <div class="p-2 lg:p-4 flex flex-col 2xl:text-xl">
      <h1 class="font-everett-medium text-3xl 2xl:text-4xl">
        create new proposal:
      </h1>
      <!-- title -->
      <div class="mt-10 flex flex-col mx-2 font-mono">
        <p class="italic">title:</p>
        <Field
          type="text"
          class="p-2 bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-xl my-2"
          name="title"
          placeholder="enter your proposals title"
        />
        <ErrorMessage name="title" />
      </div>
      <!-- description -->
      <div class="mt-10 flex flex-col mx-2 font-mono">
        <p class="italic">description:</p>
        {#if preview}
          <article
            class="prose prose-black 2xl:prose-xl dark:prose-invert font-sans max-w-none"
          >
            <SvelteMarkdown source={$form.description} />
          </article>
        {:else}
          <Textarea
            rows={5}
            class="p-2 bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-xl my-2"
            placeholder="you can write markdown here! to see the outcome click the 'preview' button at the top :)"
            name="description"
          />
          <ErrorMessage name="description" />
        {/if}
      </div>
      <!-- options -->
      <div class="mt-10 flex flex-col mx-2 font-mono">
        <p class="italic">options:</p>
        {#each $form.options as option, index}
          <div
            class="flex justify-between p-2 bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-xl my-2"
          >
            <input
              type="text"
              class="flex-1 bg-white dark:bg-black"
              placeholder="an option people can vote on"
              name={`options[${index}]`}
              on:change={handleChange}
              on:blur={handleChange}
              bind:value={$form.options[index]}
            />
            {#if $form.options.length > 1}
              <button
                type="button"
                tabindex="-1"
                on:click|preventDefault={() => removeOption(index)}
                class="px-2">x</button
              >
            {/if}
          </div>
          {#if $errors.options[index]}
            <small>{$errors.options[index]}</small>
          {/if}
        {/each}
        {#if $form.options.length < 10}
          <button
            tabindex="-1"
            class="p-2 hover:shadow shadow-black dark:shadow-white bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-xl my-2"
            on:click|preventDefault={addOption}
          >
            add option
          </button>
        {/if}
        {#if !($form.options.length > 0)}
          <ErrorMessage name="options" />
        {/if}
        <Button disabled={loading} style={"mt-10"}>
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
</Form>

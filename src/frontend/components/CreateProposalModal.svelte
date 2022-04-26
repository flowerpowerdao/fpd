<script lang="ts">
  import Form from "./CreateProposalForm.svelte";
  import { NewProposal, store } from "../store";

  export let proposal: NewProposal;
  let openModal = false;
  const toggleModal = () => {
    openModal = !openModal;
  };

  function handleEscape({ key }) {
    if (key === "Escape") {
      openModal = false;
    }
  }
  let loading = false;

  const submitProposal = async () => {
    loading = true;
    await store.submitProposal(proposal);
    openModal = false;
    loading = false;
    clearProposal();
    await store.fetchProposals();
  };

  const clearProposal = () => {
    proposal = {
      description: "",
      title: "",
      options: [""],
    };
  };
</script>

<svelte:window on:keyup={handleEscape} />
<div>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <button
    on:click={toggleModal}
    type="button"
    class="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 
    font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none 
    focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  >
    <!-- Heroicon name: solid/mail -->
    <svg
      class="-ml-0.5 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
      />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
    Create proposal
  </button>
  {#if openModal}
    <div
      class="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <!--
        Background overlay, show/hide based on modal state.
  
        Entering: "ease-out duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100"
          To: "opacity-0"
      -->
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        />

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true">&#8203;</span
        >

        <!--
        Modal panel, show/hide based on modal state.
  
        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      -->
        <div
          class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
        >
          <div class="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
            <button
              on:click={toggleModal}
              type="button"
              class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span class="sr-only">Close</span>
              <!-- Heroicon name: outline/x -->
              <svg
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
            >
              <!-- Heroicon name: outline/exclamation -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3
                class="text-lg leading-6 font-medium text-gray-900"
                id="modal-title"
              >
                Create new proposal
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Submit your shiney new proposal for the community to vote. An
                  amount of 100k ICP will be deducted from your account.
                </p>
              </div>
            </div>
          </div>
          <Form />
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              disabled={loading}
              on:click={submitProposal}
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 
              bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >{loading ? "Submiting..." : "Submit"}</button
            >
            <button
              on:click={clearProposal}
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              >Clear</button
            >
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

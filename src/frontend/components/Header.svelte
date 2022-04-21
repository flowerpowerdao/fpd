<script lang="ts">
  import { push } from "svelte-spa-router";
  import { store } from "../store";
  import logo from "../assets/fpd-logo.svg";

  import PlugButton from "../components/PlugButton.svelte";
  import StoicButton from "../components/StoicButton.svelte";
</script>

<!-- mobile -->
<div class="p-1">
  <a href="/#">
    <img
      class="sm:hidden h-auto w-full sm:h-10 bg-white dark:invert dark:border-none"
      src={logo}
      alt="fpdao logo"
    />
  </a>
</div>

<!-- desktop -->
<div class="hidden sm:block relative bg-white">
  <div
    class="flex justify-between items-center px-4 py-6 sm:px-6 md:justify-start md:space-x-10"
  >
    <div class="flex justify-start lg:w-0 lg:flex-1">
      <a href="/#">
        <span class="sr-only">Workflow</span>
        <img
          class="h-8 w-auto sm:h-10"
          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
          alt=""
        />
      </a>
    </div>
    <nav class="flex space-x-10">
      <div class="relative">
        <!-- Item active: "text-gray-900", Item inactive: "text-gray-500" -->
        {#if $store.isAuthed}
          <button
            type="button"
            class="text-gray-500 group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-expanded="false"
          >
            <!-- svelte-ignore a11y-missing-attribute -->
            <a
              class="block hover:bg-gray-50 cursor-pointer"
              on:click={() => push(`/voting-history`)}
              >Voting History
            </a>
          </button>
        {/if}
      </div>
    </nav>
    <div class="flex items-center justify-end md:flex-1 lg:w-0">
      <StoicButton />
      <PlugButton />
    </div>
  </div>
</div>

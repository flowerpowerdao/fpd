<script>
  import { store } from "../store";

  const addNewOption = () => {
    $store.proposal.options = [...$store.proposal.options, ""];
  };
</script>

<form action="#" method="POST">
  <div class="shadow overflow-hidden sm:rounded-md">
    <div class="px-4 py-5 bg-white sm:p-6">
      <div class="grid grid-cols-6 gap-6">
        <div class="col-span-6">
          <label for="title" class="block text-sm font-medium text-gray-700"
            >Title</label
          >
          <input
            bind:value={$store.proposal.title}
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
            bind:value={$store.proposal.description}
            type="text"
            name="description"
            id="description"
            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>

        <div class="col-span-6">
          <button
            on:click={addNewOption}
            type="button"
            class="inline-flex items-center py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700"
            >+ Add new option</button
          >
          {#each $store.proposal.options as option, index}
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
        <div class="col-span-6">
          <label for="duration" class="block text-sm font-medium text-gray-700"
            >Duration (Hours)</label
          >
          <input
            bind:value={$store.proposal.duration}
            type="text"
            name="duration"
            id="duration"
            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  </div>
</form>

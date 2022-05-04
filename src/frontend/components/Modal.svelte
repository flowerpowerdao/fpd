<script lang="ts">
  import Card from "./Card.svelte";

  export let toggleModal;
  export let title;
</script>

<div
  class="fixed flex justify-center items-center z-10 inset-0 bg-opacity-10 backdrop-blur-sm"
>
  <Card style={"flex flex-col h-1/2 lg:w-1/2 w-full mx-2 pt-4 px-4"}>
    <div class="flex flex-row justify-between dark:text-white">
      <p class="font-everett-medium text-3xl 2xl:text-4xl">{title}</p>
      <div
        class="hover:shadow dark:hover:shadow-white cursor-pointer flex justify-center items-center font-mono text-lg rounded-full border-2 border-black dark:border-white  w-10 h-10"
        on:click={toggleModal}
      >
        x
      </div>
    </div>
    <slot />
  </Card>
</div>

<script lang="ts">
  export let title: string;
  export let eventHandler: () => void = undefined;
</script>

<button
  on:click={eventHandler}
  class="bg-white text-textblack w-full 
  text-2xl pl-8 pr-6 py-2 rounded-full cursor-pointer 
  sm:py-1 sm:w-1/2 
  3xl:max-w-xs 3xl:text-4xl 3xl:pl-8 3xl:pr-6"
>
  <div class="flex justify-between">
    {title} <span class="text-right">↗</span>
  </div>
</button>

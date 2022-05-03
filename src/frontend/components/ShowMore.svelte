<script>
  export let show;
  export let toggle;
</script>

<div class="flex justify-center">
  <button
    class="mt-4 flex-1 font-mono -ml-0.5 text-xl lg:text-base xl:text-xl bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-b-3xl min-h-[40px] max-w-md"
    on:click={toggle}
  >
    {show? "hide ↑" : "show more ↓"}
  </button>
</div>

<script lang="ts">
  export let style = "";
</script>

<div
  class="{style} bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-xl mx-2 lg:mx-[10%] my-4"
>
  <slot />
</div>

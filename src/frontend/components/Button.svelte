<script lang="ts">
  export let eventHandler: () => void = undefined;
  export let disabled: boolean = undefined;
  export let styles: string = undefined;
</script>

<button
  class="flex items-center justify-center disabled:shadow-none hover:shadow shadow-black dark:shadow-white text-xl bg-white dark:bg-black  border-2 border-black dark:border-white dark:text-white h-12 lg:h-10 w-full rounded-3xl font-mono -mb-0.5"
  style={styles}
  on:click|preventDefault={eventHandler}
  {disabled}
>
  <slot />
</button>

<script lang="ts">
  const toggleDarkMode = () => {
    document.body.classList.toggle("dark");
  };
</script>

<button
  on:click={toggleDarkMode}
  class="flex-1 font-mono -ml-0.5 text-xl bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 h-12 rounded-t-3xl"
  >login</button
>

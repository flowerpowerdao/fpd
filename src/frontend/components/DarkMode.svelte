<script lang="ts">
  const toggleDarkMode = () => {
    document.body.classList.toggle("dark");
  };
</script>

<button
  on:click={toggleDarkMode}
  class="font-mono text-3xl bg-white dark:bg-black  border-black dark:border-white dark:text-white border-2 w-14 h-12 rounded-3xl"
  >⁂</button
>

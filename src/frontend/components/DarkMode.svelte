<script lang="ts">
  const toggleDarkMode = () => {
    document.body.classList.toggle("dark");
  };
</script>

<button
  on:click={toggleDarkMode}
  class="font-mono text-3xl bg-white dark:bg-black  border-black dark:border-white dark:text-white border-2 w-14 min-h-[50px] h-full max-h-[78px] lg:max-h-28 rounded-3xl"
  >⁂</button
>

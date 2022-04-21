<script lang="ts">
  const toggleDarkMode = () => {
    document.body.classList.toggle("dark");
  };
</script>

<button on:click={toggleDarkMode}> darkMode </button>

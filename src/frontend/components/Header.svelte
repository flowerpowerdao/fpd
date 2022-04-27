<script lang="ts">
  import { push } from "svelte-spa-router";
  import { store } from "../store";
  import logo from "../assets/fpd-logo.svg";

  import PlugButton from "../components/PlugButton.svelte";
  import StoicButton from "../components/StoicButton.svelte";
</script>

<!-- mobile -->
<div class="">
  <a href="/#">
    <img
      class="sm:hidden h-auto w-full sm:h-10 bg-white dark:invert dark:border-none"
      src={logo}
      alt="fpdao logo"
    />
  </a>
</div>

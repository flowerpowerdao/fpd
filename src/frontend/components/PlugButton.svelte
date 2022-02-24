<script lang="ts">
  import { onMount } from "svelte";

  import plugLogo from "../assets/plug.svg";
  import { store } from "../store";

  onMount(async () => {
    if (await window.ic?.plug.isConnected()) {
      store.plugConnect();
    }
  });
</script>

{#if $store.isAuthed === "plug"}
  <div class="flex justify-end p-2 items-center">
    <button
      class="plug-button p-2 flex justify-end items-center"
      on:click={store.disconnect}
    >
      <img class="plug-logo" src={plugLogo} alt="plug-logo" />
      {$store.principal.toString().slice(0, 5) +
        "..." +
        $store.principal.toString().slice(-5)}
    </button>
  </div>
{:else if !$store.isAuthed}
  <button class="flex items-center plug-button" on:click={store.plugConnect}>
    <img class="plug-logo" src={plugLogo} alt="plug-logo" />
    Connect to Plug
  </button>
{/if}

<style>
  .plug-button {
    border: none;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    background: linear-gradient(
      94.95deg,
      #ffe701 -1.41%,
      #fa51d3 34.12%,
      #10d9ed 70.19%,
      #52ff53 101.95%
    );
    border-radius: 10px;
    color: #fff;
    padding: 6px 32px;
    cursor: pointer;
    transition: opacity 0.3s ease-in, transform 0.3s ease-in-out;
    transform: scale(1);
  }

  .plug-button:hover {
    opacity: 0.94;
    transform: scale(1.02);
  }

  .plug-logo {
    width: 24px;
    height: 24px;
  }
</style>

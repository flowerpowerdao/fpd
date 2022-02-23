<script lang="ts">
  import { onMount } from "svelte";
  import plugLogo from "../assets/plug.svg";

  $: connected = false;
  $: principalId = "";

  onMount(() => {
    verifyConnection();
  });

  const verifyConnection = async () => {
    connected = await (window as any).ic?.plug.isConnected();

    if (!connected) {
      await (window as any).ic?.plug
        .requestConnect()
        .then(async () => {
          connected = true;
          await getPrincipal();
        })
        .catch(() => {
          console.log("Couldn't connect to plug");
        });
    } else {
      await getPrincipal();
      connected = true;
      return connected;
    }

    return connected;
  };

  const getPrincipal = async () => {
    let principal = await (window as any).ic?.plug.getPrincipal();
    console.log("principal", principal.toString());
    principalId = principal.toString();
  };

  const handleConnect = async () => {
    if (!(window as any).ic?.plug) {
      window.open("https://plugwallet.ooo/", "_blank");
      return;
    }

    connected = await verifyConnection();
    if (!connected) return;

    onConnectCallback(connected);
  };

  const onConnectCallback = (connected: boolean) => {
    console.log("onConnectCallback connected to plug", connected);
  };
</script>

{#if connected}
  <div class="flex justify-end p-2 items-center">
    <button
      class="plug-button p-2 flex justify-end items-center"
      on:click={async () => {
        handleConnect();
      }}
    >
      <img class="plug-logo" src={plugLogo} alt="plug-logo" />
      {principalId.slice(0, 5) + "..." + principalId.slice(-5)}
    </button>
  </div>
{:else}
  <div class="flex justify-end p-2 items-center">
    <button class="flex items-center plug-button" on:click={handleConnect}>
      <img class="plug-logo" src={plugLogo} alt="plug-logo" />
      Connect to Plug
    </button>
  </div>
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

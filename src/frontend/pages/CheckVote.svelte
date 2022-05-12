<script lang="ts">
  import { createActor, canisterId } from "../../declarations/dao";
  import Card from "../components/Card.svelte";
  import spinner from "../assets/loading.gif";
  import Button from "../components/Button.svelte";
  import { isOk, getVariantValue } from "../utils";
  import { HOST } from "../store";

  let loading = false;
  let mintNumber: number;
  let collection: "ethflower" | "btcflower";
  let proposalId: number;
  let answer: string = "";
  let dao = createActor(canisterId, { agentOptions: { host: HOST } });

  async function checkVotingStatus() {
    let collectionVariant: { btcflower: null } | { ethflower: null };
    collection === "ethflower"
      ? (collectionVariant = { ethflower: null })
      : (collectionVariant = { btcflower: null });

    loading = true;
    let result = await dao.hasVoted(
      mintNumber - 1,
      collectionVariant,
      BigInt(proposalId),
    );
    if (isOk(result)) {
      getVariantValue(result)
        ? (answer = `${collection} flower #${mintNumber} has already voted on proposal #${proposalId}`)
        : (answer = `${collection} flower #${mintNumber} has not voted on proposal #${proposalId}`);
    } else {
      answer = getVariantValue(result);
    }
    loading = false;
  }
</script>

<div class="pb-24 mt-10 lg:mt-0 lg:pt-40">
  <form on:submit|preventDefault={checkVotingStatus}>
    <Card style="mx-2 lg:mx-[10%]">
      <div class="p-2 lg:p-4 flex flex-col 2xl:text-xl">
        <h1 class="font-everett-medium text-3xl 2xl:text-4xl">
          check flower voting status:
        </h1>
        <div class="mt-10 flex flex-col mx-2 font-mono">
          <p class="italic">mint number:</p>
          <input
            type="number"
            name="mint-number"
            id="mint-number"
            min="1"
            bind:value={mintNumber}
            required
            placeholder="mint number"
            class="p-2 bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-xl my-2"
          />
        </div>
        <div class="mt-10 flex flex-col mx-2 font-mono">
          <p class="italic">collection:</p>
          <select
            name="collection"
            id="collection"
            bind:value={collection}
            class="p-2 bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-xl my-2"
            required
          >
            <option value="ethflower">ethflower</option>
            <option value="btcflower">btcflower</option>
          </select>
        </div>
        <div class="mt-10 flex flex-col mx-2 font-mono">
          <p class="italic">proposal id:</p>
          <input
            type="number"
            name="proposal-id"
            id="proposal-id"
            min="0"
            bind:value={proposalId}
            required
            placeholder="proposal id"
            class="p-2 bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-xl my-2"
          />
        </div>
        <Button disabled={loading} style={"mt-10"}>
          {#if loading}
            <img class="h-6 block" src={spinner} alt="loading animation" />
          {:else}
            check →
          {/if}
        </Button>
        <div class="flex items-center justify-center mt-4">
          {answer}
        </div>
      </div>
    </Card>
  </form>
</div>

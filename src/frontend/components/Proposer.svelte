<script lang="ts">
  export let proposal;
</script>

<p>
  {#if proposal.core}
    <div
      class="flex justify-center items-center disabled bg-white dark:bg-black  border-2 border-black dark:border-white dark:text-white w-[calc(100vw*(1/3))] lg:w-40 -ml-0.5 rounded-3xl font-mono italic"
    >
      core
    </div>
  {:else}
    by {proposal.proposer.toString().slice(0, 5) +
      "…" +
      proposal.proposer.toString().slice(-3)}
  {/if}
</p>

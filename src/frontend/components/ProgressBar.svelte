<script lang="ts">
  export let title: string;
  export let votesCast: number;
  export let expiryDate: number;

  function calculateProgress(votesCast: number, totalVotes: number): number {
    return Math.round((votesCast / totalVotes) * 100);
  }

  const totalVotes = expiryDate < 1668184000000000000 ? 6033 : 8054;
</script>

<div>
  <div class="flex justify-between text-lg lg:text-base 2xl:text-xl">
    <span class="">{title}</span>
    <span class=""
      >{votesCast} votes, {calculateProgress(votesCast, totalVotes)}%</span
    >
  </div>
  <div class="flex w-full items-center">
    <div
      class="flex-grow overflow-hidden text-xs flex rounded-full bg-white dark:bg-black h-10 border-2 border-black dark:border-white"
    >
      <div
        style="width:{calculateProgress(votesCast, totalVotes)}%"
        class="rounded-full shadow-none flex flex-col text-center whitespace-nowrap justify-center bg-black dark:bg-white"
      />
    </div>
  </div>
</div>

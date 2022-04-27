<script lang="ts">
  export let title: string;
  export let votesCast: number;

  function calculateProgress(votesCast: number, totalVotes: number): number {
    return Math.round((votesCast / totalVotes) * 100);
  }

  const totalVotes = 2009;
</script>

<div class="flex justify-between text-lg">
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

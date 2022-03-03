<script lang="ts">
  import type { ProposalOverview as ProposalOverviewType } from "../../declarations/dao/dao.did";
  import { fromTimestamp } from "../utils";

  export let proposal: ProposalOverviewType;
</script>

<div class="text-2xl flex justify-between px-4">
  <div>{proposal.title}</div>
  <div>#{proposal.id}</div>
</div>
<div class="">
  Expiry Date: {fromTimestamp(proposal.expiryDate).toLocaleString()}
</div>
<div class="">
  Total Votes Cast: {proposal.totalVotes}
</div>

<script lang="ts">
  import ProposalOverview from "./ProposalOverview.svelte";
  import type { ProposalOverview as ProposalOverviewType } from "../../declarations/dao/dao.did";
  import { store } from "../store";

  export let proposal: ProposalOverviewType;
</script>

<div class="bg-white shadow overflow-hidden sm:rounded-md">
  <ProposalOverview {proposal} />
</div>

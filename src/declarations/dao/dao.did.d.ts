import type { Principal } from '@dfinity/principal';
export type CanisterCyclesAggregatedData = Array<bigint>;
export type CanisterHeapMemoryAggregatedData = Array<bigint>;
export type CanisterMemoryAggregatedData = Array<bigint>;
export interface CanisterMetrics { 'data' : CanisterMetricsData }
export type CanisterMetricsData = { 'hourly' : Array<HourlyMetricsData> } |
  { 'daily' : Array<DailyMetricsData> };
export interface DAO {
  'collectCanisterMetrics' : () => Promise<undefined>,
  'getCanisterMetrics' : (arg_0: GetMetricsParameters) => Promise<
      [] | [CanisterMetrics]
    >,
  'getProposal' : (arg_0: bigint) => Promise<Result_2>,
  'getProposalHistory' : () => Promise<Array<bigint>>,
  'getVotingHistory' : () => Promise<
      Array<{ 'id' : bigint, 'option' : bigint }>
    >,
  'listProposals' : () => Promise<Array<ProposalView>>,
  'submitProposal' : (
      arg_0: string,
      arg_1: string,
      arg_2: Array<string>,
    ) => Promise<Result_1>,
  'vote' : (arg_0: VoteArgs) => Promise<Result>,
}
export interface DailyMetricsData {
  'updateCalls' : bigint,
  'canisterHeapMemorySize' : NumericEntity,
  'canisterCycles' : NumericEntity,
  'canisterMemorySize' : NumericEntity,
  'timeMillis' : bigint,
}
export interface GetMetricsParameters {
  'dateToMillis' : bigint,
  'granularity' : MetricsGranularity,
  'dateFromMillis' : bigint,
}
export interface HourlyMetricsData {
  'updateCalls' : UpdateCallsAggregatedData,
  'canisterHeapMemorySize' : CanisterHeapMemoryAggregatedData,
  'canisterCycles' : CanisterCyclesAggregatedData,
  'canisterMemorySize' : CanisterMemoryAggregatedData,
  'timeMillis' : bigint,
}
export type MetricsGranularity = { 'hourly' : null } |
  { 'daily' : null };
export interface NumericEntity {
  'avg' : bigint,
  'max' : bigint,
  'min' : bigint,
  'first' : bigint,
  'last' : bigint,
}
export type ProposalState = { 'open' : null } |
  { 'rejected' : null } |
  { 'adopted' : null };
export interface ProposalView {
  'id' : bigint,
  'title' : string,
  'votes' : Array<[Principal, { 'option' : bigint, 'votesCast' : bigint }]>,
  'expiryDate' : bigint,
  'core' : boolean,
  'description' : string,
  'state' : ProposalState,
  'votesCast' : bigint,
  'proposer' : Principal,
  'flowersVoted' : Array<number>,
  'options' : Array<string>,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export type Result_2 = { 'ok' : ProposalView } |
  { 'err' : string };
export type UpdateCallsAggregatedData = Array<bigint>;
export interface VoteArgs { 'option' : bigint, 'proposalId' : bigint }
export interface _SERVICE extends DAO {}

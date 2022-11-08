import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type CanisterCyclesAggregatedData = Array<bigint>;
export type CanisterHeapMemoryAggregatedData = Array<bigint>;
export type CanisterMemoryAggregatedData = Array<bigint>;
export interface CanisterMetrics { 'data' : CanisterMetricsData }
export type CanisterMetricsData = { 'hourly' : Array<HourlyMetricsData> } |
  { 'daily' : Array<DailyMetricsData> };
export interface DAO {
  'collectCanisterMetrics' : ActorMethod<[], undefined>,
  'getCanisterMetrics' : ActorMethod<
    [GetMetricsParameters],
    [] | [CanisterMetrics],
  >,
  'getProposal' : ActorMethod<[bigint], Result_3>,
  'getProposalHistory' : ActorMethod<[], Array<bigint>>,
  'getVotingHistory' : ActorMethod<
    [],
    Array<{ 'id' : bigint, 'option' : bigint }>,
  >,
  'hasVoted' : ActorMethod<
    [
      number,
      { 'btcflower' : null } |
        { 'icpflower' : null } |
        { 'ethflower' : null },
      bigint,
    ],
    Result_2,
  >,
  'listProposals' : ActorMethod<[], Array<ProposalViewV3>>,
  'submitProposal' : ActorMethod<[ProposalPublic], Result_1>,
  'vote' : ActorMethod<[VoteArgs], Result>,
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
export interface ProposalPublic {
  'title' : string,
  'description' : string,
  'options' : Array<string>,
}
export type ProposalState = { 'open' : null } |
  { 'rejected' : null } |
  { 'adopted' : null };
export interface ProposalViewV3 {
  'id' : bigint,
  'title' : string,
  'votes' : Array<
    [
      Principal,
      {
        'btcFlowers' : bigint,
        'option' : bigint,
        'icpFlowers' : bigint,
        'ethFlowers' : bigint,
        'votesCast' : bigint,
      },
    ]
  >,
  'expiryDate' : bigint,
  'core' : boolean,
  'description' : string,
  'state' : ProposalState,
  'votesCast' : bigint,
  'proposer' : Principal,
  'flowersVoted' : {
    'btcFlowers' : Array<number>,
    'icpFlowers' : Array<number>,
    'ethFlowers' : Array<number>,
  },
  'options' : Array<string>,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : Array<string> };
export type Result_2 = { 'ok' : boolean } |
  { 'err' : string };
export type Result_3 = { 'ok' : ProposalViewV3 } |
  { 'err' : string };
export type UpdateCallsAggregatedData = Array<bigint>;
export interface VoteArgs { 'option' : bigint, 'proposalId' : bigint }
export interface _SERVICE extends DAO {}

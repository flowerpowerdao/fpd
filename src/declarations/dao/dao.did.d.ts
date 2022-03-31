import type { Principal } from '@dfinity/principal';
export interface DAO {
  'getProposal' : (arg_0: bigint) => Promise<[] | [ProposalView]>,
  'getVotingHistory' : () => Promise<Array<bigint>>,
  'listProposals' : () => Promise<Array<ProposalView>>,
  'submitProposal' : (
      arg_0: string,
      arg_1: string,
      arg_2: Array<string>,
    ) => Promise<Result_1>,
  'vote' : (arg_0: VoteArgs) => Promise<Result>,
}
export type ProposalState = { 'open' : null } |
  { 'rejected' : null } |
  { 'adopted' : null };
export interface ProposalView {
  'id' : bigint,
  'title' : string,
  'votes' : Array<[Principal, { 'option' : bigint, 'votesCast' : bigint }]>,
  'expiryDate' : bigint,
  'description' : string,
  'state' : ProposalState,
  'timestamp' : bigint,
  'proposer' : Principal,
  'flowersVoted' : Array<number>,
  'options' : Array<string>,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export interface VoteArgs { 'option' : bigint, 'proposalId' : bigint }
export interface _SERVICE extends DAO {}

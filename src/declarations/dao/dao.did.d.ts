import type { Principal } from '@dfinity/principal';
export type AssocList = [] | [[[Key, bigint], List_1]];
export interface Branch { 'left' : Trie, 'size' : bigint, 'right' : Trie }
export interface ClosedProposal {
  'id' : bigint,
  'title' : string,
  'expiryDate' : bigint,
  'totalVotes' : bigint,
  'description' : string,
  'state' : ProposalState,
  'timestamp' : bigint,
  'proposer' : Principal,
  'flowersVoted' : List,
  'options' : Array<Option>,
}
export interface DAO {
  'getProposal' : (arg_0: bigint) => Promise<[] | [ProposalView]>,
  'listProposalOverviews' : () => Promise<Array<ProposalOverview>>,
  'listProposals' : () => Promise<Array<ProposalView>>,
  'submitProposal' : (
      arg_0: string,
      arg_1: string,
      arg_2: Array<string>,
    ) => Promise<Result_1>,
  'vote' : (arg_0: VoteArgs) => Promise<Result>,
}
export type Hash = number;
export interface Key { 'key' : Principal, 'hash' : Hash }
export interface Leaf { 'size' : bigint, 'keyvals' : AssocList }
export type List = [] | [[number, List]];
export type List_1 = [] | [[[Key, bigint], List_1]];
export interface OpenOption { 'text' : string }
export interface OpenProposal {
  'id' : bigint,
  'title' : string,
  'expiryDate' : bigint,
  'totalVotes' : bigint,
  'description' : string,
  'state' : ProposalState,
  'timestamp' : bigint,
  'proposer' : Principal,
  'flowersVoted' : List,
  'options' : Array<OpenOption>,
}
export interface Option { 'votes' : bigint, 'text' : string, 'voters' : Trie }
export interface ProposalOverview {
  'id' : bigint,
  'title' : string,
  'expiryDate' : bigint,
  'totalVotes' : bigint,
  'state' : ProposalState,
}
export type ProposalState = { 'open' : null } |
  { 'rejected' : null } |
  { 'adopted' : null };
export type ProposalView = { 'closed' : ClosedProposal } |
  { 'open' : OpenProposal };
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export type Trie = { 'branch' : Branch } |
  { 'leaf' : Leaf } |
  { 'empty' : null };
export interface VoteArgs { 'option' : bigint, 'proposalId' : bigint }
export interface _SERVICE extends DAO {}

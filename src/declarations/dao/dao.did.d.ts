import type { Principal } from '@dfinity/principal';
export type AssocList = [] | [[[Key, [bigint, bigint]], List_1]];
export interface Branch { 'left' : Trie, 'size' : bigint, 'right' : Trie }
export interface DAO {
  'getProposal' : (arg_0: bigint) => Promise<[] | [Proposal]>,
  'getVotingHistory' : () => Promise<Array<bigint>>,
  'listProposals' : () => Promise<Array<Proposal>>,
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
export type List_1 = [] | [[[Key, [bigint, bigint]], List_1]];
export interface Proposal {
  'id' : bigint,
  'title' : string,
  'votes' : Trie,
  'expiryDate' : bigint,
  'description' : string,
  'state' : ProposalState,
  'timestamp' : bigint,
  'proposer' : Principal,
  'flowersVoted' : List,
  'options' : Array<string>,
}
export type ProposalState = { 'open' : null } |
  { 'rejected' : null } |
  { 'adopted' : null };
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export type Trie = { 'branch' : Branch } |
  { 'leaf' : Leaf } |
  { 'empty' : null };
export interface VoteArgs { 'option' : bigint, 'proposalId' : bigint }
export interface _SERVICE extends DAO {}

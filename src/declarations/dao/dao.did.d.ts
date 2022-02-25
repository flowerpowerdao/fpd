import type { Principal } from '@dfinity/principal';
export type AssocList = [] | [[[Key, bigint], List_1]];
export interface Branch { 'left' : Trie, 'size' : bigint, 'right' : Trie }
export interface DAO {
  'get_proposal' : (arg_0: bigint) => Promise<[] | [Proposal]>,
  'list_proposals' : () => Promise<Array<Proposal>>,
  'submit_proposal' : (
      arg_0: string,
      arg_1: Array<string>,
      arg_2: bigint,
    ) => Promise<Result_1>,
  'vote' : (arg_0: VoteArgs) => Promise<Result>,
  'whoami' : () => Promise<string>,
}
export type Hash = number;
export interface Key { 'key' : Principal, 'hash' : Hash }
export interface Leaf { 'size' : bigint, 'keyvals' : AssocList }
export type List = [] | [[number, List]];
export type List_1 = [] | [[[Key, bigint], List_1]];
export type List_2 = [] | [[Principal, List_2]];
export interface Option { 'votes' : bigint, 'text' : string, 'voters' : Trie }
export interface Proposal {
  'id' : bigint,
  'expiryDate' : bigint,
  'totalVotes' : bigint,
  'description' : string,
  'voters' : List_2,
  'state' : ProposalState,
  'timestamp' : bigint,
  'proposer' : Principal,
  'options' : Array<Option>,
  'flowers' : List,
}
export type ProposalState = { 'closed' : null } |
  { 'open' : null };
export type Result = { 'ok' : ProposalState } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export type Trie = { 'branch' : Branch } |
  { 'leaf' : Leaf } |
  { 'empty' : null };
export interface VoteArgs { 'option' : bigint, 'proposalId' : bigint }
export interface _SERVICE extends DAO {}

import Int "mo:base/Int";
import List "mo:base/List";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Trie "mo:base/Trie";

module {
  public type Result<T, E> = Result.Result<T, E>;

  public type Option = {
    text: Text; 
    votes: Nat;
    voters: Trie.Trie<Principal, Nat>;
  };

  public type Proposal = {
    id : Nat;
    description: Text;
    options : [Option];
    voters : List.List<Principal>;
    state : ProposalState;
    totalVotes: Nat;
    timestamp : Int;
    proposer : Principal;
  };

  public type ProposalState = {
    #open;
    #closed;
  };

  public type UpdateSystemParamsPayload = {
    proposalVoteThreshold : ?Nat;
  };

  public type VoteArgs = { 
    option: Nat; 
    proposalId : Nat 
  };

  public func proposal_key(t: Nat) : Trie.Key<Nat> = { key = t; hash = Int.hash t };

  public func account_key(t: Principal) : Trie.Key<Principal> = { key = t; hash = Principal.hash t };
}

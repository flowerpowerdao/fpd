import Int "mo:base/Int";
import List "mo:base/List";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Trie "mo:base/Trie";

module {
  public type Result<T, E> = Result.Result<T, E>;

  public type VotingHistories = Trie.Trie<Principal, List.List<Nat>>;
  public type Proposals = Trie.Trie<Nat, Proposal>;

  public type Option = {
    text: Text; 
    votes: Nat;
    voters: Trie.Trie<Principal, Nat>;
  };

  public type Proposal = {
    id : Nat; // unique proposal id
    title : Text; // title of the proposal
    description : Text; // short description
    options : [Option]; // options that can be voted on
    flowersVoted : List.List<Nat32>; // flowers that already voted
    state : ProposalState; // is the proposal accepting votes or not
    totalVotes : Nat; // total votes cast on this proposal recognizing the voting power
    timestamp : Int; // when the proposal was created
    expiryDate : Int; // when the voting period ends
    proposer : Principal; // principal of the creator of the proposal
  };

  public type ProposalState = {
    #open;
    #adopted;
    #rejected;
  };

  public type VoteArgs = { 
    option: Nat; 
    proposalId : Nat 
  };

  public func proposalKey(t: Nat) : Trie.Key<Nat> = { key = t; hash = Int.hash t };

  public func accountKey(t: Principal) : Trie.Key<Principal> = { key = t; hash = Principal.hash t };
}

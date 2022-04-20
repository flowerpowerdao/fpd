import Buffer "mo:base/Buffer";
import Int "mo:base/Int";
import List "mo:base/List";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Trie "mo:base/Trie";

module {
  public type Proposal = {
    id : Nat; // unique proposal id
    title : Text; // title of the proposal
    description : Text; // short description
    options : [Text]; // options that can be voted on
    votes : Trie.Trie<Principal, (option: Nat, votesCast: Nat)>; // votes cast by each principal
    flowersVoted : List.List<Nat32>; // flowers that already voted
    state : ProposalState; // is the proposal accepting votes or not
    timestamp : Int; // when the proposal was created
    expiryDate : Int; // when the voting period ends
    proposer : Principal; // principal of the creator of the proposal
    totalVotesCast: Nat; // total votes cast
    core: Bool; // is the proposal a core proposal
  };

  public type ProposalView = {
    id : Nat; // unique proposal id
    title : Text; // title of the proposal
    description : Text; // short description
    options : [Text]; // options that can be voted on
    votes : [(Principal, {option: Nat; votesCast: Nat})]; // votes cast by each principal
    flowersVoted : [Nat32]; // flowers that already voted
    state : ProposalState; // is the proposal accepting votes or not
    timestamp : Int; // when the proposal was created
    expiryDate : Int; // when the voting period ends
    proposer : Principal; // principal of the creator of the proposal
    totalVotesCast: Nat; // total votes cast
    core: Bool; // is the proposal a core proposal
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

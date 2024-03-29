import Buffer "mo:base/Buffer";
import Int "mo:base/Int";
import List "mo:base/List";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Trie "mo:base/Trie";

module {
  public type ProposalDeprecated = {
    id : Nat; // unique proposal id
    title : Text; // title of the proposal
    description : Text; // short description
    options : [Text]; // options that can be voted on
    votes : Trie.Trie<Principal, (option : Nat, votesCast : Nat)>; // votes cast by each principal
    flowersVoted : {btcFlowers : List.List<Nat32>; ethFlowers : List.List<Nat32>}; // flowers that already voted
    state : ProposalState; // is the proposal accepting votes or not
    expiryDate : Int; // when the voting period ends
    votesCast: Nat; // total votes cast
    proposer : Principal; // principal of the creator of the proposal
    core : Bool; // is the proposal a core proposal
  };

  public type ProposalViewDeprecated = {
    id : Nat; // unique proposal id
    title : Text; // title of the proposal
    description : Text; // short description
    options : [Text]; // options that can be voted on
    votes : [(Principal, {option : Nat; votesCast : Nat})]; // votes cast by each principal
    flowersVoted : {btcFlowers : [Nat32]; ethFlowers : [Nat32]};  // flowers that already voted
    state : ProposalState; // is the proposal accepting votes or not
    expiryDate : Int; // when the voting period ends
    votesCast : Nat; // total votes cast
    proposer : Principal; // principal of the creator of the proposal
    core : Bool; // is the proposal a core proposal
  };
  
  public type Proposal = {
    id : Nat; // unique proposal id
    title : Text; // title of the proposal
    description : Text; // short description
    options : [Text]; // options that can be voted on
    votes : Trie.Trie<Principal, (option : Nat, votesCast : Nat, btcFlowers : Nat, ethFlowers : Nat)>; // votes cast by each principal
    flowersVoted : {btcFlowers : List.List<Nat32>; ethFlowers : List.List<Nat32>}; // flowers that already voted
    state : ProposalState; // is the proposal accepting votes or not
    expiryDate : Int; // when the voting period ends
    votesCast : Nat; // total votes cast
    proposer : Principal; // principal of the creator of the proposal
    core : Bool; // is the proposal a core proposal
  };

  public type ProposalView = {
    id : Nat; // unique proposal id
    title : Text; // title of the proposal
    description : Text; // short description
    options : [Text]; // options that can be voted on
    votes : [(Principal, {option : Nat; votesCast : Nat; btcFlowers : Nat; ethFlowers : Nat})]; // votes cast by each principal
    flowersVoted : {btcFlowers : [Nat32]; ethFlowers : [Nat32]};  // flowers that already voted
    state : ProposalState; // is the proposal accepting votes or not
    expiryDate : Int; // when the voting period ends
    votesCast : Nat; // total votes cast
    proposer : Principal; // principal of the creator of the proposal
    core : Bool; // is the proposal a core proposal
  };
  
  public type ProposalV3 = {
    id : Nat; // unique proposal id
    title : Text; // title of the proposal
    description : Text; // short description
    options : [Text]; // options that can be voted on
    votes : Trie.Trie<Principal, (option : Nat, votesCast : Nat, btcFlowers : Nat, ethFlowers : Nat, icpFlowers : Nat)>; // votes cast by each principal
    flowersVoted : {btcFlowers : List.List<Nat32>; ethFlowers : List.List<Nat32>; icpFlowers : List.List<Nat32>}; // flowers that already voted
    state : ProposalState; // is the proposal accepting votes or not
    expiryDate : Int; // when the voting period ends
    votesCast : Nat; // total votes cast
    proposer : Principal; // principal of the creator of the proposal
    core : Bool; // is the proposal a core proposal
  };

  public type ProposalViewV3 = {
    id : Nat; // unique proposal id
    title : Text; // title of the proposal
    description : Text; // short description
    options : [Text]; // options that can be voted on
    votes : [(Principal, {option : Nat; votesCast : Nat; btcFlowers : Nat; ethFlowers : Nat; icpFlowers : Nat})]; // votes cast by each principal
    flowersVoted : {btcFlowers : [Nat32]; ethFlowers : [Nat32]; icpFlowers : [Nat32]};  // flowers that already voted
    state : ProposalState; // is the proposal accepting votes or not
    expiryDate : Int; // when the voting period ends
    votesCast : Nat; // total votes cast
    proposer : Principal; // principal of the creator of the proposal
    core : Bool; // is the proposal a core proposal
  };

  public type ProposalPublic = {
    title: Text;
    description: Text;
    options: [Text]
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

  public type ValidationErrors = [Text];

  public func proposalKey(t: Nat) : Trie.Key<Nat> = { key = t; hash = Int.hash t };

  public func accountKey(t: Principal) : Trie.Key<Principal> = { key = t; hash = Principal.hash t };
}

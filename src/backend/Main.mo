import Array "mo:base/Array";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Trie "mo:base/Trie";

import AccountId "mo:accountid/AccountId";
import Hex "mo:hex/Hex";

import Types "./Types";

shared(install) actor class DAO() = Self {
  stable var proposals : Trie.Trie<Nat, Types.Proposal> = Trie.empty();
  stable var next_proposal_id : Nat = 0;

  system func heartbeat() : async () {
    await closeExpiredProposals();
  };

  func proposal_get(id : Nat) : ?Types.Proposal = Trie.get(proposals, Types.proposal_key(id), Nat.equal);
  func proposal_put(id : Nat, proposal : Types.Proposal) {
    proposals := Trie.put(proposals, Types.proposal_key(id), Nat.equal, proposal).0;
  };

  /// Submit a proposal
  public shared({caller}) func submit_proposal(description: Text, options: [Text]) : async Types.Result<Nat, Text> {
    let proposal_id = next_proposal_id;
    next_proposal_id += 1;

    let proposal : Types.Proposal = {
      id = proposal_id;
      description = description;
      timestamp = Time.now();
      expiryDate = Time.now() + 432000000000000; // 5 days
      proposer = caller;
      flowers = List.nil();
      options = Array.map<Text, Types.Option>(options : [Text], func (text: Text) : Types.Option{
        let option : Types.Option = {
          text = text;
          votes = 0;
          voters = Trie.empty()
        };
        return option;
      });
      totalVotes = 0;
      state = #open;
      voters = List.nil();
    };
    proposal_put(proposal_id, proposal);
    #ok(proposal_id)
  };

  public query ({caller}) func whoami (): async Text{
    return Principal.toText(caller);
  };

  /// Return the proposal with the given ID, if one exists
  public query func get_proposal(proposal_id: Nat) : async ?Types.Proposal {
    proposal_get(proposal_id)
  };

  /// Return the list of all proposals
  public query func list_proposals() : async [Types.Proposal] {
    Iter.toArray(Iter.map(Trie.iter(proposals), func (kv : (Nat, Types.Proposal)) : Types.Proposal = kv.1))
  };

  // Vote on an open proposal
  public shared({caller}) func vote(args: Types.VoteArgs) : async Types.Result<Types.ProposalState, Text> {
    switch (proposal_get(args.proposalId)) {
      case null { #err("No proposal with ID " # debug_show(args.proposalId) # " exists") };
      case (?proposal) {
        if (proposal.state != #open) {
            return #err("Proposal " # debug_show(args.proposalId) # " is not open for voting");
        };
        switch (await getFlowersFrom(caller)) {
          case null { return #err("Caller does not own any flowers") };
          case (?userFlowers : ?[Nat32]) {

            // check if a flower already voted
            for (userFlower in Iter.fromArray(userFlowers)) {
              if (List.some(proposal.flowers,func (e : Nat32) : Bool = e == userFlower)) {
                  return #err("Already voted");
              };
            };

            // make array mutable
            let options = Array.thaw<Types.Option>(proposal.options);

            // get the amount of flowers and thus voting power a holder has
            let votingPower : Nat = userFlowers.size();

            // calculate total votes received
            let totalVotes = proposal.totalVotes + votingPower;

            // assemble updated proposal option
            options[args.option] := {
              text  = proposal.options[args.option].text;
              voters = Trie.put(proposal.options[args.option].voters, Types.account_key(caller), Principal.equal, votingPower).0;
              votes = proposal.options[args.option].votes + votingPower;
            };
            

            let voters = List.push(caller, proposal.voters);
            let flowers = List.append(List.fromArray<Nat32>(userFlowers), proposal.flowers);

            let updated_proposal = {
                id = proposal.id;
                description = proposal.description;
                voters;
                totalVotes;
                flowers;
                options = Array.freeze(options);
                state = proposal.state;
                timestamp = proposal.timestamp;
                expiryDate = proposal.expiryDate;
                proposer = proposal.proposer;
            };
            proposal_put(args.proposalId, updated_proposal);
          };
        };
        #ok(proposal.state)
      };
    };
  };

  func getFlowersFrom(principal: Principal) : async ?[Nat32] {
    let accountId = Hex.encode(AccountId.fromPrincipal(principal, null));
    let btcflower = actor("pk6rk-6aaaa-aaaae-qaazq-cai") : actor  { tokens: (Text) -> async {#ok: [Nat32]; #err: {#InvalidToken: Text; #Other:Text}}};
    
    switch (await btcflower.tokens(accountId)) {
      case (#ok(flowers)) {
        return ?flowers
      };
      case _ return null;
    }
  };

  /// Remove expired proposals
  func closeExpiredProposals() : async () {
    for (kv in Trie.iter(proposals)) {
       if (Time.now() > kv.1.expiryDate) {
         closeProposal(kv.1)
       }
    }
  };

  func closeProposal(proposal: Types.Proposal) {
      let updated = {
          state = #closed;
          description = proposal.description;
          options = proposal.options;
          id = proposal.id;
          voters = proposal.voters;
          flowers = proposal.flowers;
          timestamp = proposal.timestamp;
          expiryDate = proposal.expiryDate;
          proposer = proposal.proposer;
          totalVotes = proposal.totalVotes;
      };
      proposal_put(proposal.id, updated);
  };
};

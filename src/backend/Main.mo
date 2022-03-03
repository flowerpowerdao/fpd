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

import Type "Types";
import Types "./Types";

shared(install) actor class DAO() = Self {
  stable var proposals : Trie.Trie<Nat, Types.Proposal> = Trie.empty();
  stable var votingHistories : Trie.Trie<Principal, List.List<Nat>> = Trie.empty();
  stable var nextProposalId : Nat = 0;

  system func heartbeat() : async () {
    await closeExpiredProposals();
  };

  /******************
  * PUBLIC METHODS *
  ******************/

  /// Submit a proposal
  public shared({caller}) func submitProposal(title: Text, description: Text, options: [Text], duration : Nat) : async Types.Result<Nat, Text> {
    let proposalId = nextProposalId;
    nextProposalId += 1;

    let proposal : Types.Proposal = {
      id = proposalId;
      title;
      description;
      timestamp = Time.now();
      expiryDate = Time.now() + 86_400_000_000_000 * duration; // 5 days
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
    putProposalInTrie(proposalId, proposal);
    #ok(proposalId)
  };

  /// Return the proposal with the given ID, if one exists
  public query func getProposal(proposal_id: Nat) : async ?Types.ProposalView{
    switch (getProposalFromTrie(proposal_id)) {
      case(?proposal) {
        if (proposal.state == #open) {
            return ?#open(createOpenProposal(proposal))
        } else {
          return ?#closed(proposal);
        }
      };
      case (_) return null ;
    }
  };

  /// Return the list of all proposal overviews
  public query func listProposalOverviews() : async [Types.ProposalOverview] {
    Iter.toArray(Iter.map(
      Trie.iter(proposals),
      func (kv : (Nat, Types.Proposal)) : Types.ProposalOverview{
        return { 
          title = kv.1.title;
          expiryDate = kv.1.expiryDate;
          id = kv.1.id;
          totalVotes = kv.1.totalVotes;
          state = kv.1.state;
        }
      }
    ))
  };

  /// Return the list of all proposals
  public query func listProposals() : async [Types.ProposalView] {
    Iter.toArray(Iter.map(
      Trie.iter(proposals),
      func (kv : (Nat, Types.Proposal)) : Types.ProposalView{
        if (kv.1.state == #open) {
            return #open(createOpenProposal(kv.1))
        } else {
          return #closed(kv.1);
        }
      }
    ))
  };

  // Vote on an open proposal
  public shared({caller}) func vote(args: Types.VoteArgs) : async Types.Result<(), Text> {
    switch (getProposalFromTrie(args.proposalId)) {
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
              voters = Trie.put(proposal.options[args.option].voters, Types.accountKey(caller), Principal.equal, votingPower).0;
              votes = proposal.options[args.option].votes + votingPower;
            };
            

            let flowers = List.append(List.fromArray<Nat32>(userFlowers), proposal.flowers);

            let updated_proposal = {
                id = proposal.id;
                description = proposal.description;
                title = proposal.title;
                totalVotes;
                flowers;
                options = Array.freeze(options);
                state = proposal.state;
                timestamp = proposal.timestamp;
                expiryDate = proposal.expiryDate;
                proposer = proposal.proposer;
            };
            // updated proposal in stable memory
            putProposalInTrie(args.proposalId, updated_proposal);
            // update voting history in stable memory
            switch (getVotingHistoryFromTrie(caller)) {
              case null {
                putVotingHistoryInTrie(caller, List.make<Nat>(args.proposalId));
              };
              case (?votingHistory) {
                putVotingHistoryInTrie(caller, List.push<Nat>(args.proposalId, votingHistory ));
              };
            };
          };
        };
        #ok()
      };
    };
  };

  /*******************
  * PRIVATE METHODS *
  *******************/

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

  func createOpenProposal (proposal : Type.Proposal) : Type.OpenProposal{
    let openProposal : Type.OpenProposal= {
      id = proposal.id; 
      title = proposal.title;
      description = proposal.description;
      options = Array.map<Type.Option, Type.OpenOption>(
        proposal.options,
        func (o : Type.Option) : Type.OpenOption{
          let ov = {
            text = o.text;
          };
          return ov;
        }
      );
      flowers = proposal.flowers;
      state = proposal.state;
      totalVotes = proposal.totalVotes;
      timestamp = proposal.timestamp;
      expiryDate = proposal.expiryDate;
      proposer = proposal.proposer;
    };

    return openProposal;
  };

  func closeProposal(proposal: Types.Proposal) {
      let updated = {
          state = #closed;
          description = proposal.description;
          title = proposal.title;
          options = proposal.options;
          id = proposal.id;
          flowers = proposal.flowers;
          timestamp = proposal.timestamp;
          expiryDate = proposal.expiryDate;
          proposer = proposal.proposer;
          totalVotes = proposal.totalVotes;
      };
      putProposalInTrie(proposal.id, updated);
  };

  func getProposalFromTrie(id : Nat) : ?Types.Proposal = Trie.get(proposals, Types.proposalKey(id), Nat.equal);

  func putProposalInTrie(id : Nat, proposal : Types.Proposal) {
    proposals := Trie.put(proposals, Types.proposalKey(id), Nat.equal, proposal).0;
  };

  func getVotingHistoryFromTrie(principal : Principal) : ?List.List<Nat> = Trie.get(votingHistories, Types.accountKey(principal), Principal.equal);
  
  func putVotingHistoryInTrie(principal : Principal, votingHistory: List.List<Nat>) {
    votingHistories:= Trie.put(votingHistories, Types.accountKey(principal), Principal.equal, votingHistory).0;
  };

};

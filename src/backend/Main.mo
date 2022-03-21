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
import Utils "./Utils";

shared(install) actor class DAO(isLocalDeployment : Bool, localDeploymentCanisterId : ?Text) = Self {
  /*************
  * CONSTANTS *
  *************/

  let votingPeriod = 5; // in days
  let votingThreshold = 1000; // we assume that 1000 votes is the minimum threshold for adoption
  
  /********************
  * STABLE VARIABLES *
  ********************/

  stable var proposals : Trie.Trie<Nat, Types.Proposal> = Trie.empty();
  stable var votingHistories : Types.VotingHistories = Trie.empty();
  stable var nextProposalId : Nat = 0;

  system func heartbeat() : async () {
    await closeExpiredProposals();
  };

  /******************
  * PUBLIC METHODS *
  ******************/

  /// Submit a proposal
  public shared({caller}) func submitProposal(title: Text, description: Text, options: [Text]) : async Types.Result<Nat, Text> {

    switch (await getFlowersFrom(caller)) {
      case null return #err("You have to own at a BTC Flower to be able to submit a proposal");
      case _ {};
    };

    let proposalId = nextProposalId;
    nextProposalId += 1;

    let proposal : Types.Proposal = {
      id = proposalId;
      title;
      description;
      timestamp = Time.now();
      expiryDate = Time.now() + 86_400_000_000_000 * votingPeriod; // 5 days
      proposer = caller;
      flowersVoted = List.nil();
      options = Array.map<Text, Types.Option>(options : [Text], func (text: Text) : Types.Option{
        let option : Types.Option = {
          text = text;
          votes = 0;
          voters = Trie.empty()
        };
        return option;
      });
      totalVotes = 0;
      state = 
      // for local deployment every second proposal is considered adopted
      if (isLocalDeployment) {
        if (proposalId % 2 == 0) {
          #open
        } else {
          #adopted
        }
      } else {
        #open
      };
      voters = List.nil();
    };
    putProposalInternal(proposalId, proposal);
    #ok(proposalId)
  };

  /// Return the proposal with the given ID, if one exists
  public query func getProposal(proposal_id: Nat) : async ?Types.ProposalView{
    switch (getProposalInternal(proposal_id)) {
      case(?proposal) {
        if (proposal.state == #open) {
            return ?#open(removeVotingInformationFromProposal(proposal))
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
            return #open(removeVotingInformationFromProposal(kv.1))
        } else {
          return #closed(kv.1);
        }
      }
    ))
  };

  // Vote on an open proposal
  public shared({caller}) func vote(args: Types.VoteArgs) : async Types.Result<(), Text> {
    switch (getProposalInternal(args.proposalId)) {
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
              if (List.some(proposal.flowersVoted,func (e : Nat32) : Bool = e == userFlower)) {
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
            

            let flowersVoted = List.append(List.fromArray<Nat32>(userFlowers), proposal.flowersVoted);

            let updated_proposal = {
                id = proposal.id;
                description = proposal.description;
                title = proposal.title;
                totalVotes;
                flowersVoted;
                options = Array.freeze(options);
                state = proposal.state;
                timestamp = proposal.timestamp;
                expiryDate = proposal.expiryDate;
                proposer = proposal.proposer;
            };
            // updated proposal in stable memory
            putProposalInternal(args.proposalId, updated_proposal);
            // update voting history in stable memory
            switch (getVotingHistoryInternal(caller)) {
              case null {
                putVotingHistoryInternal(caller, List.make<Nat>(args.proposalId));
              };
              case (?votingHistory) {
                putVotingHistoryInternal(caller, List.push<Nat>(args.proposalId, votingHistory ));
              };
            };
          };
        };
        #ok()
      };
    };
  };

  public shared query({caller}) func getVotingHistory() : async [Nat] {
    switch (getVotingHistoryInternal(caller)) {
      case null { return [] };
      case (?votingHistory) { return List.toArray(votingHistory) };
    };
  };

  /*******************
  * PRIVATE METHODS *
  *******************/

  func getFlowersFrom(principal: Principal) : async ?[Nat32] {
    let accountId = Utils.toLowerString(Hex.encode(AccountId.fromPrincipal(principal, null)));
    var btcflower = actor("aaaaa-aa") : actor { tokens: (Text) -> async {#ok: [Nat32]; #err: {#InvalidToken: Text; #Other:Text}}};

    if (isLocalDeployment) {
      switch (localDeploymentCanisterId) {
        case null  return null;
        case (?localDeploymentCanisterId) btcflower := actor(localDeploymentCanisterId) : actor  { tokens: (Text) -> async {#ok: [Nat32]; #err: {#InvalidToken: Text; #Other:Text}}};
      }
    } else {
      btcflower := actor("pk6rk-6aaaa-aaaae-qaazq-cai") : actor  { tokens: (Text) -> async {#ok: [Nat32]; #err: {#InvalidToken: Text; #Other:Text}}};
    };

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

  func removeVotingInformationFromProposal (proposal : Types.Proposal) : Types.OpenProposal{
    let openProposal : Types.OpenProposal= {
      id = proposal.id; 
      title = proposal.title;
      description = proposal.description;
      options = Array.map<Types.Option, Types.OpenOption>(
        proposal.options,
        func (o : Types.Option) : Types.OpenOption{
          let ov = {
            text = o.text;
          };
          return ov;
        }
      );
      flowersVoted = proposal.flowersVoted;
      state = proposal.state;
      totalVotes = proposal.totalVotes;
      timestamp = proposal.timestamp;
      expiryDate = proposal.expiryDate;
      proposer = proposal.proposer;
    };

    return openProposal;
  };

  func closeProposal(proposal: Types.Proposal) {
    if (proposal.totalVotes > votingThreshold) {
      let updated = {
        state = #adopted;
        description = proposal.description;
        title = proposal.title;
        options = proposal.options;
        id = proposal.id;
        flowersVoted = proposal.flowersVoted;
        timestamp = proposal.timestamp;
        expiryDate = proposal.expiryDate;
        proposer = proposal.proposer;
        totalVotes = proposal.totalVotes;
      };
      putProposalInternal(proposal.id, updated);
    } else {
      let updated = {
        state = #rejected;
        description = proposal.description;
        title = proposal.title;
        options = proposal.options;
        id = proposal.id;
        flowersVoted = proposal.flowersVoted;
        timestamp = proposal.timestamp;
        expiryDate = proposal.expiryDate;
        proposer = proposal.proposer;
        totalVotes = proposal.totalVotes;
      };

      putProposalInternal(proposal.id, updated);
    };
  };

  func getProposalInternal(id : Nat) : ?Types.Proposal = Trie.get(proposals, Types.proposalKey(id), Nat.equal);

  func putProposalInternal(id : Nat, proposal : Types.Proposal) {
    proposals := Trie.put(proposals, Types.proposalKey(id), Nat.equal, proposal).0;
  };

  func getVotingHistoryInternal(principal : Principal) : ?List.List<Nat> = Trie.get(votingHistories, Types.accountKey(principal), Principal.equal);

  func putVotingHistoryInternal(principal : Principal, votingHistory: List.List<Nat>) {
    votingHistories:= Trie.put(votingHistories, Types.accountKey(principal), Principal.equal, votingHistory).0;
  };

};

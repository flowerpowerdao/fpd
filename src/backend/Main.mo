import Array "mo:base/Array";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Trie "mo:base/Trie";
import AccountIdentifier "mo:accountid/AccountIdentifier";
import Canistergeek "mo:canistergeek/canistergeek";
import Hex "mo:hex/Hex";

import Types "./Types";
import Utils "./Utils";

shared(install) actor class DAO(isLocalDeployment : Bool, localDeploymentCanisterId : ?Text) = Self {

  /*************
  * CONSTANTS *
  *************/

  let votingPeriod = 5; // in days
  let votingThreshold = 1000; // we assume that 1000 votes is the minimum threshold for adoption
  let canistergeekMonitor = Canistergeek.Monitor();
  
  /********************
  * STABLE VARIABLES *
  ********************/

  stable var proposals : Trie.Trie<Nat, Types.Proposal> = Trie.empty();
  stable var votingHistories : Types.VotingHistories = Trie.empty();
  stable var nextProposalId : Nat = 0;
  stable var _canistergeekMonitorUD: ? Canistergeek.UpgradeData = null;

  /*****************
  * UPGRADE HOOKS *
  *****************/

  system func preupgrade() {
    _canistergeekMonitorUD := ? canistergeekMonitor.preupgrade();
  };

  system func postupgrade() { 
    canistergeekMonitor.postupgrade(_canistergeekMonitorUD);
    _canistergeekMonitorUD := null;
  };

  /*************
  * HEARTBEAT *
  *************/

  system func heartbeat() : async () {
    closeExpiredProposals();
    canistergeekMonitor.collectMetrics();
  };

  /***********************
  * CANISTER MONITORING *
  ***********************/

  /**
  * Returns collected data based on passed parameters.
  * Called from browser.
  */
  public query ({caller}) func getCanisterMetrics(parameters: Canistergeek.GetMetricsParameters): async ?Canistergeek.CanisterMetrics {
    validateCaller(caller);
    canistergeekMonitor.getMetrics(parameters);
  };

  /**
  * Force collecting the data at current time.
  * Called from browser or any canister "update" method.
  */
  public shared ({caller}) func collectCanisterMetrics(): async () {
    validateCaller(caller);
    canistergeekMonitor.collectMetrics();
  };
  
  private func validateCaller(principal: Principal) : () {
    assert( principal == Principal.fromText("ikywv-z7xvl-xavcg-ve6kg-dbbtx-wy3gy-qbtwp-7ylai-yl4lc-lwetg-kqe")) // canistergeek principal
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
      options;
      votes = Trie.empty();
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
            return ?toProposalView(removeVotingInformationFromProposal(proposal))
        } else {
          return ?toProposalView(proposal)
        }
      };
      case (_) return null ;
    }
  };

  /// Return the list of all proposals
  public query func listProposals() : async [Types.ProposalView] {
    Trie.toArray<Nat, Types.Proposal, Types.ProposalView>(proposals,
      func (kv : (Nat, Types.Proposal)) : Types.ProposalView {
        if (kv.1.state == #open) {
            return toProposalView(removeVotingInformationFromProposal(kv.1))
        } else {
          return toProposalView(kv.1)
        }
      }
    )
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

            // get the amount of flowers and thus voting power a holder has
            let votingPower : Nat = userFlowers.size();

            // track flowers that were used to cast a vote
            let flowersVoted = List.append(List.fromArray<Nat32>(userFlowers), proposal.flowersVoted);

            let updated_proposal : Types.Proposal = {
                id = proposal.id;
                description = proposal.description;
                title = proposal.title;
                flowersVoted;
                options = proposal.options;
                state = proposal.state;
                timestamp = proposal.timestamp;
                expiryDate = proposal.expiryDate;
                proposer = proposal.proposer;
                votes = Trie.put(proposal.votes, Types.accountKey(caller), Principal.equal, (args.option, votingPower)).0;
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

  func toProposalView(proposal : Types.Proposal) : Types.ProposalView {
    return {
      id = proposal.id;
      title = proposal.title;
      description = proposal.description;
      timestamp = proposal.timestamp;
      expiryDate = proposal.expiryDate;
      proposer = proposal.proposer;
      options = proposal.options;
      state = proposal.state;
      votes = Trie.toArray<Principal, (option: Nat, votesCast: Nat), (Principal, {option: Nat; votesCast: Nat})>(proposal.votes, func (kv : (Principal, (option: Nat, votesCast: Nat))) : (Principal, {option: Nat; votesCast: Nat}) {
        return (kv.0, {option = kv.1.0; votesCast = kv.1.1});
      });
      flowersVoted = List.toArray(proposal.flowersVoted);
    };
  };

  func getFlowersFrom(principal: Principal) : async ?[Nat32] {
    let accountId = Utils.toLowerString(AccountIdentifier.toText(AccountIdentifier.fromPrincipal(principal, null)));
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
  func closeExpiredProposals() {
    for (kv in Trie.iter(proposals)) {
       if (Time.now() > kv.1.expiryDate) {
         closeProposal(kv.1)
       }
    }
  };

  func removeVotingInformationFromProposal (proposal : Types.Proposal) : Types.Proposal{
    let openProposal : Types.Proposal= {
      id = proposal.id; 
      title = proposal.title;
      description = proposal.description;
      options = proposal.options;
      flowersVoted = proposal.flowersVoted;
      state = proposal.state;
      timestamp = proposal.timestamp;
      expiryDate = proposal.expiryDate;
      proposer = proposal.proposer;
      votes = Trie.empty();
    };

    return openProposal;
  };

  func getTotalVotes(proposal : Types.Proposal) : Nat {
    var totalVotes : Nat = 0;
    for (kv in Trie.iter(proposal.votes)) {
      totalVotes += kv.1.1;
    };
    return totalVotes;
  };

  func closeProposal(proposal: Types.Proposal) {
    if (getTotalVotes(proposal) > votingThreshold) {
      let updated : Types.Proposal = {
        state = #adopted;
        description = proposal.description;
        title = proposal.title;
        options = proposal.options;
        id = proposal.id;
        flowersVoted = proposal.flowersVoted;
        timestamp = proposal.timestamp;
        expiryDate = proposal.expiryDate;
        proposer = proposal.proposer;
        votes = proposal.votes;
      };
      putProposalInternal(proposal.id, updated);
    } else {
      let updated : Types.Proposal = {
        state = #rejected;
        description = proposal.description;
        title = proposal.title;
        options = proposal.options;
        id = proposal.id;
        flowersVoted = proposal.flowersVoted;
        timestamp = proposal.timestamp;
        expiryDate = proposal.expiryDate;
        proposer = proposal.proposer;
        votes = proposal.votes;
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

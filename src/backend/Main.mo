import Array "mo:base/Array";
import Debug "mo:base/Debug";
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
import Validation "./Validation";

shared(install) actor class DAO(localDeploymentCanisterIds : ?{btcflower : Text; ethflower : Text}, coreTeamPrincipals : [Principal]) = Self {

  /*************
  * CONSTANTS *
  *************/

  let votingPeriod = 7; // in days
  let votingThreshold = 3017; // we assume that 3017 - ((2009*2) + 2015) / 2 - votes is the minimum threshold for adoption
  let canistergeekMonitor = Canistergeek.Monitor();
  
  /********************
  * STABLE VARIABLES *
  ********************/

  stable var proposals : Trie.Trie<Nat, Types.ProposalDeprecated> = Trie.empty();
  stable var proposalsV2 : Trie.Trie<Nat, Types.Proposal> = Trie.empty();
  stable var votingHistories : Trie.Trie<Principal, List.List<{id: Nat; option: Nat}>> = Trie.empty();
  stable var proposalHistories : Trie.Trie<Principal, List.List<Nat>> = Trie.empty();
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
  public shared({caller}) func submitProposal(newProposal : Types.ProposalPublic) : async Result.Result<Nat, [Text]> {
    switch (await getFlowersFrom(caller)) {
      case (#err(error)) return #err([error]);
      case _ {};
    };

    switch(Validation.validateProposal(newProposal)) {
      case (#err(error)) return #err(error);
      case _ {};
    };

    let proposalId = nextProposalId;
    nextProposalId += 1;

    let proposal : Types.Proposal = {
      id = proposalId;
      title = newProposal.title;
      description = newProposal.description;
      expiryDate = 
      // for local deployment every second proposal is considered adopted
      switch (localDeploymentCanisterIds) {
        // production
        case null Time.now() + (86_400_000_000_000 * votingPeriod); // 5 days
        // local
        case _ {
          // open
          if (proposalId % 2 == 0) {
            Time.now() + (86_400_000_000_000 * votingPeriod) // 5 days
          // rejected & adopted
          } else {
            Time.now()
          }
        }
      };
      proposer = caller;
      flowersVoted = switch (localDeploymentCanisterIds) {
        case null {
          {
            btcFlowers = List.nil();
            ethFlowers = List.nil()
          }
        };
        case _ {
          // open
          if (proposalId % 2 == 0) {
            {
              btcFlowers = List.nil();
              ethFlowers = List.nil()
            }
          // rejected & adopted 
          } else {
            {
              btcFlowers = List.fromArray<Nat32>([1,2,3,4,5,6,7,8,9]);
              ethFlowers = List.fromArray<Nat32>([1,2,3,4,5,6,7,8,9])
            }
          }
        }
      };
      options = newProposal.options;
      votes = 
      // for local deployment every second proposal is considered adopted
      switch (localDeploymentCanisterIds) {
        // production
        case null Trie.empty();
        // local
        case _ {
          // open
          if (proposalId % 2 == 0) {
            Trie.empty()
          // adopted
          } else if (proposalId % 3 == 0) {
            var temp : Trie.Trie<Principal, (option: Nat, votesCast: Nat, btcFlowers : Nat, ethFlowers : Nat)> = Trie.empty();
            temp := Trie.put(temp, Types.accountKey(caller), Principal.equal, (0, 1000, 400, 200)).0;
            // we need to use different principals here, otherwise the trie entry is just overwritten
            temp := Trie.put(temp, Types.accountKey(Principal.fromText("fqfmg-4iaaa-aaaae-qabaa-cai")), Principal.equal, (1, 1100, 110, 20)).0;
            temp := Trie.put(temp, Types.accountKey(Principal.fromText("zvkal-dnnsd-syh57-zvwzw-3aa6g-nt4vz-2ncib-dqfd4-oaisq-xhv6y-eae")), Principal.equal, (2, 1050, 500, 50)).0;
            temp
          // rejected
          } else {
            var temp : Trie.Trie<Principal, (option: Nat, votesCast: Nat, btcFlowers : Nat, ethFlowers : Nat)> = Trie.empty();
            temp := Trie.put(temp, Types.accountKey(caller), Principal.equal, (0, 100, 40, 20)).0;
            // we need to use different principals here, otherwise the trie entry is just overwritten
            temp := Trie.put(temp, Types.accountKey(Principal.fromText("fqfmg-4iaaa-aaaae-qabaa-cai")), Principal.equal, (1, 50, 20, 10)).0;
            temp := Trie.put(temp, Types.accountKey(Principal.fromText("zvkal-dnnsd-syh57-zvwzw-3aa6g-nt4vz-2ncib-dqfd4-oaisq-xhv6y-eae")), Principal.equal, (2, 50, 20, 10)).0;
            temp
          }
        }
      };
      state = #open;
      // check if the proposal was submitted by a core team member
      core = do {
          var isCoreTeamMember = false;
          label coreLoop for (corePrincipal in Iter.fromArray(coreTeamPrincipals)) {
            if (Principal.equal(corePrincipal, caller)) {
              isCoreTeamMember := true;
              break coreLoop
            };
          };
          isCoreTeamMember
      };
      votesCast = switch (localDeploymentCanisterIds) {
        case null 0;
        case _ {
          // open
          if (proposalId % 2 == 0) {
            0
          // adopted
          } else if (proposalId % 3 == 0) {
            3150
          // rejected
          } else {
            200
          }
        }
      };
    };
    putProposalV2Internal(proposalId, proposal);
    // check if there is already a proposal history available for the given caller
    switch (getProposalHistoryInternal(caller)) {
      // if so, append the new proposal id to the list
      case (?proposalHistory) putProposalHistoryInternal(caller, List.push(proposalId, proposalHistory));
      // if not, create a new entry
      case null putProposalHistoryInternal(caller, List.make(proposalId));
    };
    Debug.print(debug_show(proposalHistories));
    #ok(proposalId)
  };

  /// Return the proposal with the given ID, if one exists
  public query func getProposal(proposal_id: Nat) : async Result.Result<Types.ProposalView, Text> {
    switch (getProposalV2Internal(proposal_id)) {
      case(?proposal) {
        // mask the current voting state if the proposal is open
        if (proposal.state == #open) {
            return #ok(toProposalView(removeVotingInformationFromProposal(proposal)))
        } else {
          return #ok(toProposalView(proposal))
        }
      };
      case (_) return #err("Proposal not found");
    }
  };

  /// Return the list of all proposals
  public query func listProposals() : async [Types.ProposalView] {
    Trie.toArray<Nat, Types.Proposal, Types.ProposalView>(proposalsV2,
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
  public shared({caller}) func vote(args: Types.VoteArgs) : async Result.Result<(), Text> {
    switch (getProposalV2Internal(args.proposalId)) {
      case null { #err("No proposal with ID " # debug_show(args.proposalId) # " exists") };
      case (?proposal) {
        if (proposal.state != #open) {
            return #err("Proposal " # debug_show(args.proposalId) # " is not open for voting");
        };
        if (args.option >= proposal.options.size()) {
            return #err("Proposal " # debug_show(args.proposalId) # " does not have an option " # debug_show(args.option));
        };
        switch (await getFlowersFrom(caller)) {
          case (#err(error)) { return #err(error) };
          case (#ok({btcFlowers : [Nat32]; ethFlowers : [Nat32]})) {

            // check if a flower already voted
            for (userFlower in Iter.fromArray(btcFlowers)) {
              if (List.some(proposal.flowersVoted.btcFlowers,func (e : Nat32) : Bool = e == userFlower)) {
                  return #err("Already voted. If you bought a new Flower that you want to use to vote, but already casted a vote, please send the new flower to a new wallet and vote there.");
              };
            };
            for (userFlower in Iter.fromArray(ethFlowers)) {
              if (List.some(proposal.flowersVoted.ethFlowers,func (e : Nat32) : Bool = e == userFlower)) {
                  return #err("Already voted. If you bought a new Flower that you want to use to vote, but already casted a vote, please send the new flower to a new wallet and vote there.");
              };
            };

            // get the amount of flowers and thus voting power a holder has
            let votingPower : Nat = (btcFlowers.size() * 2) + ethFlowers.size();

            // track flowers that were used to cast a vote
            let btcFlowersVoted = List.append(List.fromArray<Nat32>(btcFlowers), proposal.flowersVoted.btcFlowers);
            let ethFlowersVoted = List.append(List.fromArray<Nat32>(ethFlowers), proposal.flowersVoted.ethFlowers);

            let updated_proposal : Types.Proposal = {
                id = proposal.id;
                description = proposal.description;
                title = proposal.title;
                flowersVoted = {
                  btcFlowers = btcFlowersVoted;
                  ethFlowers = ethFlowersVoted;
                };
                options = proposal.options;
                state = proposal.state;
                expiryDate = proposal.expiryDate;
                votesCast = proposal.votesCast + votingPower;
                proposer = proposal.proposer;
                votes = Trie.put(proposal.votes, Types.accountKey(caller), Principal.equal, (args.option, votingPower, btcFlowers.size(), ethFlowers.size())).0;
                core = proposal.core;
            };
            // updated proposal in stable memory
            putProposalV2Internal(args.proposalId, updated_proposal);
            // update voting history in stable memory
            switch (getVotingHistoryInternal(caller)) {
              case null {
                putVotingHistoryInternal(caller, List.make<{id: Nat; option: Nat}>({id = args.proposalId; option = args.option}));
              };
              case (?votingHistory) {
                putVotingHistoryInternal(caller, List.push<{id: Nat; option: Nat}>({id = args.proposalId; option = args.option}, votingHistory ));
              };
            };
          };
        };
        #ok()
      };
    };
  };

  public shared query({caller}) func getVotingHistory() : async [{id: Nat; option: Nat}] {
    switch (getVotingHistoryInternal(caller)) {
      case null { return [] };
      case (?votingHistory) { return List.toArray(votingHistory) };
    };
  };

  public shared query({caller}) func getProposalHistory() : async [Nat] {
    switch (getProposalHistoryInternal(caller)) {
      case null { return [] };
      case (?proposalHistory) { return List.toArray(proposalHistory) };
    };
  };

  public query func hasVoted(flowerId: Nat32, collection: {#btcflower; #ethflower}, proposalId: Nat) : async Result.Result<Bool, Text> {
    switch (getProposalV2Internal(proposalId)) {
      case null { #err("No proposal with ID " # debug_show(proposalId) # " exists") };
      case (?proposal) {
        switch collection {
          case (#btcflower) {
            return #ok(List.some(proposal.flowersVoted.btcFlowers,func (e : Nat32) : Bool = e == flowerId));
          };
          case (#ethflower) {
            return #ok(List.some(proposal.flowersVoted.ethFlowers,func (e : Nat32) : Bool = e == flowerId));
          }
        }
      };
    }
  };


  /*******************
  * PRIVATE METHODS *
  *******************/

  func toProposalView(proposal : Types.Proposal) : Types.ProposalView {
    return {
      id = proposal.id;
      title = proposal.title;
      description = proposal.description;
      expiryDate = proposal.expiryDate;
      proposer = proposal.proposer;
      options = proposal.options;
      state = proposal.state;
      votes = Trie.toArray<Principal, (option: Nat, votesCast: Nat, btcFlowers : Nat, ethFlowers : Nat), (Principal, {option: Nat; votesCast: Nat; btcFlowers : Nat; ethFlowers : Nat})>(proposal.votes, func (kv : (Principal, (option: Nat, votesCast: Nat, btcFlowers : Nat, ethFlowers : Nat))) : (Principal, {option: Nat; votesCast: Nat; btcFlowers : Nat; ethFlowers : Nat}) {
        return (kv.0, {option = kv.1.0; votesCast = kv.1.1; btcFlowers = kv.1.2; ethFlowers = kv.1.3});
      });
      flowersVoted = {btcFlowers = List.toArray(proposal.flowersVoted.btcFlowers); ethFlowers = List.toArray(proposal.flowersVoted.ethFlowers)};
      core = proposal.core;
      votesCast = proposal.votesCast;
    };
  };

  func getFlowersFrom(principal: Principal) : async Result.Result<{btcFlowers : [Nat32]; ethFlowers : [Nat32]}, Text> {
    let accountId = Utils.toLowerString(AccountIdentifier.toText(AccountIdentifier.fromPrincipal(principal, null)));
    var btcflower = actor("aaaaa-aa") : actor { tokens: (Text) -> async {#ok: [Nat32]; #err: {#InvalidToken: Text; #Other:Text}}};
    var ethflower = actor("aaaaa-aa") : actor { tokens: (Text) -> async {#ok: [Nat32]; #err: {#InvalidToken: Text; #Other:Text}}};

    switch (localDeploymentCanisterIds) {
      case null {
        btcflower := actor("pk6rk-6aaaa-aaaae-qaazq-cai") : actor  { tokens: (Text) -> async {#ok: [Nat32]; #err: {#InvalidToken: Text; #Other:Text}}};
        ethflower := actor("dhiaa-ryaaa-aaaae-qabva-cai") : actor  { tokens: (Text) -> async {#ok: [Nat32]; #err: {#InvalidToken: Text; #Other:Text}}};
      };
      case (?localDeploymentCanisterIds) {
        btcflower := actor(localDeploymentCanisterIds.btcflower) : actor  { tokens: (Text) -> async {#ok: [Nat32]; #err: {#InvalidToken: Text; #Other:Text}}};
        ethflower := actor(localDeploymentCanisterIds.ethflower) : actor  { tokens: (Text) -> async {#ok: [Nat32]; #err: {#InvalidToken: Text; #Other:Text}}};
      };
    };

    switch (await btcflower.tokens(accountId), await ethflower.tokens(accountId)) {
      case (#ok(btcFlowers), #err(error)) {
        return #ok({btcFlowers = btcFlowers; ethFlowers = []});
      };
      case (#err(error), #ok(ethFlowers)) {
        return #ok({btcFlowers = []; ethFlowers});
      };
      case (#ok(btcFlowers), #ok(ethFlowers)) {
        return #ok({btcFlowers; ethFlowers});
      };
      case _ return #err("Account doesn't own any flowers");
    }
  };

  /// Remove expired proposals
  func closeExpiredProposals() {
    for (kv in Trie.iter(proposalsV2)) {
       if (Time.now() > kv.1.expiryDate) {
         closeProposal(kv.1)
       }
    }
  };

  func removeVotingInformationFromProposal (proposal : Types.Proposal) : Types.Proposal{
    let openProposal : Types.Proposal = {
      id = proposal.id; 
      title = proposal.title;
      description = proposal.description;
      options = proposal.options;
      flowersVoted = proposal.flowersVoted;
      state = proposal.state;
      expiryDate = proposal.expiryDate;
      proposer = proposal.proposer;
      votes = Trie.empty();
      core = proposal.core;
      votesCast = proposal.votesCast;
    };

    return openProposal;
  };

  func closeProposal(proposal: Types.Proposal) {
    // consider the proposal adopted if we pass the threshold, else rejected
    if (proposal.votesCast > votingThreshold) {
      let updated : Types.Proposal = {
        state = #adopted;
        description = proposal.description;
        title = proposal.title;
        options = proposal.options;
        id = proposal.id;
        flowersVoted = proposal.flowersVoted;
        expiryDate = proposal.expiryDate;
        proposer = proposal.proposer;
        votes = proposal.votes;
        votesCast = proposal.votesCast;
        core = proposal.core;
      };
      putProposalV2Internal(proposal.id, updated);
    } else {
      let updated : Types.Proposal = {
        state = #rejected;
        description = proposal.description;
        title = proposal.title;
        options = proposal.options;
        id = proposal.id;
        flowersVoted = proposal.flowersVoted;
        expiryDate = proposal.expiryDate;
        proposer = proposal.proposer;
        votes = proposal.votes;
        votesCast = proposal.votesCast;
        core = proposal.core;
      };

      // updated the proposal in stable memory
      putProposalV2Internal(proposal.id, updated);
    };
  };

  func getProposalV2Internal(id : Nat) : ?Types.Proposal = Trie.get(proposalsV2, Types.proposalKey(id), Nat.equal);

  func putProposalV2Internal(id : Nat, proposal : Types.Proposal) {
    proposalsV2 := Trie.put(proposalsV2, Types.proposalKey(id), Nat.equal, proposal).0;
  };

  func getVotingHistoryInternal(principal : Principal) : ?List.List<{id: Nat; option: Nat}> = Trie.get(votingHistories, Types.accountKey(principal), Principal.equal);

  func putVotingHistoryInternal(principal : Principal, votingHistory: List.List<{id: Nat; option: Nat}>) {
    votingHistories:= Trie.put(votingHistories, Types.accountKey(principal), Principal.equal, votingHistory).0;
  };

  func getProposalHistoryInternal(principal : Principal) : ?List.List<Nat> = Trie.get(proposalHistories, Types.accountKey(principal), Principal.equal);

  func putProposalHistoryInternal(principal : Principal, proposalHistory: List.List<Nat>) {
    proposalHistories := Trie.put(proposalHistories, Types.accountKey(principal), Principal.equal, proposalHistory).0;
  };

};

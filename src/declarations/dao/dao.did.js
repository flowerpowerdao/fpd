export const idlFactory = ({ IDL }) => {
  const List = IDL.Rec();
  const List_1 = IDL.Rec();
  const Trie = IDL.Rec();
  const ProposalState = IDL.Variant({ 'closed' : IDL.Null, 'open' : IDL.Null });
  const Branch = IDL.Record({
    'left' : Trie,
    'size' : IDL.Nat,
    'right' : Trie,
  });
  const Hash = IDL.Nat32;
  const Key = IDL.Record({ 'key' : IDL.Principal, 'hash' : Hash });
  List_1.fill(IDL.Opt(IDL.Tuple(IDL.Tuple(Key, IDL.Nat), List_1)));
  const AssocList = IDL.Opt(IDL.Tuple(IDL.Tuple(Key, IDL.Nat), List_1));
  const Leaf = IDL.Record({ 'size' : IDL.Nat, 'keyvals' : AssocList });
  Trie.fill(
    IDL.Variant({ 'branch' : Branch, 'leaf' : Leaf, 'empty' : IDL.Null })
  );
  const Option = IDL.Record({
    'votes' : IDL.Nat,
    'text' : IDL.Text,
    'voters' : Trie,
  });
  List.fill(IDL.Opt(IDL.Tuple(IDL.Nat32, List)));
  const ClosedProposal = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'expiryDate' : IDL.Int,
    'totalVotes' : IDL.Nat,
    'description' : IDL.Text,
    'state' : ProposalState,
    'timestamp' : IDL.Int,
    'proposer' : IDL.Principal,
    'options' : IDL.Vec(Option),
    'flowers' : List,
  });
  const OpenOption = IDL.Record({ 'text' : IDL.Text });
  const OpenProposal = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'expiryDate' : IDL.Int,
    'totalVotes' : IDL.Nat,
    'description' : IDL.Text,
    'state' : ProposalState,
    'timestamp' : IDL.Int,
    'proposer' : IDL.Principal,
    'options' : IDL.Vec(OpenOption),
    'flowers' : List,
  });
  const ProposalView = IDL.Variant({
    'closed' : ClosedProposal,
    'open' : OpenProposal,
  });
  const ProposalOverview = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'expiryDate' : IDL.Int,
    'totalVotes' : IDL.Nat,
    'state' : ProposalState,
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const VoteArgs = IDL.Record({ 'option' : IDL.Nat, 'proposalId' : IDL.Nat });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const DAO = IDL.Service({
    'getProposal' : IDL.Func([IDL.Nat], [IDL.Opt(ProposalView)], ['query']),
    'listProposalOverviews' : IDL.Func(
        [],
        [IDL.Vec(ProposalOverview)],
        ['query'],
      ),
    'listProposals' : IDL.Func([], [IDL.Vec(ProposalView)], ['query']),
    'submitProposal' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Vec(IDL.Text), IDL.Nat],
        [Result_1],
        [],
      ),
    'vote' : IDL.Func([VoteArgs], [Result], []),
  });
  return DAO;
};
export const init = ({ IDL }) => { return []; };

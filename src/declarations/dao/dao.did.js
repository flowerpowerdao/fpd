export const idlFactory = ({ IDL }) => {
  const List = IDL.Rec();
  const List_1 = IDL.Rec();
  const Trie = IDL.Rec();
  List_1.fill(IDL.Opt(IDL.Tuple(IDL.Principal, List_1)));
  const ProposalState = IDL.Variant({ 'closed' : IDL.Null, 'open' : IDL.Null });
  const Branch = IDL.Record({
    'left' : Trie,
    'size' : IDL.Nat,
    'right' : Trie,
  });
  const Hash = IDL.Nat32;
  const Key = IDL.Record({ 'key' : IDL.Principal, 'hash' : Hash });
  List.fill(IDL.Opt(IDL.Tuple(IDL.Tuple(Key, IDL.Nat), List)));
  const AssocList = IDL.Opt(IDL.Tuple(IDL.Tuple(Key, IDL.Nat), List));
  const Leaf = IDL.Record({ 'size' : IDL.Nat, 'keyvals' : AssocList });
  Trie.fill(
    IDL.Variant({ 'branch' : Branch, 'leaf' : Leaf, 'empty' : IDL.Null })
  );
  const Option = IDL.Record({
    'votes' : IDL.Nat,
    'text' : IDL.Text,
    'voters' : Trie,
  });
  const Proposal = IDL.Record({
    'id' : IDL.Nat,
    'totalVotes' : IDL.Nat,
    'description' : IDL.Text,
    'voters' : List_1,
    'state' : ProposalState,
    'timestamp' : IDL.Int,
    'proposer' : IDL.Principal,
    'options' : IDL.Vec(Option),
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const VoteArgs = IDL.Record({ 'option' : IDL.Nat, 'proposalId' : IDL.Nat });
  const Result = IDL.Variant({ 'ok' : ProposalState, 'err' : IDL.Text });
  const DAO = IDL.Service({
    'get_proposal' : IDL.Func([IDL.Nat], [IDL.Opt(Proposal)], ['query']),
    'list_proposals' : IDL.Func([], [IDL.Vec(Proposal)], ['query']),
    'submit_proposal' : IDL.Func([IDL.Text, IDL.Vec(IDL.Text)], [Result_1], []),
    'vote' : IDL.Func([VoteArgs], [Result], []),
    'whoami' : IDL.Func([], [IDL.Text], []),
  });
  return DAO;
};
export const init = ({ IDL }) => { return []; };

export const idlFactory = ({ IDL }) => {
  const List = IDL.Rec();
  const List_1 = IDL.Rec();
  const Trie = IDL.Rec();
  const Branch = IDL.Record({
    'left' : Trie,
    'size' : IDL.Nat,
    'right' : Trie,
  });
  const Hash = IDL.Nat32;
  const Key = IDL.Record({ 'key' : IDL.Principal, 'hash' : Hash });
  List_1.fill(
    IDL.Opt(IDL.Tuple(IDL.Tuple(Key, IDL.Tuple(IDL.Nat, IDL.Nat)), List_1))
  );
  const AssocList = IDL.Opt(
    IDL.Tuple(IDL.Tuple(Key, IDL.Tuple(IDL.Nat, IDL.Nat)), List_1)
  );
  const Leaf = IDL.Record({ 'size' : IDL.Nat, 'keyvals' : AssocList });
  Trie.fill(
    IDL.Variant({ 'branch' : Branch, 'leaf' : Leaf, 'empty' : IDL.Null })
  );
  const ProposalState = IDL.Variant({
    'open' : IDL.Null,
    'rejected' : IDL.Null,
    'adopted' : IDL.Null,
  });
  List.fill(IDL.Opt(IDL.Tuple(IDL.Nat32, List)));
  const Proposal = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'votes' : Trie,
    'expiryDate' : IDL.Int,
    'description' : IDL.Text,
    'state' : ProposalState,
    'timestamp' : IDL.Int,
    'proposer' : IDL.Principal,
    'flowersVoted' : List,
    'options' : IDL.Vec(IDL.Text),
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const VoteArgs = IDL.Record({ 'option' : IDL.Nat, 'proposalId' : IDL.Nat });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const DAO = IDL.Service({
    'getProposal' : IDL.Func([IDL.Nat], [IDL.Opt(Proposal)], ['query']),
    'getVotingHistory' : IDL.Func([], [IDL.Vec(IDL.Nat)], ['query']),
    'listProposals' : IDL.Func([], [IDL.Vec(Proposal)], ['query']),
    'submitProposal' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Vec(IDL.Text)],
        [Result_1],
        [],
      ),
    'vote' : IDL.Func([VoteArgs], [Result], []),
  });
  return DAO;
};
export const init = ({ IDL }) => { return [IDL.Bool, IDL.Opt(IDL.Text)]; };

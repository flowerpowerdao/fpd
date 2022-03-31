export const idlFactory = ({ IDL }) => {
  const ProposalState = IDL.Variant({
    'open' : IDL.Null,
    'rejected' : IDL.Null,
    'adopted' : IDL.Null,
  });
  const ProposalView = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'votes' : IDL.Vec(
      IDL.Tuple(
        IDL.Principal,
        IDL.Record({ 'option' : IDL.Nat, 'votesCast' : IDL.Nat }),
      )
    ),
    'expiryDate' : IDL.Int,
    'description' : IDL.Text,
    'state' : ProposalState,
    'timestamp' : IDL.Int,
    'proposer' : IDL.Principal,
    'flowersVoted' : IDL.Vec(IDL.Nat32),
    'options' : IDL.Vec(IDL.Text),
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const VoteArgs = IDL.Record({ 'option' : IDL.Nat, 'proposalId' : IDL.Nat });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const DAO = IDL.Service({
    'getProposal' : IDL.Func([IDL.Nat], [IDL.Opt(ProposalView)], ['query']),
    'getVotingHistory' : IDL.Func([], [IDL.Vec(IDL.Nat)], ['query']),
    'listProposals' : IDL.Func([], [IDL.Vec(ProposalView)], ['query']),
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

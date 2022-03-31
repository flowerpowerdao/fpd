export const idlFactory = ({ IDL }) => {
  const MetricsGranularity = IDL.Variant({
    'hourly' : IDL.Null,
    'daily' : IDL.Null,
  });
  const GetMetricsParameters = IDL.Record({
    'dateToMillis' : IDL.Nat,
    'granularity' : MetricsGranularity,
    'dateFromMillis' : IDL.Nat,
  });
  const UpdateCallsAggregatedData = IDL.Vec(IDL.Nat64);
  const CanisterHeapMemoryAggregatedData = IDL.Vec(IDL.Nat64);
  const CanisterCyclesAggregatedData = IDL.Vec(IDL.Nat64);
  const CanisterMemoryAggregatedData = IDL.Vec(IDL.Nat64);
  const HourlyMetricsData = IDL.Record({
    'updateCalls' : UpdateCallsAggregatedData,
    'canisterHeapMemorySize' : CanisterHeapMemoryAggregatedData,
    'canisterCycles' : CanisterCyclesAggregatedData,
    'canisterMemorySize' : CanisterMemoryAggregatedData,
    'timeMillis' : IDL.Int,
  });
  const NumericEntity = IDL.Record({
    'avg' : IDL.Nat64,
    'max' : IDL.Nat64,
    'min' : IDL.Nat64,
    'first' : IDL.Nat64,
    'last' : IDL.Nat64,
  });
  const DailyMetricsData = IDL.Record({
    'updateCalls' : IDL.Nat64,
    'canisterHeapMemorySize' : NumericEntity,
    'canisterCycles' : NumericEntity,
    'canisterMemorySize' : NumericEntity,
    'timeMillis' : IDL.Int,
  });
  const CanisterMetricsData = IDL.Variant({
    'hourly' : IDL.Vec(HourlyMetricsData),
    'daily' : IDL.Vec(DailyMetricsData),
  });
  const CanisterMetrics = IDL.Record({ 'data' : CanisterMetricsData });
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
    'collectCanisterMetrics' : IDL.Func([], [], []),
    'getCanisterMetrics' : IDL.Func(
        [GetMetricsParameters],
        [IDL.Opt(CanisterMetrics)],
        ['query'],
      ),
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

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
        IDL.Record({
          'btcFlowers' : IDL.Nat,
          'option' : IDL.Nat,
          'ethFlowers' : IDL.Nat,
          'votesCast' : IDL.Nat,
        }),
      )
    ),
    'expiryDate' : IDL.Int,
    'core' : IDL.Bool,
    'description' : IDL.Text,
    'state' : ProposalState,
    'votesCast' : IDL.Nat,
    'proposer' : IDL.Principal,
    'flowersVoted' : IDL.Record({
      'btcFlowers' : IDL.Vec(IDL.Nat32),
      'ethFlowers' : IDL.Vec(IDL.Nat32),
    }),
    'options' : IDL.Vec(IDL.Text),
  });
  const Result_3 = IDL.Variant({ 'ok' : ProposalView, 'err' : IDL.Text });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  const ProposalPublic = IDL.Record({
    'title' : IDL.Text,
    'description' : IDL.Text,
    'options' : IDL.Vec(IDL.Text),
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Vec(IDL.Text) });
  const VoteArgs = IDL.Record({ 'option' : IDL.Nat, 'proposalId' : IDL.Nat });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const DAO = IDL.Service({
    'collectCanisterMetrics' : IDL.Func([], [], []),
    'getCanisterMetrics' : IDL.Func(
        [GetMetricsParameters],
        [IDL.Opt(CanisterMetrics)],
        ['query'],
      ),
    'getProposal' : IDL.Func([IDL.Nat], [Result_3], ['query']),
    'getProposalHistory' : IDL.Func([], [IDL.Vec(IDL.Nat)], ['query']),
    'getVotingHistory' : IDL.Func(
        [],
        [IDL.Vec(IDL.Record({ 'id' : IDL.Nat, 'option' : IDL.Nat }))],
        ['query'],
      ),
    'hasVoted' : IDL.Func(
        [
          IDL.Nat32,
          IDL.Variant({
            'btcflower' : IDL.Null,
            'icpflower' : IDL.Null,
            'ethflower' : IDL.Null,
          }),
          IDL.Nat,
        ],
        [Result_2],
        ['query'],
      ),
    'listProposals' : IDL.Func([], [IDL.Vec(ProposalView)], ['query']),
    'submitProposal' : IDL.Func([ProposalPublic], [Result_1], []),
    'vote' : IDL.Func([VoteArgs], [Result], []),
  });
  return DAO;
};
export const init = ({ IDL }) => {
  return [
    IDL.Opt(
      IDL.Record({
        'btcflower' : IDL.Text,
        'icpflower' : IDL.Text,
        'ethflower' : IDL.Text,
      })
    ),
    IDL.Vec(IDL.Principal),
  ];
};

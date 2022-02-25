for i in {0..30}
do
dfx canister call --async dao submit_proposal '("proposal '$i'", vec { "option 1"; "option 2"; "option 3"}, 0)'
done

for i in {0..30}
do
dfx canister call --async dao submit_proposal '("proposal '$i'", vec { "option 1"; "option 2"; "option 3"}, 3)'
done
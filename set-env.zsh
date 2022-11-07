# do not changes those variables
export BTCFLOWER_LOCAL_CANISTER_ID=$(jq '.staging.local' ./btcflower-nft/btcflower-nft/.dfx/local/canister_ids.json)
export ETHFLOWER_LOCAL_CANISTER_ID=$(jq '.staging.local' ./ethflower-nft-canister/.dfx/local/canister_ids.json)
export ICPFLOWER_LOCAL_CANISTER_ID=$(jq '.staging.local' ./icpflower-nft-canister/.dfx/local/canister_ids.json)
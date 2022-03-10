- clone the repository
- run `npm install` from root
- run `dfx start --clean --background` from root
- `cd btcflower-nft/btcflower-nft` and run `dfx deploy --argument '(principal "<your_principal>")' staging` to deploy the canister locally, make sure you are on the `local-deployment` branch
- now run `dfx canister call staging addAsset '(record {name = "privat";payload = record {ctype = "text/html"; data = vec {blob "hello world!"} } })'` to add an asset
- now run `dfx canister call staging initMint '("<your_address>")'` mint NFTs to your address
- go back to the root directory and run `npm run dev`



- clone the repository and run `git submodule init` and `git submodule update`
- run `npm install` from root
- run `dfx start --clean --background` from root
- `cd btcflower-nft/btcflower-nft` and run `dfx deploy --argument '(principal "<your_principal>")' staging` to deploy the btcflower canister locally, make sure you are on the `local-deployment` branch
- now run `dfx canister call staging addAsset '(record {name = "privat";payload = record {ctype = "text/html"; data = vec {blob "hello world!"} } })'` to add an asset
- now run `dfx canister call staging initMint '(vec { "<your_address1>"; "<your_address2>" })'` to mint NFTs to your addresses, preferably a stoic/plug address to interact with the frontend and a dfx address to interact from the command line
- go back to the root directory and run `npm run dev`



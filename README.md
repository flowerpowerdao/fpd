# development 👷‍♀️

- install dfx versions `0.8.5`, `0.9.2` and `0.9.3` (`DFX_VERSION=<version> sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"`)
- clone the repository and run `git submodule init` and `git submodule update`. this pulls the submodules the project depends on
- run `npm install` from root
- create a `set-deploy-env.zsh` file in the root directory according to the following example and replace the `NFT_CANISTER_OWNER_PRINICPAL` with the principal of your local `dfx identity` (usually `dfx identity get-principal`) and the `NFT_MINT_ADDRESSES` with addresses you would like to mint NFTs for.

```
# those should be changed, enter your principals and addresses as needed
export NFT_CANISTER_OWNER_PRINCIPAL="\"aaaaa-hhhh-dgumq-aaaaa-aaaaa-ayr3z-moywz-jqblc-nvsif-aaaaa-aaa\""
# note that you cannot have spaces between characters here!
export NFT_MINT_ADDRESSES="\"1111156ca79711111c288cbe0da2c9ae073304329dcd11111d8df19416baf3b0\";\"11111eb53f60d028b4bdfe7bc1594c907b81311111d6f6713121dcb5611111\";\"111111ac04a4e2b2e90ca2f55e11111edf53a67a7ed22804411111726eb24f\""
```

- run `npm run deploy` from root. this sets up the project for development, including starting dfx and deploying local versions of the `btcflower` and `ethflower` canisters
- in a new terminal window, run `npm run dev` from root. this starts the development server and allows you to instantly see changes on the frontend
- to seed the local `dao` canister with proposals, run `npm run seed` from root. this create a bunch of dummy proposals on the local canister

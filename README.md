# Development 👷‍♀️

- install latest dfx (`sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"`)
- install [Vessel](https://github.com/dfinity/vessel)
- install [jq](https://stedolan.github.io/jq/download/)
- install [Plug](https://plugwallet.ooo/)
- clone the repository and run `git submodule init` and `git submodule update`. this pulls the submodules the project depends on
- run `npm install` from root

- Create a `set-deploy-env.zsh` file in the root directory according to the following example and replace the `WALLET_ADDRESS` with your Plug wallet address

```sh
export WALLET_ADDRESS="8b61ff722d7e6321eb99bb607ab0cf323b3c64b43d6a13c245c8a4e197f7b38b"
```

- run `npm start` from root. This sets up the project for development, including starting dfx, deploying local versions of the `btcflower`, `icpflower` and `ethflower` canisters and starts development server and allows you to instantly see changes on the frontend
- to populate the local `dao` canister with test proposals, run `npm run test-proposals` from root. this create a bunch of dummy proposals on the local canister.
- to trigger a canister upgrade run `npm run upgrade`

# Production deployment

run `npm run deploy-ic` to deploy the dao

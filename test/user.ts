import { FakeUser } from './utils/fake-user';
import canisterIds from '../.dfx/local/canister_ids.json';

import { idlFactory as idlFactoryDao } from '../src/declarations/dao/index.js';
import { _SERVICE as _SERVICE_DAO } from '../src/declarations/dao/dao.did';

import { idlFactory as idlFactoryExt } from '../src/declarations/power-equalizer/index.js';
import { _SERVICE as _SERVICE_EXT } from '../src/declarations/power-equalizer/staging.did';

// import { idlFactory as idlFactorySeed } from '../src/declarations/icrc1/index.js';
// import { _SERVICE as _SERVICE_SEED } from '../src/declarations/icrc1/icrc1.did';

import { tokenIdentifier } from './utils';


export class User extends FakeUser {
  mainActor = this.createActor<_SERVICE_DAO>(idlFactoryDao, canisterIds.dao.local);
  // seedActor = this.createActor<_SERVICE_SEED>(idlFactorySeed, canisterIds.seed.local);
  btcFlowerActor = this.createActor<_SERVICE_EXT>(idlFactoryExt, canisterIds.btcflower.local);
  ethFlowerActor = this.createActor<_SERVICE_EXT>(idlFactoryExt, canisterIds.ethflower.local);
  icpFlowerActor = this.createActor<_SERVICE_EXT>(idlFactoryExt, canisterIds.icpflower.local);

  async mintFlower(actor: _SERVICE_EXT, canisterId: string, to: string = this.accountId) {
    let minter = new User('minter');
    let tokens = await actor.tokens(minter.accountId);

    if (tokens['err'] || tokens['ok'].length == 0) {
      throw new Error('Minter has no tokens');
    }

    await actor.transfer({
      amount: 1n,
      from: { address: minter.accountId },
      to: { address: to },
      memo: [],
      notify: false,
      subaccount: [],
      token: tokenIdentifier(canisterId, tokens['ok'][0]),
    });
  }

  async mintBTCFlower(to?: string) {
    await this.mintFlower(new User('minter').btcFlowerActor, canisterIds.btcflower.local, to);
  }

  async mintETHFlower(to?: string) {
    await this.mintFlower(new User('minter').ethFlowerActor, canisterIds.ethflower.local, to);
  }

  async mintICPFlower(to?: string) {
    await this.mintFlower(new User('minter').icpFlowerActor, canisterIds.icpflower.local, to);
  }
}
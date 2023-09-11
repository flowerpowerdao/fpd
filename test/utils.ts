import { Principal } from "@dfinity/principal";
import { AccountIdentifier, SubAccount } from "@dfinity/nns";
import { Account } from '../src/declarations/icrc1/icrc1.did';

export function feeOf(amount: bigint, fee: bigint) {
  return amount * fee / 100_000n;
}

export function applyFees(amount: bigint, fees: bigint[]) {
  let result = amount;
  for (let fee of fees) {
    result -= amount * fee / 100_000n;
  }
  return result;
}

// https://github.com/Toniq-Labs/ext-cli/blob/main/src/utils.js#L62-L66
export let to32bits = (num) => {
  let b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, num);
  return Array.from(new Uint8Array(b));
}

// https://github.com/Toniq-Labs/ext-cli/blob/main/src/extjs.js#L20-L45
export let tokenIdentifier = (canisterId, index) => {
  let padding = Buffer.from("\x0Atid");
  let array = new Uint8Array([
      ...padding,
      ...Principal.fromText(canisterId).toUint8Array(),
      ...to32bits(index),
  ]);
  return Principal.fromUint8Array(array).toText();
};

export let toAccount = (address: string) => {
  return { account: AccountIdentifier.fromHex(address).toNumbers() };
}

export let toAccountId = (account: Account) => {
  if (account.subaccount[0]) {
    let sa = account.subaccount[0];
    return AccountIdentifier.fromPrincipal({
      principal: account.owner,
      subAccount: sa ? {
        toUint8Array: () => Uint8Array.from(sa)
      } as SubAccount : undefined,
    }).toHex();
  }
  else {
    return AccountIdentifier.fromPrincipal({principal: account.owner}).toHex();
  }
};
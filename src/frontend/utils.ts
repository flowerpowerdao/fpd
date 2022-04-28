import { sha224 } from "js-sha256";
import crc32 from "crc-32";
import type { ProposalView as Proposal } from "../declarations/dao/dao.did";

// Results
export function fromOk(result): any {
  // get the value from an ok result
  return result.ok;
}

export function fromErr(result): any {
  // get the err from an error result
  return Object.keys(result.err)[0];
}

export function isOk(result): boolean {
  if (result) {
    if ("ok" in result) {
      return true;
    }
  }
  return false;
}

export function isErr(result): boolean {
  if (result) {
    if ("err" in result) {
      return true;
    }
  }
  return false;
}

export function fromVariantToString(v): string {
  // A Motoko variant is stored in javascript as an
  // object with a single property eg {"system": null}
  return Object.keys(v)[0];
}

export function getVariantValue(v): any {
  // A Motoko variant can be stored with a value, represented in javascript as an
  // object with a single property eg {"system": possiblevalue }
  // return the possible value
  return Object.values(v)[0];
}

export const toNullable = <T>(value?: T): [] | [T] => {
  return value ? [value] : [];
};

export const fromNullable = <T>(value: [] | [T]): T | undefined => {
  return value?.[0];
};

export type Time = bigint;

export const fromTimestamp = (value: Time): Date => {
  return new Date(Number(value) / 1000000);
};

export const toTimestamp = (value: Date): Time => {
  return BigInt(value.getTime());
};

// from tipjar (https://github.com/ninegua/tipjar/blob/b68730fa85a6b3d46aa2173ddc9a9b268d1be45b/src/tipjar_assets/src/agent.js#L62)
export function principalToAccountId(principal, subaccount) {
  const shaObj = sha224.create();
  shaObj.update("\x0Aaccount-id");
  shaObj.update(principal.toUint8Array());
  shaObj.update(subaccount ? subaccount : new Uint8Array(32));
  const hash = new Uint8Array(shaObj.array());
  const crc = crc32.buf(hash);
  return toHexString([
    (crc >> 24) & 0xff,
    (crc >> 16) & 0xff,
    (crc >> 8) & 0xff,
    crc & 0xff,
    ...hash,
  ]);
}

export function toHexString(byteArray: number[]) {
  return Buffer.from(byteArray).toString("hex");
}

// truncate string
export function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

// get winning option
export function getWinningOption(proposal: Proposal): string {
  let outcome = {};
  proposal.votes.forEach((vote) => {
    if (Number(vote[1].option) in outcome) {
      outcome[Number(vote[1].option)] += vote[1].votesCast;
    } else {
      outcome[Number(vote[1].option)] = vote[1].votesCast;
    }
  });

  // get biggest value in outcome
  let biggest;
  try {
    biggest = Object.keys(outcome).reduce((a, b) =>
      outcome[a] > outcome[b] ? a : b,
    );
  } catch (error) {
    return "no votes";
  }

  // return option
  return proposal.options[biggest] === undefined
    ? "no options"
    : proposal.options[biggest];
}

export function getVotesForOption(proposal: Proposal, option: number) {
  return proposal.votes.reduce((acc, vote) => {
    if (Number(vote[1].option) === option) {
      return acc + Number(vote[1].votesCast);
    } else {
      return acc;
    }
  }, 0);
}

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

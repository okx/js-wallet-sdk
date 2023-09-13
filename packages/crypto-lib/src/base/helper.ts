export function isHexString(value: string, length?: number) {
  if (!value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }

  return !(length && value.length !== 2 + 2 * length);
}
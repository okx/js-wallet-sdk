export function isHexString(value: string, length?: number) {
  if (!value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }

  return !(length && value.length !== 2 + 2 * length);
}

export function validateHexString(value: string) {
  if (!value) {
    return false;
  }
  const hexStr = value.toLowerCase().startsWith("0x") ? value.substring(2).toLowerCase() : value.toLowerCase();
  if(hexStr.length === 0 || hexStr.length % 2 !== 0) {
    return false;
  }
  if (!hexStr.match(/^[0-9A-Fa-f]*$/)) {
    return false;
  }
  return true
}
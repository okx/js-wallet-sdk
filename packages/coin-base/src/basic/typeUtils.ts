import { base, BigNumber } from '@okxweb3/crypto-lib';

export function convert2Number(data: any) {
  if(data == undefined) {
    return undefined
  }
  if(typeof data === "string") {
    return parseInt(data)
  }
  return data
}

export function convert2BigNumber(data: any) {
  if(data == undefined) {
    return undefined
  }

  if(BigNumber.isBigNumber(data)) {
    return data
  }

  // string | number
  return new BigNumber(data)
}

export function assertBufferLength(data: Buffer | Uint8Array, length: number) {
   if(data.length != length) {
     throw Error("buffer length is illegal")
   }
}

export function cloneObject(data: any) {
  return JSON.parse(JSON.stringify(data))
}

export function jsonStringifyUniform(data: any) {
  return JSON.stringify(data, (key: string, value: any) => {
    if(!value) {
      return value
    }
    if(value.type === "Buffer") {
      return base.toHex(value);
    } else if(value instanceof Uint8Array) {
      return base.toHex(value);
    } else if(typeof value === 'bigint') {
      return value.toString();
    } else {
      return value;
    }
  })
}

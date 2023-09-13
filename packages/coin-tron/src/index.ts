import { base, Long, signUtil,abi } from '@okxweb3/crypto-lib';
import { google, protocol } from './protobuf/tron';
import * as eth from "@okxweb3/coin-ethereum"

import ContractType = protocol.Transaction.Contract.ContractType;

export const HEX_ADDRESS_SIZE = 21;
export const ADDRESS_PREFIX_BYTE = 0x41;
export const ADDRESS_PREFIX = "41";

const TRX_MESSAGE_HEADER = "\x19TRON Signed Message:\n32";
const ETH_MESSAGE_HEADER = "\x19Ethereum Signed Message:\n32";

export type MessageType = "hex" | "legacy" | "protobuf";

export function getPubKeyFromPriKey(priKeyBytes: Buffer) {
  return signUtil.secp256k1.publicKeyCreate(priKeyBytes,false)
}

export function computeAddress(pubBytes: Buffer) {
  if (pubBytes.length === 65) {
    pubBytes = pubBytes.slice(1);
  }
  // hash takes last 20 bits
  const hash = base.keccak256(pubBytes)
  const addressBytes = []
  addressBytes.push(ADDRESS_PREFIX_BYTE)
  addressBytes.push(...hash.slice(12))
  return Buffer.from(addressBytes);
}

export function addressFromPrivate(privateKeyHex: string): string {
  let publicKey = getPubKeyFromPriKey(base.fromHex(privateKeyHex));
  let addressBytes = computeAddress(publicKey);
  return base.toBase58Check(addressBytes);
}

export function addressFromPublic(publicKeyHex: string): string {
  let publicKey = base.fromHex(publicKeyHex);
  if (publicKey.length !== 64) {
    const pk = signUtil.secp256k1.publicKeyConvert(publicKey, false);
    publicKey = Buffer.from(pk!.slice(1));
  }
  let addressBytes = computeAddress(publicKey);
  return base.toBase58Check(addressBytes);
}

// validate address
export function validateAddress(address: string): boolean {
  try {
    if(base.isHexString(address) || (address.startsWith(ADDRESS_PREFIX) && address.length == HEX_ADDRESS_SIZE * 2)) {
        const buf = base.fromHex(address)
        if(buf.length != HEX_ADDRESS_SIZE) {
          return false
        }
       return buf[0] === ADDRESS_PREFIX_BYTE;
    }

    const buf = base.fromBase58Check(address);
    if (buf.length !== HEX_ADDRESS_SIZE) {
      return false;
    }
    return buf[0] === ADDRESS_PREFIX_BYTE;
  } catch (e) {
     return false;
  }
}

export function toHexAddress(address: string) {
  if(base.isHexString(address)) {
    return address
  }
  const buf = base.fromBase58Check(address);
  return base.toHex(buf)
}

export interface CommonTransactionParams {
  fromAddress: string,
  refBlockBytes: string,
  refBlockHash: string,
  expiration: number,
  timeStamp: number,
  feeLimit?: number,
}

export interface TransferTransactionParams extends CommonTransactionParams{
  // target address
  toAddress: string,
  // quantity
  amount: string,
}

export interface AssetTransferTransactionParams extends TransferTransactionParams {
  // trc10 name of assert
  assetName: string
}

export interface TokenTransferTransactionParams extends TransferTransactionParams {
  // contract address
  contractAddress: string
}

export function createRawTransaction(param: CommonTransactionParams, contractArray: protocol.Transaction.IContract[]) {
  return protocol.Transaction.raw.create({
    refBlockBytes: base.fromHex(param.refBlockBytes),
    refBlockHash: base.fromHex(param.refBlockHash),
    expiration: param.expiration,
    timestamp: param.timeStamp,
    feeLimit: param.feeLimit,
    contract: contractArray
  })
}

export function signRawTransaction(raw: protocol.Transaction.raw, privateKey: string) {
  const tr = protocol.Transaction.create({
   rawData: raw
  })
  const rawBytes = protocol.Transaction.raw.encode(raw).finish()
  const message = base.sha256(rawBytes)
  if (!privateKey) {
   return {
     raw: base.toHex(rawBytes),
     hash: base.toHex(message),
   };
  }
  const {signature, recovery} = signUtil.secp256k1.sign(Buffer.from(message), base.fromHex(privateKey), true)
  const signatureBytes = Buffer.concat([Uint8Array.from(signature), Uint8Array.of(recovery)])
  tr.signature.push(signatureBytes)
  const trBytes = protocol.Transaction.encode(tr).finish()
  return base.toHex(trBytes)
}

export function getTxIdBySignedTx(signedTx: string) {
  const tx = protocol.Transaction.decode(base.fromHex(signedTx));
  const rawBytes = protocol.Transaction.raw.encode(tx.rawData as protocol.Transaction.raw).finish();
  return base.toHex(base.sha256(rawBytes));
}

function getAddressHash(address: string) {
  if(base.isHexString(address) || (address.startsWith(ADDRESS_PREFIX) && address.length == HEX_ADDRESS_SIZE * 2)) {
     return base.fromHex(address)
  }
  return base.fromBase58Check(address)
}

export function transferContract(param: TransferTransactionParams) {
    const array = []
    const contract  = protocol.TransferContract.create({
     ownerAddress: getAddressHash(param.fromAddress),
     toAddress: getAddressHash(param.toAddress),
     amount: Long.fromString(param.amount)
   })

   const cmd = protocol.Transaction.Contract.create({
    type: ContractType.TransferContract,
    parameter: google.protobuf.Any.create({
      type_url: "type.googleapis.com/protocol.TransferContract",
      value: protocol.TransferContract.encode(contract).finish()
    })
  })
   array.push(cmd)
   return array
}

export function transfer(param: TransferTransactionParams, privateKey: string) {
  const contracts = transferContract(param)
  const raw = createRawTransaction(param, contracts)
  return signRawTransaction(raw, privateKey)
}

export function assetTransferContract(param: AssetTransferTransactionParams) {
  const array = []
  const contract  = protocol.TransferAssetContract.create({
    assetName: base.fromHex(param.assetName),
    ownerAddress: getAddressHash(param.fromAddress),
    toAddress: getAddressHash(param.toAddress),
    amount: Long.fromString(param.amount)
  })

  const cmd = protocol.Transaction.Contract.create({
    type: ContractType.TransferAssetContract,
    parameter: google.protobuf.Any.create({
      type_url: "type.googleapis.com/protocol.TransferAssetContract",
      value: protocol.TransferAssetContract.encode(contract).finish()
    })
  })
  array.push(cmd)
  return array
}

export function assetTransfer(param: AssetTransferTransactionParams, privateKey: string) {
  const contracts = assetTransferContract(param)
  const raw = createRawTransaction(param, contracts)
  return signRawTransaction(raw, privateKey)
}

export function getTransferData(param: TokenTransferTransactionParams) {
   const toAddress = "0x" + base.toHex(getAddressHash(param.toAddress)).slice(2)
   const sigId = base.keccak256(Buffer.from("transfer(address,uint256)")).slice(0, 4)
   return Buffer.concat([sigId, abi.RawEncode(['address', 'uint256'], [toAddress, param.amount],)])
}

export function tokenTransferContract(param: TokenTransferTransactionParams) {
  const array = []
  const contract  = protocol.TriggerSmartContract.create({
    ownerAddress: getAddressHash(param.fromAddress),
    contractAddress: getAddressHash(param.contractAddress),
    data: getTransferData(param),
    callValue: 0,
    callTokenValue: 0,
  })

  const cmd = protocol.Transaction.Contract.create({
    type: ContractType.TriggerSmartContract,
    parameter: google.protobuf.Any.create({
      type_url: "type.googleapis.com/protocol.TriggerSmartContract",
      value: protocol.TriggerSmartContract.encode(contract).finish()
    })
  })
  array.push(cmd)
  return array
}

export function tokenTransfer(param: TokenTransferTransactionParams, privateKey: string) {
  const contracts = tokenTransferContract(param)
  const raw = createRawTransaction(param, contracts)
  return signRawTransaction(raw, privateKey)
}

// signature of txId(returned from nodes)
export function signByTxId(txId: string, priKey: string): string {
  let hashBytes = Buffer.from(base.fromHex(txId));
  let priKeyBytes = Buffer.from((base.fromHex(priKey)));
  const {signature, recovery} = signUtil.secp256k1.sign(hashBytes, priKeyBytes, false);
  const result = []
  result.push(...signature)
  result.push(recovery)
  return base.toHex(result);
}

function isJson(data: string) {
  try {
    return !!JSON.parse(data);
  } catch (ex) {
    return false;
  }
}

function isHexString(value: string) {
  return value.match(/^[0-9A-Fa-f]*$/) || value.match(/^0x[0-9A-Fa-f]*$/)
}

// sign message, compatible with eth
export function signMessage(type: MessageType, message: string, priKey: string, useTronHeader = true): string {
  if(type === "hex") {
    let msg = Buffer.from(base.fromHex(message));
    let header = Buffer.from(useTronHeader ? TRX_MESSAGE_HEADER : ETH_MESSAGE_HEADER)

    let messageBytes = Buffer.concat([header, msg], header.length + msg.length)
    const messageDigest = base.keccak256(messageBytes);

    if(!priKey) {
      return base.toHex(messageDigest);
    }
    let priKeyBytes = Buffer.from((base.fromHex(priKey)));
    const {v, r, s} = eth.ecdsaSign(eth.toBuffer(messageDigest), priKeyBytes);
    return eth.makeSignature(v, r, s);
  } else if(type === "legacy") {
    const obj = JSON.parse(message)
    if("txID" in obj) {
      if(!priKey) {
        return obj.txID;
      }
      const sig = signByTxId(obj.txID, priKey)
      obj.signature = [sig]
      return JSON.stringify(obj)
    } else {
      throw new Error("message must be hex or transaction object")
    }
  } else if (type === "protobuf") {
    const obj = JSON.parse(message);
    const raw = base.fromHex(obj.raw_data_hex);
    const rawData = protocol.Transaction.raw.decode(Uint8Array.from(raw));
    const tr = protocol.Transaction.create({
      rawData: rawData,
    });
    const messageHash = base.sha256(raw);
    const { signature, recovery } = signUtil.secp256k1.sign(Buffer.from(messageHash), base.fromHex(priKey), true);
    const signatureBytes = Buffer.concat([Uint8Array.from(signature), Uint8Array.of(recovery)]);
    tr.signature.push(signatureBytes);
    const trBytes = protocol.Transaction.encode(tr).finish();
    return base.toHex(trBytes);
  } else {
    throw new Error("message must be hex or transaction object")
  }
}

// sign message, compatible with eth
export function signMessage2(data: string, privateKey: string): string {
  const obj = JSON.parse(data);
  const raw = base.fromHex(obj.raw_data_hex);
  const rawData = protocol.Transaction.raw.decode(Uint8Array.from(raw));
  const tr = protocol.Transaction.create({
    rawData: rawData,
  });
  const message = base.sha256(raw);
  const { signature, recovery } = signUtil.secp256k1.sign(Buffer.from(message), base.fromHex(privateKey), true);
  const signatureBytes = Buffer.concat([Uint8Array.from(signature), Uint8Array.of(recovery)]);
  tr.signature.push(signatureBytes);
  const trBytes = protocol.Transaction.encode(tr).finish();
  return base.toHex(trBytes);
}

// validate signature
export function verifySignature(message: string, signature: string, useTronHeader = true): string | null {
  let msg = base.fromHex(message);
  let signatureBytes = base.fromHex(signature);

  let header = Buffer.from(useTronHeader ? TRX_MESSAGE_HEADER : ETH_MESSAGE_HEADER)
  let messageBytes = Buffer.concat([header, msg], header.length + msg.length)

  const messageDigest = base.keccak256(messageBytes);
  const recoveryParam = base.stripHexPrefix(signature).substring(128, 130) == "1c" ? 1 : 0
  const publicKey = signUtil.secp256k1.recover(signatureBytes, recoveryParam, messageDigest, false);
  if(publicKey == null) {
    return null
  }
  let addressBytes = computeAddress(publicKey);
  return base.toBase58Check(addressBytes);
}

export function getMPCTransaction(raw: string, sig: string, publicKey: string) {
  const rawBytes = base.fromHex(raw);
  const tx = protocol.Transaction.create({
    rawData: protocol.Transaction.raw.decode(rawBytes)
  });

  const signature = base.fromHex(sig);
  const r = signature.slice(0, 32);
  const s = signature.slice(32, 64);
  const msgHash = base.sha256(rawBytes);
  const v = signUtil.secp256k1.getV(Buffer.from(msgHash), base.toHex(r), base.toHex(s), base.fromHex(publicKey));

  const signatureBytes = Buffer.concat([Uint8Array.from(signature), Uint8Array.of(v)]);
  tx.signature.push(signatureBytes);

  const txBytes = protocol.Transaction.encode(tx).finish();
  return base.toHex(txBytes);
}

export function getUnsignedMessage(type: MessageType, message: string, useTronHeader = true): string {
  if (type === "hex") {
    let msg = Buffer.from(base.fromHex(message));
    let header = Buffer.from(useTronHeader ? TRX_MESSAGE_HEADER : ETH_MESSAGE_HEADER);
    let messageBytes = Buffer.concat([header, msg], header.length + msg.length);
    const messageDigest = base.keccak256(messageBytes);
    return base.toHex(messageDigest);
  } else if (type === "legacy") {
    const obj = JSON.parse(message);
    if("txID" in obj) {
      return obj.txID;
    } else {
      throw new Error("message must be hex or transaction object");
    }
  } else if (type === "protobuf") {
    const obj = JSON.parse(message);
    const raw = base.fromHex(obj.raw_data_hex);
    const messageHash = base.sha256(raw);
    return base.toHex(messageHash);
  } else {
    throw new Error("message must be hex or transaction object");
  }
}

export function getMPCSignedMessage(hash: string, sig: string, publicKey: string, type: MessageType, message?: string) {
  const signature = base.fromHex(sig);
  const r = signature.slice(0, 32);
  const s = signature.slice(32, 64);

  if (type === "hex") {
    const v = signUtil.secp256k1.getV(base.fromHex(hash), base.toHex(r), base.toHex(s), base.fromHex(publicKey)) + 27;
    return eth.makeSignature(v, r, s);
  } else if (type === "legacy") {
    const obj = JSON.parse(message!);
    const recovery = signUtil.secp256k1.getV(base.fromHex(hash), base.toHex(r), base.toHex(s), base.fromHex(publicKey), false);
    obj.signature = [base.toHex(Buffer.concat([Uint8Array.from(signature), Uint8Array.of(recovery)]))];
    return JSON.stringify(obj);
  } else if (type === "protobuf") {
    const obj = JSON.parse(message!);
    const raw = base.fromHex(obj.raw_data_hex);
    const rawData = protocol.Transaction.raw.decode(Uint8Array.from(raw));
    const tr = protocol.Transaction.create({
      rawData: rawData,
    });
    const recovery = signUtil.secp256k1.getV(base.fromHex(hash), base.toHex(r), base.toHex(s), base.fromHex(publicKey), true);
    const signatureBytes = Buffer.concat([Uint8Array.from(signature), Uint8Array.of(recovery)]);
    tr.signature.push(signatureBytes);
    const trBytes = protocol.Transaction.encode(tr).finish();
    return base.toHex(trBytes);
  }
}

export function getHardwareTransaction(raw: string, sig: string) {
  const rawBytes = base.fromHex(raw);
  const tx = protocol.Transaction.create({
    rawData: protocol.Transaction.raw.decode(rawBytes)
  });
  tx.signature.push(base.fromHex(sig));
  const txBytes = protocol.Transaction.encode(tx).finish();
  return base.toHex(txBytes);
}

export function validSignedTransaction(tx: string, publicKey?: string) {
  const transaction = protocol.Transaction.decode(base.fromHex(tx))
  const raw = protocol.Transaction.raw.create(transaction.rawData!)
  const rawBytes = protocol.Transaction.raw.encode(raw).finish()
  const message = base.sha256(rawBytes)
  let signature = transaction.signature[0]
  signature = signature.slice(0, signature.length-1)
  if(publicKey && !signUtil.secp256k1.verifyWithNoRecovery(message, signature, base.fromHex(publicKey))) {
    throw Error("signature error")
  }
  return transaction
}

export * from "./TrxWallet"

export type DerivePriKeyParams = {
  mnemonic: string;
  hdPath: string;
};

export type NewAddressParams = {
  privateKey: string; // hex private key
  addressType?: string;
  version?: string;
  hrp?: string;
};

export type NewAddressData = {
  address: string;
  publicKey?: string;
  compressedPublicKey?: string;
};

export type ValidAddressParams = {
  address: string
  addressType?: string
  hrp?: string
}

export type ValidAddressData = {
  isValid: boolean;
  address: string;
};

export type SignTxParams = {
  privateKey: string;
  data: any;
};

export type VerifyMessageParams = {
  signature: string;
  data: any;
  address?: string;
};

export type TypedMessage = {
  type?: number;
  address?: string;
  message: string;
  publicKey?: string;
};

export type ValidPrivateKeyParams = {
  privateKey: string;
};

export type ValidPrivateKeyData = {
  isValid: boolean;
  privateKey: string;
};

export type GetDerivedPathParam = {
  index: number;
  segwitType?: number;
};

export type GetAddressParams = {
  publicKey: string;
  addressType?: string;
  hrp?: string;
};

export type MpcRawTransactionParam = {
  data: any;
};

export type MpcRawTransactionData = {
  raw: string;
  hash: string | string[];
};

export type MpcTransactionParam = {
  raw: string;
  sigs: string | string[];
  publicKey?: string;
};

export type MpcMessageParam = {
  hash: string;
  sigs: string | string[];
  publicKey?: string;
  message?: string;
  type?: string;
};

export type HardwareRawTransactionParam = {
  raw: string;
  pubKey?: string;
  sig?: string;
  s?: string;
  v?: string;
  r?: string;
};

export type CalcTxHashParams = {
  data: any
}

export type GetRawTransactionParams = {
  data: any;
};

export type ValidSignedTransactionParams = {
  tx: string;
  data?: any
};

export enum SignType {
  Secp256k1=1 ,
  ECDSA_P256,
  ED25519,
  StarknetSignType,
  TezosSignType
}

export type SignCommonMsgParams = {
  privateKey: string;
  signType?: SignType;
  message: any;
  addressType?: string;
  version?: string;
  hrp?: string;
};

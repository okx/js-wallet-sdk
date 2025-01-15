export const ZERO = 0n;
export const MASK_250 = 2n ** 250n - 1n; // 2 ** 250 - 1
export const MASK_251 = 2n ** 251n;
export const API_VERSION = ZERO;

export enum NetworkName {
  SN_MAIN = 'SN_MAIN',
  SN_GOERLI = 'SN_GOERLI',
  SN_GOERLI2 = 'SN_GOERLI2',
}

export enum StarknetChainId {
  SN_MAIN = '0x534e5f4d41494e', // encodeShortString('SN_MAIN'),
  SN_GOERLI = '0x534e5f474f45524c49', // encodeShortString('SN_GOERLI'),
  SN_GOERLI2 = '0x534e5f474f45524c4932', // encodeShortString('SN_GOERLI2'),
  SN_SEPOLIA = '0x534e5f5345504f4c4941',
}

export enum TransactionHashPrefix {
  DECLARE = '0x6465636c617265', // encodeShortString('declare'),
  DEPLOY = '0x6465706c6f79', // encodeShortString('deploy'),
  DEPLOY_ACCOUNT = '0x6465706c6f795f6163636f756e74', // encodeShortString('deploy_account'),
  INVOKE = '0x696e766f6b65', // encodeShortString('invoke'),
  L1_HANDLER = '0x6c315f68616e646c6572', // encodeShortString('l1_handler'),
}

export const UDC = {
  ADDRESS: '0x041a78e741e5af2fec34b695679bc6891742439f7afb8484ecd7766661ad02bf',
  ENTRYPOINT: 'deployContract',
};

export const ETH = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
export const ETHBridge = "0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82";
export const ProxyAccountClassHash = "0x3530cc4759d78042f1b543bf797f5f3d647cde0388c33734cf91b7f7b9314a9";
export const accountClassHash = "0x309c042d3729173c7f2f91a34f04d8c509c1b292d334679ef1aabf8da0899cc";
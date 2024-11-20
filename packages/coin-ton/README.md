# @okxweb3/coin-ton

TON SDK is used to interact with the TON/Venom blockchain, it contains various functions can be used to web3 wallet.

## Installation

### Npm

To obtain the latest version, simply require the project using npm :

```shell
npm install @okxweb3/coin-ton
```

## Usage

### TON

#### Generate address

```typescript
import {TonWallet} from "@okxweb3/coin-ton";

const wallet = new TonWallet();
const param = {
    privateKey: "4789815d45fcf0a79083b0adaec3b5f0d02e948056c1cfde174327c3ee93ed35"
};
const address = await wallet.getNewAddress(param);
```


#### Derive seed

If you choose the bip39 mnemonic, you need to fill in hdPath.Otherwise, if it is ton mnemonic, you do not need to fill in the derived path.

```typescript
import {TonWallet} from "@okxweb3/coin-ton";

const wallet = new TonWallet();

const seed = await wallet.getDerivedPrivateKey({
    // bip39 mnemonic or ton official mnemonic
    mnemonic: "muscle chest cereal often muscle right melt depend deny insect taste hungry expire feel cream grow aerobic build all patrol cloud garden fly emerge",
    // hdPath: "m/44'/607'/0'", // for bip39 mnemonic
    hdPath: "", // for ton official mnemonic
});
expect(seed).toBe("4789815d45fcf0a79083b0adaec3b5f0d02e948056c1cfde174327c3ee93ed35");

```

#### Verify address

```typescript
import {TonWallet} from "@okxweb3/coin-ton";

const wallet = new TonWallet();
const param = {
    address: "EQA3_JIJKDC0qauDUEQe2KjQj1iLwQRtrEREzmfDxbCKw9Kr"
};
const isValid = await wallet.validAddress(param);
```

#### Validate mnemonic of Ton

```typescript
import {TonWallet} from "@okxweb3/coin-ton";

const wallet = new TonWallet();

const validateMnemonicOfTon = await wallet.validateMnemonicOfTon({
    mnemonicArray: "blade diet curious room evil acoustic check perfect length slot cage waste".split(' '),
    password: ''
});
expect(validateMnemonicOfTon).toBe(false);
```

#### Transfer TON

```typescript
import {TonWallet} from "@okxweb3/coin-ton";

const wallet = new TonWallet();
const param = {
    privateKey: "4789815d45fcf0a79083b0adaec3b5f0d02e948056c1cfde174327c3ee93ed35",
    data: {
        to: "EQA3_JIJKDC0qauDUEQe2KjQj1iLwQRtrEREzmfDxbCKw9Kr",
        amount: "10000000",
        seqno: 2,
        toIsInit: true,
        memo: "",
    },
};
const tx = await wallet.signTransaction(param);
```

#### Transfer Jetton token

```typescript
import {TonWallet} from "@okxweb3/coin-ton";

const wallet = new TonWallet();

const param = {
    privateKey: "4789815d45fcf0a79083b0adaec3b5f0d02e948056c1cfde174327c3ee93ed35",
    data: {
        type: "jettonTransfer", // type of jetton TOKEN transfer
        // jetton wallet address of from address
        fromJettonAccount: "kQDL9sseMzrh4vewfQgZKJzVwDFbDTpbs2f8BY6iCMgRTyOG",
        to: "UQDXgyxgYKNSdTiJBqmNNfbD7xuRMl6skrBmsEtyXslFm5an",
        seqno: 15, // nonce or sequence of from address
        toIsInit: false, // destination address init or not
        memo: "jetton test", // comment for this tx
        decimal: 2, // decimal of jetton TOKEN on ton blockchain
        amount: "100", // decimal of TOKEN is 2 on ton blockchain, so that here real value is 1
        messageAttachedTons: "50000000", // message fee, default 0.05, here is 0.05 * 10^9
        invokeNotificationFee: "1", // notify fee, official recommend 0.000000001, here is 0.000000001 * 10^9
        expireAt: timeoutAtSeconds, // timeout at seconds eg, 1718863283n, default now + 60s
        /**
         * export enum SendMode {
         *     CARRY_ALL_REMAINING_BALANCE = 128,
         *     CARRY_ALL_REMAINING_INCOMING_VALUE = 64,
         *     DESTROY_ACCOUNT_IF_ZERO = 32,
         *     PAY_GAS_SEPARATELY = 1,
         *     IGNORE_ERRORS = 2,
         *     NONE = 0
         * }
         */
        sendMode: 1,
        queryId: "18446744073709551615" // string of uint64 number, eg 18446744073709551615 = 2^64 - 1
    },
};
const tx = await wallet.signTransaction(param);
```

#### Get transaction body for simulate

```typescript
import {TonWallet} from "@okxweb3/coin-ton";

const wallet = new TonWallet();

const param = {
    privateKey: "4789815d45fcf0a79083b0adaec3b5f0d02e948056c1cfde174327c3ee93ed35",
    data: {
        type: "transfer", // type of TON transfer
        to: "EQA3_JIJKDC0qauDUEQe2KjQj1iLwQRtrEREzmfDxbCKw9Kr", // destination address
        decimal: 9, // decimal on ton blockchain
        amount: "10000000",
        seqno: 14, // nonce or sequence of from address
        toIsInit: true, // destination address init or not
        memo: "ton test", // comment for this tx
        expireAt: 1718863283n/*timeoutAtSeconds*/, // timeout at seconds eg, 1718863283n, default now + 60s
        /**
         * export enum SendMode {
         *     CARRY_ALL_REMAINING_BALANCE = 128,
         *     CARRY_ALL_REMAINING_INCOMING_VALUE = 64,
         *     DESTROY_ACCOUNT_IF_ZERO = 32,
         *     PAY_GAS_SEPARATELY = 1,
         *     IGNORE_ERRORS = 2,
         *     NONE = 0
         * }
         */
        sendMode: 1,
        publicKey: "54f82165d36ab01a252e2a4ea69352ae5ff4ff263e568a46beb794cabf0cb9f4", // public key needed if no private key
    },
};
const body = await wallet.getTransactionBodyForSimulate(param);
const expected = "te6cckEBAgEAkgABnGGGiWsDbhR1aWGsKNzV6pUGgf1WiTneQJcxyGb5rjLgVQkc4ATUyXsUar0oa6zJjIrxFhMZJlmbjWGICV5+AQQpqaMXZnPFswAAAA4AAQEAfkIAG/5JBJQYWlTVwagiD2xUaEesReCCNtYiImcz4eLYRWGcxLQAAAAAAAAAAAAAAAAAAAAAAAB0b24gdGVzdBTnQls=";
expect(body).toBe(expected);
```

#### Get wallet info,such as  initData, initCode or walletStateInit for estimating fee

```typescript
import {TonWallet} from "@okxweb3/coin-ton";

const wallet = new TonWallet();

const param = {
    workChain: 0, // mainnet
    privateKey: "4789815d45fcf0a79083b0adaec3b5f0d02e948056c1cfde174327c3ee93ed35",
    publicKey: "",
    walletVersion: "v4r2" // version of wallet, default v4r2
};
const walletInfo = await wallet.getWalletInformation(param);
const expected = {
    "initData": "te6cckEBAQEAKwAAUQAAAAApqaMXVPghZdNqsBolLipOppNSrl/0/yY+VopGvreUyr8MufRAc1cSdg==",
    "walletAddress": "UQDLXrWjVfOnob2tHvCchfh1XVw9rD8RhiCLgxJrlkBNoYS7",
    "initCode": "te6cckECFAEAAtQAART/APSkE/S88sgLAQIBIAIPAgFIAwYC5tAB0NMDIXGwkl8E4CLXScEgkl8E4ALTHyGCEHBsdWe9IoIQZHN0cr2wkl8F4AP6QDAg+kQByMoHy//J0O1E0IEBQNch9AQwXIEBCPQKb6Exs5JfB+AF0z/IJYIQcGx1Z7qSODDjDQOCEGRzdHK6kl8G4w0EBQB4AfoA9AQw+CdvIjBQCqEhvvLgUIIQcGx1Z4MesXCAGFAEywUmzxZY+gIZ9ADLaRfLH1Jgyz8gyYBA+wAGAIpQBIEBCPRZMO1E0IEBQNcgyAHPFvQAye1UAXKwjiOCEGRzdHKDHrFwgBhQBcsFUAPPFiP6AhPLassfyz/JgED7AJJfA+ICASAHDgIBIAgNAgFYCQoAPbKd+1E0IEBQNch9AQwAsjKB8v/ydABgQEI9ApvoTGACASALDAAZrc52omhAIGuQ64X/wAAZrx32omhAEGuQ64WPwAARuMl+1E0NcLH4AFm9JCtvaiaECAoGuQ+gIYRw1AgIR6STfSmRDOaQPp/5g3gSgBt4EBSJhxWfMYQE+PKDCNcYINMf0x/THwL4I7vyZO1E0NMf0x/T//QE0VFDuvKhUVG68qIF+QFUEGT5EPKj+AAkpMjLH1JAyx9SMMv/UhD0AMntVPgPAdMHIcAAn2xRkyDXSpbTB9QC+wDoMOAhwAHjACHAAuMAAcADkTDjDQOkyMsfEssfy/8QERITAG7SB/oA1NQi+QAFyMoHFcv/ydB3dIAYyMsFywIizxZQBfoCFMtrEszMyXP7AMhAFIEBCPRR8qcCAHCBAQjXGPoA0z/IVCBHgQEI9FHyp4IQbm90ZXB0gBjIywXLAlAGzxZQBPoCFMtqEssfyz/Jc/sAAgBsgQEI1xj6ANM/MFIkgQEI9Fnyp4IQZHN0cnB0gBjIywXLAlAFzxZQA/oCE8tqyx8Syz/Jc/sAAAr0AMntVAj45Sg=",
    "walletStateInit": "te6cckECFgEAAwQAAgE0ARUBFP8A9KQT9LzyyAsCAgEgAxACAUgEBwLm0AHQ0wMhcbCSXwTgItdJwSCSXwTgAtMfIYIQcGx1Z70ighBkc3RyvbCSXwXgA/pAMCD6RAHIygfL/8nQ7UTQgQFA1yH0BDBcgQEI9ApvoTGzkl8H4AXTP8glghBwbHVnupI4MOMNA4IQZHN0crqSXwbjDQUGAHgB+gD0BDD4J28iMFAKoSG+8uBQghBwbHVngx6xcIAYUATLBSbPFlj6Ahn0AMtpF8sfUmDLPyDJgED7AAYAilAEgQEI9Fkw7UTQgQFA1yDIAc8W9ADJ7VQBcrCOI4IQZHN0coMesXCAGFAFywVQA88WI/oCE8tqyx/LP8mAQPsAkl8D4gIBIAgPAgEgCQ4CAVgKCwA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIAwNABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AABG4yX7UTQ1wsfgAWb0kK29qJoQICga5D6AhhHDUCAhHpJN9KZEM5pA+n/mDeBKAG3gQFImHFZ8xhAT48oMI1xgg0x/TH9MfAvgju/Jk7UTQ0x/TH9P/9ATRUUO68qFRUbryogX5AVQQZPkQ8qP4ACSkyMsfUkDLH1Iwy/9SEPQAye1U+A8B0wchwACfbFGTINdKltMH1AL7AOgw4CHAAeMAIcAC4wABwAORMOMNA6TIyx8Syx/L/xESExQAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJc/sAyEAUgQEI9FHypwIAcIEBCNcY+gDTP8hUIEeBAQj0UfKnghBub3RlcHSAGMjLBcsCUAbPFlAE+gIUy2oSyx/LP8lz+wACAGyBAQjXGPoA0z8wUiSBAQj0WfKnghBkc3RycHSAGMjLBcsCUAXPFlAD+gITy2rLHxLLP8lz+wAACvQAye1UAFEAAAAAKamjF1T4IWXTarAaJS4qTqaTUq5f9P8mPlaKRr63lMq/DLn0QLGJOi0=",
}
expect(walletInfo).toEqual(expected);
```

#### Sign proof

```typescript
import {TonWallet} from "@okxweb3/coin-ton";

const wallet = new TonWallet();

const param = {
    privateKey: "4789815d45fcf0a79083b0adaec3b5f0d02e948056c1cfde174327c3ee93ed35",
    walletAddress: "EQA3_JIJKDC0qauDUEQe2KjQj1iLwQRtrEREzmfDxbCKw9Kr",
    tonProofItem: "ton-proof-item-v2/",
    messageAction: "ton-connect",
    messageSalt: "ffff",
    proof: {
        timestamp: 1719309177, // your deadline timestamp 
        domain: "ton.org.com", // your domain
        payload: "123", // your data
    },
}
const messageHash = await wallet.signTonProof(param);
expect(messageHash).toBe("V6b0wb2YyrCcYhbHGmfF1qHwFx1HgPxC4HF5dJ8wrYKUHoXPfvBc3EDJcsAv6on9FXi4oWfvWWjlRNYnhNbFDg==");
```

#### Calc tx hash

```typescript
import {TonWallet} from "@okxweb3/coin-ton";

const wallet = new TonWallet();


const param = {
    data: "te6cckECBAEAARIAAeGIAYlhKogJET0rm+rLlfY0aczCGg5/zakLEHs5hkk2pIbUAShC3ZvFZPuxndFImUSjvgQR9L1RDS4ZeBioM66enEURWPqGElGG9bGj2cB5KiWeilKRIewkerr43RalHk7wOBFNTRi7M9OXWAAAAGAADAEBaEIAZftljxmdcPF72D6EDJROauAYrYadLdmz/gLHUQRkCKegF9eEAAAAAAAAAAAAAAAAAAECAaYPin6lAAAAAAAAAAAicQgBrwZYwMFGpOpxEg1TGmvth943ImS9WSVgzWCW5L2SizcAMSwlUQEiJ6VzfVlyvsaNOZhDQc/5tSFiD2cwySbUkNqCAwMAHgAAAABqZXR0b24gdGVzdBhpB+M=",
}
const messageHash = await wallet.calcTxHash(param);
expect(messageHash).toBe("2270cac96399e182d3d31688cc0a2d3676631e31a79dd2247aa6a1162ff3db0b");
```

#### Sign multi-transaction

```typescript
import {TonWallet} from "@okxweb3/coin-ton";

const wallet = new TonWallet();

const param = {
    privateKey: "4789815d45fcf0a79083b0adaec3b5f0d02e948056c1cfde174327c3ee93ed35",
    data: {
        messages: [{
            address: "EQA3_JIJKDC0qauDUEQe2KjQj1iLwQRtrEREzmfDxbCKw9Kr",
            amount: "100000000",
            payload: "", // payload
            stateInit: 'te6cckECFgEAAwQAAgE0ARUBFP8A9KQT9LzyyAsCAgEgAxACAUgEBwLm0AHQ0wMhcbCSXwTgItdJwSCSXwTgAtMfIYIQcGx1Z70ighBkc3RyvbCSXwXgA/pAMCD6RAHIygfL/8nQ7UTQgQFA1yH0BDBcgQEI9ApvoTGzkl8H4AXTP8glghBwbHVnupI4MOMNA4IQZHN0crqSXwbjDQUGAHgB+gD0BDD4J28iMFAKoSG+8uBQghBwbHVngx6xcIAYUATLBSbPFlj6Ahn0AMtpF8sfUmDLPyDJgED7AAYAilAEgQEI9Fkw7UTQgQFA1yDIAc8W9ADJ7VQBcrCOI4IQZHN0coMesXCAGFAFywVQA88WI/oCE8tqyx/LP8mAQPsAkl8D4gIBIAgPAgEgCQ4CAVgKCwA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIAwNABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AABG4yX7UTQ1wsfgAWb0kK29qJoQICga5D6AhhHDUCAhHpJN9KZEM5pA+n/mDeBKAG3gQFImHFZ8xhAT48oMI1xgg0x/TH9MfAvgju/Jk7UTQ0x/TH9P/9ATRUUO68qFRUbryogX5AVQQZPkQ8qP4ACSkyMsfUkDLH1Iwy/9SEPQAye1U+A8B0wchwACfbFGTINdKltMH1AL7AOgw4CHAAeMAIcAC4wABwAORMOMNA6TIyx8Syx/L/xESExQAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJc/sAyEAUgQEI9FHypwIAcIEBCNcY+gDTP8hUIEeBAQj0UfKnghBub3RlcHSAGMjLBcsCUAbPFlAE+gIUy2oSyx/LP8lz+wACAGyBAQjXGPoA0z8wUiSBAQj0WfKnghBkc3RycHSAGMjLBcsCUAXPFlAD+gITy2rLHxLLP8lz+wAACvQAye1UAFEAAAAAKamjFxPhbQc75H/FJ8sz1fe06yzTrMQfrE9fxKS/t1aneB9oQMb69Ik=', //base64
            isBase64Payload: false,
        }, {
            address: "EQA3_JIJKDC0qauDUEQe2KjQj1iLwQRtrEREzmfDxbCKw9Kr",
            amount: "100000000",
            payload: "this is a memo",
            stateInit: "", //base64
            isBase64Payload: false,
        }, {// mint NFT item
            address: "EQDF0cVEVw917PZVNtKdyCYjiyoeIIHCngS7Dat-PtDLcKQV",
            amount: "50000000",
            payload: "te6ccsEBAwEATgAAHEEBMQAAAAEAAAAAAAAAAAAAAAAAAAAAQC+vCAgBAUOAGJYSqICRE9K5vqy5X2NGnMwhoOf82pCxB7OYZJNqSG1QAgAWbXlfbmZ0Lmpzb25Yc7tj",
            stateInit: "", //base64
            isBase64Payload: true,
        }],
        seqno: 20, // nonce or sequence of from address
        valid_until: "1729924412000", // timeout at milliseconds eg, 1718869081781n or seconds 1718869081n
        network: "mainnet", // default mainnet 0, other 1
    },
};
const {transaction} = await wallet.signMultiTransaction(param);
const expected = "te6cckECGwEABH4AA+WIAZa9a0ar509De1o94TkL8Oq6uHtYfiMMQRcGJNcsgJtCBXAaU/gBVFk8aKoE18uko3TwZRCiTwNv+OX/JggXp5EktlJgytb8MsT9G8pHhoZA48piD9UW9ruHAQMy01km6ClNTRi7OORp4AAAAKAAGBgcARcYAnFiABv+SQSUGFpU1cGoIg9sVGhHrEXggjbWIiJnM+Hi2EVhoC+vCAAAAAAAAAAAAAAAAAACMAAAAAICFgEU/wD0pBP0vPLICwMCASAEEQIBSAUIAubQAdDTAyFxsJJfBOAi10nBIJJfBOAC0x8hghBwbHVnvSKCEGRzdHK9sJJfBeAD+kAwIPpEAcjKB8v/ydDtRNCBAUDXIfQEMFyBAQj0Cm+hMbOSXwfgBdM/yCWCEHBsdWe6kjgw4w0DghBkc3RyupJfBuMNBgcAeAH6APQEMPgnbyIwUAqhIb7y4FCCEHBsdWeDHrFwgBhQBMsFJs8WWPoCGfQAy2kXyx9SYMs/IMmAQPsABgCKUASBAQj0WTDtRNCBAUDXIMgBzxb0AMntVAFysI4jghBkc3Rygx6xcIAYUAXLBVADzxYj+gITy2rLH8s/yYBA+wCSXwPiAgEgCRACASAKDwIBWAsMAD2ynftRNCBAUDXIfQEMALIygfL/8nQAYEBCPQKb6ExgAgEgDQ4AGa3OdqJoQCBrkOuF/8AAGa8d9qJoQBBrkOuFj8AAEbjJftRNDXCx+ABZvSQrb2omhAgKBrkPoCGEcNQICEekk30pkQzmkD6f+YN4EoAbeBAUiYcVnzGEBPjygwjXGCDTH9Mf0x8C+CO78mTtRNDTH9Mf0//0BNFRQ7ryoVFRuvKiBfkBVBBk+RDyo/gAJKTIyx9SQMsfUjDL/1IQ9ADJ7VT4DwHTByHAAJ9sUZMg10qW0wfUAvsA6DDgIcAB4wAhwALjAAHAA5Ew4w0DpMjLHxLLH8v/EhMUFQBu0gf6ANTUIvkABcjKBxXL/8nQd3SAGMjLBcsCIs8WUAX6AhTLaxLMzMlz+wDIQBSBAQj0UfKnAgBwgQEI1xj6ANM/yFQgR4EBCPRR8qeCEG5vdGVwdIAYyMsFywJQBs8WUAT6AhTLahLLH8s/yXP7AAIAbIEBCNcY+gDTPzBSJIEBCPRZ8qeCEGRzdHJwdIAYyMsFywJQBc8WUAP6AhPLassfEss/yXP7AAAK9ADJ7VQAUQAAAAApqaMXE+FtBzvkf8UnyzPV97TrLNOsxB+sT1/EpL+3Vqd4H2hAAIxiABv+SQSUGFpU1cGoIg9sVGhHrEXggjbWIiJnM+Hi2EVhoC+vCAAAAAAAAAAAAAAAAAAAAAAAAHRoaXMgaXMgYSBtZW1vAZliAGLo4qIrh7r2eyqbaU7kExHFlQ8QQOFPAl2G1b8faGW4IBfXhAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAABAL68ICBkBQ4AYlhKogJET0rm+rLlfY0aczCGg5/zakLEHs5hkk2pIbVAaABZteV9uZnQuanNvbouLMY0="
expect(transaction).toBe(expected);
```

### Venom

#### Generate address

```typescript
import {VenomWallet} from "@okxweb3/coin-ton";

const wallet = new VenomWallet();
const param = {
    privateKey: "4789815d45fcf0a79083b0adaec3b5f0d02e948056c1cfde174327c3ee93ed35"
};
const address = await wallet.getNewAddress(param);
```

#### Verify address

```typescript
import {VenomWallet} from "@okxweb3/coin-ton";

const wallet = new VenomWallet();
const param = {
    address: "0:6bef7d76e46fd1f308f0bf0b59f1ca6318aa6d950ea00aecc7d162218acaaa36"
};
const isValid = await wallet.validAddress(param);
```

#### Transfer Venom

```typescript
import {VenomWallet} from "@okxweb3/coin-ton";

const wallet = new VenomWallet();
const param = {
    privateKey: "4789815d45fcf0a79083b0adaec3b5f0d02e948056c1cfde174327c3ee93ed35",
    data: {
        to: "0:6bef7d76e46fd1f308f0bf0b59f1ca6318aa6d950ea00aecc7d162218acaaa36",
        amount: "10000000",
        seqno: 2,
        toIsInit: true,
        memo: "",
        globalId: 1000,
    },
};
const tx = await wallet.signTransaction(param);
```

## License

Most packages or folder are [MIT](<https://github.com/okx/js-wallet-sdk/blob/main/LICENSE>) licensed, see package or
folder for the respective license.

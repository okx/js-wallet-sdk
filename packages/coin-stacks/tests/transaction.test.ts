import {deserializeTransaction, SignedContractCallOptions, StacksTransaction} from '../src/transactions';

import {
  createMultiSigSpendingCondition,
  createSingleSigSpendingCondition,
  createSponsoredAuth,
  createStandardAuth,
  MultiSigSpendingCondition,
  SingleSigSpendingCondition,
  SponsoredAuthorization,
} from '../src/transactions/authorization';

import {
  CoinbasePayloadToAltRecipient,
  createTokenTransferPayload,
  TokenTransferPayload,
} from '../src/transactions/payload';

import { createSTXPostCondition } from '../src/transactions/postcondition';

import { createStandardPrincipal, STXPostCondition } from '../src/transactions/postcondition-types';
import { createLPList } from '../src/transactions/types';

import {
  AddressHashMode,
  AnchorMode,
  AuthType,
  DEFAULT_CHAIN_ID,
  FungibleConditionCode,
  PostConditionMode,
  TransactionVersion,
} from '../src/transactions/constants';

import { createStacksPrivateKey, pubKeyfromPrivKey, publicKeyToString } from '../src/transactions/keys';

import { TransactionSigner } from '../src/transactions/signer';

import { bytesToHex, hexToBytes } from '../src/common';

import { BytesReader } from '../src/transactions/bytesReader';
import { contractPrincipalCV, standardPrincipalCV } from '../src/transactions/clarity';
import {getPublicKey} from "../src/transactions/";

import {
  ContractDeployTx,
  GenerateUnsignedContractCallTxArgs, GenerateUnsignedContractDeployTxArgs,
  getAllowContractCallerPayload, getContractCallPayload,
  getDelegateStxPayload, getDeployPayload, getRevokeDelegateStxPayload,
  getTokenTransferPayload,
  getTransferPayload, makeContractCallTx,
  transfer
} from "../src/transaction";
import Assert from 'assert';

describe('Transaction', () => {

  test('STX transfer', () => {
    const secretKey = '33c4ad314d494632a36c27f9ac819e8d2986c0e26ad63052879f631a417c8adf01';
    const to = 'SP2P58SJY1XH6GX4W3YGEPZ2058DD3JHBPJ8W843Q';
    const amount = 3000;
    const memo = '20';
    const nonce = 8;
    const fee = 200;
    const anchorMode = AnchorMode.Any;

    const result= transfer(secretKey,to,amount,memo,nonce,fee,anchorMode)
    const excpected='000000000104005c93ea5f0b33e5396a80d9e504c4414425d24f75000000000000000800000000000000c80001fcca89829a1599393a22269273edfcf4db504415c3076fc4994420dad95dde705cd3e3fb9ee01778d786408ca7a2c946eb274c97c0895e7526088e09b4e8d023030200000000000516ac54665e0f6268749c1fa0eb7c402a1ad1ca2bb40000000000000bb832300000000000000000000000000000000000000000000000000000000000000000'
    console.log(result)
    Assert.strictEqual(result.txSerializedHexString,excpected)
  });

  test('STX token transfer transaction serialization and deserialization', () => {
    const transactionVersion = TransactionVersion.Mainnet;
    const chainId = DEFAULT_CHAIN_ID;

    const anchorMode = AnchorMode.Any;
    const postConditionMode = PostConditionMode.Deny;

    const address = 'SP2P58SJY1XH6GX4W3YGEPZ2058DD3JHBPJ8W843Q';
    const recipient = createStandardPrincipal(address);
    const recipientCV = standardPrincipalCV(address);
    const amount = 21;
    const memo = '110317';

    const payload = createTokenTransferPayload(recipientCV, amount, memo);

    const addressHashMode = AddressHashMode.SerializeP2PKH;
    const nonce = 8;
    const fee = 200;
    const secretKey = '33c4ad314d494632a36c27f9ac819e8d2986c0e26ad63052879f631a417c8adf';
    const privateKey = createStacksPrivateKey(secretKey)
    const pubKey =  bytesToHex(getPublicKey(privateKey).data);

    const spendingCondition = createSingleSigSpendingCondition(addressHashMode, pubKey, nonce, fee);
    const authType = AuthType.Standard;
    const authorization = createStandardAuth(spendingCondition);

    const postCondition = createSTXPostCondition(recipient, FungibleConditionCode.GreaterEqual, 0);

    const postConditions = createLPList([postCondition]);
    const transaction = new StacksTransaction(
        transactionVersion,
        authorization,
        payload,
        postConditions
    );

    const signer = new TransactionSigner(transaction);
    signer.signOrigin(createStacksPrivateKey(secretKey));
    // const signature =
    //   '01051521ac2ac6e6123dcaf9dba000e0005d9855bcc1bc6b96aaf8b6a385238a2317' +
    //   'ab21e489aca47af3288cdaebd358b0458a9159cadc314cecb7dd08043c0a6d';

    transaction.verifyOrigin();

    const serialized = transaction.serialize();
    const serializedHexString = bytesToHex(serialized);
    console.log(serializedHexString)
    // 00000000010400bbe5d1146974507154ba0ce446784156a74d6e65000000000000000800000000000000c801018e299db16c80a08e5c8ea53ed76fb6cd3c843c52d5f8415cc2b930a1ebfa81ee32c72b55394f7bf4d1f8d1e5a0bd3729223a2e9a5922fa55ce36f2246cd8159f030200000000000516ac54665e0f6268749c1fa0eb7c402a1ad1ca2bb40000000000000bb832300000000000000000000000000000000000000000000000000000000000000000
  });

  test('contractCall-allowContractCaller', async ()=> {
    const fee = 3000;
    const nonce = 57;
    const senderKey = "33c4ad314d494632a36c27f9ac819e8d2986c0e26ad63052879f631a417c8adf";
    const param: GenerateUnsignedContractCallTxArgs = {
      txData: {
        anchorMode: 3,
        contractAddress: "SP000000000000000000002Q6VF78",
        contractName: 'pox-3',
        functionArgs:     [
          '061683ed66860315e334010bbfb76eb3eef887efee0a10706f782d666173742d706f6f6c2d7632',
          '0a0100000000000000000000000000032708'
        ],
        functionName: 'allow-contract-caller',
        // postConditionMode: 2,
        postConditions: [],
      },
      fee: fee,
      nonce: nonce
    }
    const tx =await makeContractCallTx(param,senderKey)
    console.log(tx)
    Assert.strictEqual(tx.txSerializedHexString, "00000000010400bbe5d1146974507154ba0ce446784156a74d6e6500000000000000390000000000000bb801016e5a1e9a70c4a1033eee7d7a6102475006fec8c44a976e7ed024dc6b8ea491c32ed9a9f516eaa6e54e88dc2d630c6a67b10fe2ce9c35455a9a11e9c039c531770302000000000216000000000000000000000000000000000000000005706f782d3315616c6c6f772d636f6e74726163742d63616c6c657200000002061683ed66860315e334010bbfb76eb3eef887efee0a10706f782d666173742d706f6f6c2d76320a0100000000000000000000000000032708")
    Assert.strictEqual(tx.txId, "0x64f7d7597becbcc008f9ecef665c2dd9b875db8a0cb40d0fc220c8c9067a19a6");
  })

  test('contractCall-delegateStx', async ()=> {
    const fee = 3000;
    const nonce = 58;
    const senderKey = "33c4ad314d494632a36c27f9ac819e8d2986c0e26ad63052879f631a417c8adf";
    const param: GenerateUnsignedContractCallTxArgs = {
      txData: {
        anchorMode: 3,
        contractAddress: "SP000000000000000000002Q6VF78",
        contractName: 'pox-3',
        functionArgs: [
          '010000000000000000000000174876e800',
          '0516f4d9fbd8d79ee18aa14910440d1c7484587480f8',
          '0a01000000000000000000000000000007d0',
          '0a0c00000002096861736862797465730200000014352481ec2fecfde0c5cdc635a383c4ac27b9f71e0776657273696f6e020000000101'
        ],
        functionName: 'delegate-stx',
        // postConditionMode: 2,
        postConditions: [],
      },
      fee: fee,
      nonce: nonce
    }
    const tx =await makeContractCallTx(param,senderKey)
    console.log(tx)
    Assert.strictEqual(tx.txSerializedHexString, "00000000010400bbe5d1146974507154ba0ce446784156a74d6e65000000000000003a0000000000000bb801017383d46342c658e9647660e389d10b5ff3b42ef74d5cc6a6caeaee59502386f82944702340fc08adb9a3c8ddd61ff6803f7918bdfca3f7dec9d2458ae8d9dc0e0302000000000216000000000000000000000000000000000000000005706f782d330c64656c65676174652d73747800000004010000000000000000000000174876e8000516f4d9fbd8d79ee18aa14910440d1c7484587480f80a01000000000000000000000000000007d00a0c00000002096861736862797465730200000014352481ec2fecfde0c5cdc635a383c4ac27b9f71e0776657273696f6e020000000101")
    Assert.strictEqual(tx.txId, "0xcba9cb0d0367697fec1d9ed2b597331464b1b0ee68766c7a4c6cf1e88eceae40");
  })

  test('deployContracty' , async ()=> {
    const contractName = 'kv-store';
    const codeBody = "(define-map store ((key (buff 32))) ((value (buff 32))))\n" +
        "\n" +
        "(define-public (get-value (key (buff 32)))\n" +
        "    (match (map-get? store ((key key)))\n" +
        "        entry (ok (get value entry))\n" +
        "        (err 0)))\n" +
        "\n" +
        "(define-public (set-value (key (buff 32)) (value (buff 32)))\n" +
        "    (begin\n" +
        "        (map-set store ((key key)) ((value value)))\n" +
        "        (ok 'true)))\n";
    const senderKey = 'e494f188c2d35887531ba474c433b1e41fadd8eb824aca983447fd4bb8b277a801';
    const fee = 0;
    const nonce = 0;

    const param: GenerateUnsignedContractDeployTxArgs = {
      txData: {
        contractName: contractName,
        codeBody: codeBody,
        anchorMode: 3,
        postConditionMode: undefined,
        postConditions: [],
        sponsored: false,
      },
      fee,nonce
    }
    const transaction = await ContractDeployTx(param,senderKey);
    console.log(transaction)
    expect(transaction.txSerializedHexString).toEqual("00000000010400e6c05355e0c990ffad19a5e9bda394a9c50034290000000000000000000000000000000000016c13fe3d8715f2179c694c7d75969f54388f6efbc28b1fcaab6c6c68a35b011722e73ae8324b2b6a0a92860076def5abfa4be2d0baa53b6cf9e16df105738dd80302000000000602086b762d73746f72650000015628646566696e652d6d61702073746f72652028286b657920286275666620333229292920282876616c7565202862756666203332292929290a0a28646566696e652d7075626c696320286765742d76616c756520286b65792028627566662033322929290a20202020286d6174636820286d61702d6765743f2073746f72652028286b6579206b65792929290a2020202020202020656e74727920286f6b20286765742076616c756520656e74727929290a20202020202020202865727220302929290a0a28646566696e652d7075626c696320287365742d76616c756520286b65792028627566662033322929202876616c75652028627566662033322929290a2020202028626567696e0a2020202020202020286d61702d7365742073746f72652028286b6579206b6579292920282876616c75652076616c75652929290a2020202020202020286f6b2027747275652929290a")
  })
});

describe("Get Payload",()=> {
  test('getTransferPayload', ()=> {
    const payload = getTransferPayload("SP2P58SJY1XH6GX4W3YGEPZ2058DD3JHBPJ8W843Q",3000,"20");
    console.log(payload)
    expect(payload).toEqual("000516ac54665e0f6268749c1fa0eb7c402a1ad1ca2bb40000000000000bb832300000000000000000000000000000000000000000000000000000000000000000")
  })

  test('getTokenTransferPayload', ()=> {
    const from = "SP2XYBM8MD5T50WAMQ86E8HKR85BAEKBECNE1HHVY";
    const to = "SP3HXJJMJQ06GNAZ8XWDN1QM48JEDC6PP6W3YZPZJ";
    const memo = "110317";
    const contract = "SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27";
    const contract_name = "miamicoin-token";
    const function_name = "transfer";
    const amount = 21;

    const payload = getTokenTransferPayload(from, to, memo, amount, contract, contract_name, function_name);
    console.log(payload)
    expect(payload).toEqual("021608633eac058f2e6ab41613a0a537c7ea1a79cdd20f6d69616d69636f696e2d746f6b656e087472616e736665720000000401000000000000000000000000000000150516bbe5d1146974507154ba0ce446784156a74d6e650516e3d94a92b80d0aabe8ef1b50de84449cd61ad6370a0200000006313130333137")
  })

  test('getAllowContractCallerPayload',()=> {
    const contract = "SP000000000000000000002Q6VF78";
    const contractName = 'pox-3';
    const functionName = 'allow-contract-caller';
    const caller = 'SP21YTSM60CAY6D011EZVEVNKXVW8FVZE198XEFFP.pox-fast-pool-v2';
    const untilBurnBlockHeight = 206600;

    const payload = getAllowContractCallerPayload(caller, contract,contractName,functionName,untilBurnBlockHeight);
    console.log(payload)
    expect(payload).toEqual("0216000000000000000000000000000000000000000005706f782d3315616c6c6f772d636f6e74726163742d63616c6c657200000002061683ed66860315e334010bbfb76eb3eef887efee0a10706f782d666173742d706f6f6c2d76320a0100000000000000000000000000032708")
  })

  test('getDelegateStxPayload',()=> {
    const contract = "SP000000000000000000002Q6VF78";
    const contractName = 'pox-3';
    const functionName = 'delegate-stx';
    const delegateTo = 'SP3TDKYYRTYFE32N19484838WEJ25GX40Z24GECPZ';
    const poxAddress = '36Y1UJBWGGreKCKNYQPVPr41rgG2sQF7SC';
    const amountMicroStx = 100000000000;
    const untilBurnBlockHeight= 2000;

    const payload = getDelegateStxPayload(contract,contractName,functionName,delegateTo,poxAddress,amountMicroStx,untilBurnBlockHeight);
    console.log(payload)
    expect(payload).toEqual("0216000000000000000000000000000000000000000005706f782d330c64656c65676174652d73747800000004010000000000000000000000174876e8000516f4d9fbd8d79ee18aa14910440d1c7484587480f80a01000000000000000000000000000007d00a0c00000002096861736862797465730200000014352481ec2fecfde0c5cdc635a383c4ac27b9f71e0776657273696f6e020000000101")

  })

  test('getRevokeDelegateStxPayload',()=> {
    const contract = "SP000000000000000000002Q6VF78";
    const contractName = 'pox-3';
    const functionName = 'revoke-delegate-stx';

    const payload = getRevokeDelegateStxPayload(contract,contractName,functionName);
    console.log(payload)
    expect(payload).toEqual("0216000000000000000000000000000000000000000005706f782d33137265766f6b652d64656c65676174652d73747800000000")
  })

  test('getContractCallPayload', () => {
    const contractAddress= "SP000000000000000000002Q6VF78";
    const contractName = 'pox-3';
    const functionName = 'delegate-stx';
    const functionArgs = [
      '0x010000000000000000000000174876e800',
      '0516f4d9fbd8d79ee18aa14910440d1c7484587480f8',
      '0a01000000000000000000000000000007d0',
      '0a0c00000002096861736862797465730200000014352481ec2fecfde0c5cdc635a383c4ac27b9f71e0776657273696f6e020000000101'
    ];
    const payload = getContractCallPayload(contractAddress,contractName,functionName,functionArgs);
    console.log(payload)
    expect(payload).toEqual("0216000000000000000000000000000000000000000005706f782d330c64656c65676174652d73747800000004010000000000000000000000174876e8000516f4d9fbd8d79ee18aa14910440d1c7484587480f80a01000000000000000000000000000007d00a0c00000002096861736862797465730200000014352481ec2fecfde0c5cdc635a383c4ac27b9f71e0776657273696f6e020000000101")
  })

  test('getDeployPayload', () => {
    const contractName = 'kv-store';
    const codeBody = "(define-map store ((key (buff 32))) ((value (buff 32))))\n" +
        "\n" +
        "(define-public (get-value (key (buff 32)))\n" +
        "    (match (map-get? store ((key key)))\n" +
        "        entry (ok (get value entry))\n" +
        "        (err 0)))\n" +
        "\n" +
        "(define-public (set-value (key (buff 32)) (value (buff 32)))\n" +
        "    (begin\n" +
        "        (map-set store ((key key)) ((value value)))\n" +
        "        (ok 'true)))\n";
    const payload = getDeployPayload(contractName,codeBody);
    console.log(payload)
    expect(payload).toEqual("0602086b762d73746f72650000015628646566696e652d6d61702073746f72652028286b657920286275666620333229292920282876616c7565202862756666203332292929290a0a28646566696e652d7075626c696320286765742d76616c756520286b65792028627566662033322929290a20202020286d6174636820286d61702d6765743f2073746f72652028286b6579206b65792929290a2020202020202020656e74727920286f6b20286765742076616c756520656e74727929290a20202020202020202865727220302929290a0a28646566696e652d7075626c696320287365742d76616c756520286b65792028627566662033322929202876616c75652028627566662033322929290a2020202028626567696e0a2020202020202020286d61702d7365742073746f72652028286b6579206b6579292920282876616c75652076616c75652929290a2020202020202020286f6b2027747275652929290a")
  })
})


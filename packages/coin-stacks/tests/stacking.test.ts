import {
    StacksMainnet,
    StacksTestnet,
    allowContractCaller,
    delegateStx,
    revokeDelegateStx,
    stacks,
    tokenTransfer, StxWallet
} from '../src';
import Assert from 'assert';
import {test} from "@jest/globals";
import assert from "assert";


test("signCommonMsg", async () => {
    let wallet = new StxWallet();
    let sig = await wallet.signCommonMsg({privateKey:"33c4ad314d494632a36c27f9ac819e8d2986c0e26ad63052879f631a417c8adf", message:{walletId:"123456789"}});
    assert.strictEqual(sig,"1b523031d0c4a2de1a88fb02015a0d1bd3c6ef6e6834f7a4ba72020b192f3a92291868a9838eccfacce84125ed97eec9255da9cf7137be02cb863fe6436dbdb5e3");
    sig = await wallet.signCommonMsg({privateKey:"9af2f610c9b84f4e88a33c1c707a499ee58638655cc2c7e18942c89b7c54213601", message:{"walletId":"E1222E1B-035A-424E-97EF-88FF296B73BC"}})
    assert.strictEqual(sig,"1b182c85a550a32f562da2c4b22bc6947f4ca21369628dd24cd0072b8bd121450234ed4fd1392b4e35b65c7ae9e1962926ffa6fcb774cbec1616ae86533b0c6c00");

    sig = await wallet.signCommonMsg({privateKey:"9af2f610c9b84f4e88a33c1c707a499ee58638655cc2c7e18942c89b7c54213601", message:{"text":"E1222E1B-035A-424E-97EF-88FF296B73BC"}})
    assert.strictEqual(sig,"1ba835a8b34530a3f4799fd102a95ee7313a2b8cf50724778ef687a3387f50cdb342a29af889d7b6668def38820c28778e9f4fe4fdcd99e4cc3a68d4576a6bd575");
});

test('getNewAddress', async () => {
    const wallet = new StxWallet();
    const privateKey = '33c4ad314d494632a36c27f9ac819e8d2986c0e26ad63052879f631a417c8adf';
    const expectedAddress = "SP2XYBM8MD5T50WAMQ86E8HKR85BAEKBECNE1HHVY";
    expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual(expectedAddress);
    expect((await wallet.getNewAddress({privateKey:privateKey.toUpperCase()})).address).toEqual(expectedAddress);
    expect((await wallet.getNewAddress({privateKey:'0x'+privateKey})).address).toEqual(expectedAddress);
    expect((await wallet.getNewAddress({privateKey:'0X'+privateKey.toUpperCase()})).address).toEqual(expectedAddress);

    expect((await wallet.validPrivateKey({privateKey:privateKey})).isValid).toEqual(true);
    expect((await wallet.validPrivateKey({privateKey:privateKey.toUpperCase()})).isValid).toEqual(true);
    expect((await wallet.validPrivateKey({privateKey:'0x'+privateKey})).isValid).toEqual(true);
    expect((await wallet.validPrivateKey({privateKey:'0X'+privateKey.toUpperCase()})).isValid).toEqual(true);

});

const ps: any[] = [];
ps.push("");
ps.push("0x");
ps.push("124699");
ps.push("1dfi付");
ps.push("9000 12");
ps.push("548yT115QRHH7Mpchg9JJ8YPX9RTKuan=548yT115QRHH7Mpchg9JJ8YPX9RTKuan ");
ps.push("L1vSc9DuBDeVkbiS79mJ441FNAYArL1vSc9DuBDeVkbiS79mJ441FNAYArL1vSc9DuBDeVkbiS79mJ441FNAYArL1vSc9DuBDeVkbiS79mJ441FNAYAr");
ps.push("L1v");
ps.push("0x31342f041c5b54358074b4579231c8a300be65e687dff020bc7779598b428 97a");
ps.push("0x31342f041c5b54358074b457。、。9231c8a300be65e687dff020bc7779598b428 97a");
test("edge test", async () => {
    const wallet = new StxWallet();
    let j = 1;
    for (let i = 0; i < ps.length; i++) {
        let param = {privateKey: ps[i]};
        try {
            await wallet.getNewAddress(param);
        } catch (e) {
            j = j + 1
            expect(ps[i]).toEqual(param.privateKey)
        }
    }
    expect(j).toEqual(ps.length+1);
});

test("validPrivateKey", async () => {
    const wallet = new StxWallet();
    const privateKey = await wallet.getRandomPrivateKey();
    console.log(privateKey);
    const res = await wallet.validPrivateKey({privateKey:privateKey});
    expect(res.isValid).toEqual(true);
});

test('stack stx', async () => {
    const address = '';
    const poxAddress = '36Y1UJBWGGreKCKNYQPVPr41rgG2sQF7SC';
    const network = new StacksMainnet();
    const amountMicroStx = BigInt(420041303000);
    const cycles = 6;
    const privateKey = '33c4ad314d494632a36c27f9ac819e8d2986c0e26ad63052879f631a417c8adf';
    const burnBlockHeight = 668000;
    const contract = "SP000000000000000000002Q6VF78.pox";
    const fee = 5000;
    const nonce = 1;

    const stackingResults = await stacks(privateKey, "", poxAddress, amountMicroStx, cycles, burnBlockHeight, contract, fee, nonce);

    console.log(stackingResults)
    expect(stackingResults.txSerializedHexString).toEqual("00000000010400bbe5d1146974507154ba0ce446784156a74d6e6500000000000000010000000000001388010119a7ddf89b0e30cc49fcec55fdb6dee9bc3200bdacf39055edacac18f99ea8ce59476c9cff974143cd574cbef6feaa2053949b379df9a9bce5638c87e4ebbed80302000000000216000000000000000000000000000000000000000003706f7809737461636b2d7374780000000401000000000000000000000061cc69a3d80c00000002096861736862797465730200000014352481ec2fecfde0c5cdc635a383c4ac27b9f71e0776657273696f6e02000000010101000000000000000000000000000a31600100000000000000000000000000000006")
});

test('token-transfer', async () => {
    const key = "33c4ad314d494632a36c27f9ac819e8d2986c0e26ad63052879f631a417c8adf";
    const from = "SP2XYBM8MD5T50WAMQ86E8HKR85BAEKBECNE1HHVY";
    const to = "SP3HXJJMJQ06GNAZ8XWDN1QM48JEDC6PP6W3YZPZJ";
    const memo = "110317";
    const contract = "SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27";
    const contract_name = "miamicoin-token";
    const function_name = "transfer";
    const token_name = "miamicoin";

    const amount = 21;
    const nonce = 21;

    const tx = await tokenTransfer(key, from, to, memo, amount, contract, contract_name, token_name, function_name, nonce, 200000);
    console.log(tx)
    Assert.strictEqual(tx.txSerializedHexString, "00000000010400bbe5d1146974507154ba0ce446784156a74d6e6500000000000000150000000000030d400101188f34cac4ce31ceaac0f45278d71ba618c00ca613395a803f78654a3d4f94287891a88f3eb11773563946842f0ea4075aa24161980757ba9347f69dbaaf33a9030200000001010216bbe5d1146974507154ba0ce446784156a74d6e651608633eac058f2e6ab41613a0a537c7ea1a79cdd20f6d69616d69636f696e2d746f6b656e096d69616d69636f696e010000000000000015021608633eac058f2e6ab41613a0a537c7ea1a79cdd20f6d69616d69636f696e2d746f6b656e087472616e736665720000000401000000000000000000000000000000150516bbe5d1146974507154ba0ce446784156a74d6e650516e3d94a92b80d0aabe8ef1b50de84449cd61ad6370a0200000006313130333137")
});

test('allowContractCaller', async () => {
    const contract = "SP000000000000000000002Q6VF78";
    const contractName = 'pox-3';
    const functionName = 'allow-contract-caller';
    const caller = 'SP21YTSM60CAY6D011EZVEVNKXVW8FVZE198XEFFP.pox-fast-pool-v2';
    const untilBurnBlockHeight = 206600;
    const privateKey = '33c4ad314d494632a36c27f9ac819e8d2986c0e26ad63052879f631a417c8adf';

    const fee = 3000;
    const nonce = 57;

    const tx = await allowContractCaller(privateKey, caller, contract, contractName, functionName, untilBurnBlockHeight, nonce, fee);
    console.log(tx)
    Assert.strictEqual(tx.txSerializedHexString, "00000000010400bbe5d1146974507154ba0ce446784156a74d6e6500000000000000390000000000000bb801016e5a1e9a70c4a1033eee7d7a6102475006fec8c44a976e7ed024dc6b8ea491c32ed9a9f516eaa6e54e88dc2d630c6a67b10fe2ce9c35455a9a11e9c039c531770302000000000216000000000000000000000000000000000000000005706f782d3315616c6c6f772d636f6e74726163742d63616c6c657200000002061683ed66860315e334010bbfb76eb3eef887efee0a10706f782d666173742d706f6f6c2d76320a0100000000000000000000000000032708")
    Assert.strictEqual(tx.txId, "0x64f7d7597becbcc008f9ecef665c2dd9b875db8a0cb40d0fc220c8c9067a19a6");
})

test('delegateStx', async () => {
    const contract = "SP000000000000000000002Q6VF78";
    const contractName = 'pox-3';
    const functionName = 'delegate-stx';
    const delegateTo = 'SP3TDKYYRTYFE32N19484838WEJ25GX40Z24GECPZ';
    const poxAddress = '36Y1UJBWGGreKCKNYQPVPr41rgG2sQF7SC';
    const amountMicroStx = 100000000000;
    const untilBurnBlockHeight= 2000;
    const privateKey = '33c4ad314d494632a36c27f9ac819e8d2986c0e26ad63052879f631a417c8adf';
    const fee = 3000;
    const nonce = 58;

    const tx = await delegateStx(privateKey, contract, contractName, functionName, delegateTo, poxAddress, amountMicroStx, untilBurnBlockHeight, nonce, fee);
    console.log(tx)
    Assert.strictEqual(tx.txSerializedHexString, "00000000010400bbe5d1146974507154ba0ce446784156a74d6e65000000000000003a0000000000000bb801017383d46342c658e9647660e389d10b5ff3b42ef74d5cc6a6caeaee59502386f82944702340fc08adb9a3c8ddd61ff6803f7918bdfca3f7dec9d2458ae8d9dc0e0302000000000216000000000000000000000000000000000000000005706f782d330c64656c65676174652d73747800000004010000000000000000000000174876e8000516f4d9fbd8d79ee18aa14910440d1c7484587480f80a01000000000000000000000000000007d00a0c00000002096861736862797465730200000014352481ec2fecfde0c5cdc635a383c4ac27b9f71e0776657273696f6e020000000101")
    Assert.strictEqual(tx.txId, "0xcba9cb0d0367697fec1d9ed2b597331464b1b0ee68766c7a4c6cf1e88eceae40");
});

test('revokeDelegateStx', async () => {
    const contract = "SP000000000000000000002Q6VF78";
    const contractName = 'pox-3';
    const functionName = 'revoke-delegate-stx';
    const privateKey = '33c4ad314d494632a36c27f9ac819e8d2986c0e26ad63052879f631a417c8adf';
    const fee = 3000;
    const nonce = 59;

    const tx = await revokeDelegateStx(privateKey, contract, contractName, functionName, nonce, fee);
    console.log(tx)
    Assert.strictEqual(tx.txSerializedHexString, "00000000010400bbe5d1146974507154ba0ce446784156a74d6e65000000000000003b0000000000000bb80101aaf4f7d5b483a9cb10580772c373856f52614b563f94de7032f744bfad44af3d193ba53dc3c7e5874c3345ac1f88bb8e8f2cbc1acaa17ea114a03d1ad5d3efe40302000000000216000000000000000000000000000000000000000005706f782d33137265766f6b652d64656c65676174652d73747800000000")
    Assert.strictEqual(tx.txId, "0x74486c2574aae64dc9d2c607d336de6c442206a29232c998e9a2ce8a797e9066");
});
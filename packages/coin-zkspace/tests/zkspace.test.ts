import {changePubkey, transfer} from '../src';
import Assert from 'assert';

describe("zkspace", () => {
    test("changepubkey", async () => {
        const l1PrivateKey = '0xbdd80f4421968142b3a4a6c27a1d84a3623384d085a04a895f109fd8d49cef0a'
        const from = '0xad06a98cAC85448Cb33495ca68b0837e3b65ABe6';
        const nonce = 2
        const accountId = 11573
        const data = await changePubkey(l1PrivateKey, from, nonce, accountId)
        Assert.strictEqual(JSON.stringify(data), "{\"type\":\"ChangePubKey\",\"accountId\":11573,\"account\":\"0x5d4d48eb6e9677b0d91f8fb77b419591e5c625ee\",\"newPkHash\":\"sync:1a15456df95b1af2cdc390b7c303dd389bdabf0b\",\"nonce\":2,\"ethSignature\":\"0xa0cd2dbed420d529d23dab710877eab3ea06deb4240e789ec0dd4792bee46bb862b8938944ea4657100b33c7da88e9cbe76ba6dada3726720d741bed06347aac1c\",\"txHash\":\"0x9413872b6a87bc622f26da6083a40dd5878a0cd4f45f7601c6ca3a4c5a98cafd\"}")
    });

    test("transfer", async () => {
        const l1PrivateKey = '0xbdd80f4421968142b3a4a6c27a1d84a3623384d085a04a895f109fd8d49cef0a'
        const from = '0xad06a98cAC85448Cb33495ca68b0837e3b65ABe6';
        const nonce = 11
        const accountId = 11573
        const chainId = 13
        const to = '0x21dceed765c30b2abea933a161479aea4702e433'
        const tokenId = 2
        const tokenSymbol = 'USDT'
        const decimals = 6

        // calculate fee
        const feeUSDT = '0.5'
        const feeTokenId = 1
        const feeTokenSymbol = 'ZKS'
        const feeDecimals = 18
        const price = '0.0593863548182511'
        const amount = '100';
        const fee = '8410000000000000000';

        const data = await transfer(l1PrivateKey, from, nonce, accountId, chainId, to, tokenId, tokenSymbol, decimals, feeTokenId, feeTokenSymbol, feeDecimals, amount, fee);
        Assert.strictEqual(JSON.stringify(data),  "{\"tx\":{\"type\":\"Transfer\",\"accountId\":11573,\"from\":\"0x5d4d48eb6e9677b0d91f8fb77b419591e5c625ee\",\"to\":\"0x21dceed765c30b2abea933a161479aea4702e433\",\"token\":2,\"amount\":\"100\",\"feeToken\":1,\"fee\":\"8410000000000000000\",\"chainId\":13,\"nonce\":11,\"signature\":{\"pubKey\":\"fc4711342be219074595bbe005db42b56259e41135d57eaa88a3397dfd9c2628\",\"signature\":\"164dcda5ac6903616251d84b9882d5cf6b57eb781daf7cefd4ec9d45af40f5afb80239db24a73966dcd9f440db1a9cc6c662cc70799ff8c0f6ee67d3c91f3003\"},\"txHash\":\"0x4f60fca7dd47d78154f1aadf276d75817471b1529c765ee7cbac035d1f93b291\"},\"signature\":{\"type\":\"EthereumSignature\",\"signature\":\"0x5f490d8c290c0b5d92169735d76a8749feee5a5904bf29c73e2cfb0a7b35fead7d2811fa7814f96fd470041a0c8b83e15258bfce185a99f978cdc597b9d87d6e1c\"}}")
    });
});
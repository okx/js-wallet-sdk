# BTC Sign psbt

BTC PSBT (Partially Signed Bitcoin Transaction) is a transaction format of Bitcoin that is used to sign transactions between multiple parties. This format allows transactions to be passed and modified without being fully signed, allowing multiple parties to gradually sign the transaction, eventually forming a complete transaction.

## build psbt transaction


```typescript
const txInputs: utxoInput[] = [];
txInputs.push({
    txId: "8a33c165574ec8bb7dd578e1d97b20952043da184196136deae3b237e8f6bf2a",
    vOut: 2,
    amount: 341474,
    address: "2NF33rckfiQTiE5Guk5ufUdwms8PgmtnEdc",
    privateKey: "L1vSc9DuBDeVkbiS79mJ441FNAYArcYp9A1c5ZJC5qVhLiuiopmK",
    publicKey: "0357bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2f",
    bip32Derivation: [
        {
            "masterFingerprint": "a22e8e32",
            "pubkey": "023f25a35d20804305e70f4223ed6b3aeb268b6781b95b6e5f7c84465f283c2425",
            "path": "m/49'/0'/0'/0/0",
        },
    ],
});
txInputs.push({
    txId: "78d81df15795206560c5f4f49824a38deb0a63941c6d593ca12739b2d940c8cd",
    vOut: 0,
    amount: 200000,
    address: "tb1qtsq9c4fje6qsmheql8gajwtrrdrs38kdzeersc",
    privateKey: "L1vSc9DuBDeVkbiS79mJ441FNAYArcYp9A1c5ZJC5qVhLiuiopmK",
    bip32Derivation: [
        {
            "masterFingerprint": "a22e8e32",
            "pubkey": "023f25a35d20804305e70f4223ed6b3aeb268b6781b95b6e5f7c84465f283c2425",
            "path": "m/49'/0'/0'/0/0",
        },
    ],
});
txInputs.push({
    txId: "78d81df15795206560c5f4f49824a38deb0a63941c6d593ca12739b2d940c8cd",
    vOut: 1,
    amount: 200000,
    address: "mouQtmBWDS7JnT65Grj2tPzdSmGKJgRMhE",
    privateKey: "L1vSc9DuBDeVkbiS79mJ441FNAYArcYp9A1c5ZJC5qVhLiuiopmK",
    nonWitnessUtxo: "02000000000104870fa29a7da1acff1cd4fb274fd15904ff1c867ad41d309577d4c8268ad0b9250000000000ffffffff1558fd0c79199219e27ce50e07a84c4b01d7563e5c53f9e6550d7c4450aa596d000000006b483045022100bd9b8c17d68efed18f0882bdb77db303a0a547864305e32ed7a9a951b650caa90220131c361e5c27652a3a05603306a87d8f6e117b78fdb1082db23d8960eb6214bf01210357bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2fffffffff06424462f9b8179b1cdc6229a4e213ff3628060b2a0a7680dae6740405cee3460000000000ffffffffa21ba51db540d68c0feaf3fb958058e1f2f123194f9238d9b2c86e04106c69d100000000171600145c005c5532ce810ddf20f9d1d939631b47089ecdffffffff06400d0300000000001600145c005c5532ce810ddf20f9d1d939631b47089ecd400d0300000000001976a9145c005c5532ce810ddf20f9d1d939631b47089ecd88aca08601000000000017a914ef05515a0595d15eaf90d9f62fb85873a6d8c0b487e4c2030000000000225120b7ee7f83a6a7fdb513040856c56778aa3abea9a451e0c9bb012f22a77ed99b21e803000000000000225120b7ee7f83a6a7fdb513040856c56778aa3abea9a451e0c9bb012f22a77ed99b21e803000000000000225120b7ee7f83a6a7fdb513040856c56778aa3abea9a451e0c9bb012f22a77ed99b2102483045022100a1d12dee8d87d2f8a12ff43f656a6b52183fa5ce4ffd1ab349b978d4dc5e68620220060d8c6d20ea34d3b2f744624d9f027c9020cb80cfb9babe015ebd70db0a927a01210357bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2f000141f24c018bc95e051c33e4659cacad365db8f3afbaf61ee163e3e1bf1d419baaeb681f681c75a545a19d4ade0b972e226448015d9cbdaee121f4148b5bee9d27068302483045022100bb251cc4a4db4eab3352d54541a03d20d5067e8261b6f7ba8a20a7d955dfafde022078be1dd187ff61934177a9245872f4a90beef32ec40b69f75d9c50c32053d97101210357bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2f00000000",
    bip32Derivation: [
        {
            "masterFingerprint": "a22e8e32",
            "pubkey": "023f25a35d20804305e70f4223ed6b3aeb268b6781b95b6e5f7c84465f283c2425",
            "path": "m/49'/0'/0'/0/0",
        },
    ],
});
txInputs.push({
    txId: "78d81df15795206560c5f4f49824a38deb0a63941c6d593ca12739b2d940c8cd",
    vOut: 4,
    amount: 1000,
    address: "tb1pklh8lqax5l7m2ycypptv2emc4gata2dy28svnwcp9u32wlkenvsspcvhsr",
    privateKey: "L1vSc9DuBDeVkbiS79mJ441FNAYArcYp9A1c5ZJC5qVhLiuiopmK",
    publicKey: "0357bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2f",
    bip32Derivation: [
        {
            "masterFingerprint": "a22e8e32",
            "pubkey": "023f25a35d20804305e70f4223ed6b3aeb268b6781b95b6e5f7c84465f283c2425",
            "path": "m/49'/0'/0'/0/0",
            "leafHashes": ["57bbb2d4a9cb8a2357633f201b9c518c2795ded682b7913c6beef3fe23bd6d2f"]
        },
    ],
});

const txOutputs: utxoOutput[] = [];
txOutputs.push({
    address: "tb1qtsq9c4fje6qsmheql8gajwtrrdrs38kdzeersc",
    amount: 2000,
});
txOutputs.push({
    address: "tb1qtsq9c4fje6qsmheql8gajwtrrdrs38kdzeersc",
    amount: 2000,
});
txOutputs.push({
    address: "tb1qtsq9c4fje6qsmheql8gajwtrrdrs38kdzeersc",
    amount: 20000,
});
txOutputs.push({
    address: "tb1qtsq9c4fje6qsmheql8gajwtrrdrs38kdzeersc",
    amount: 20000,
});

const uxtoTx: utxoTx = {
    inputs: txInputs as any,
    outputs: txOutputs as any,
    address: 'tb1qtsq9c4fje6qsmheql8gajwtrrdrs38kdzeersc',
}
const unSignedTx = buildPsbt(uxtoTx, networks.testnet);
console.log(unSignedTx);
```



## sign psbt with key path and script path

```typescript
test("sign psbt with key path and script path", async () => {
    const network = networks.testnet;
    const psbtHex = "70736274ff0100740200000001258fedc4ea8a2945ef64bc4388ab79e8ab8a173894342c2449bfeb3c6bf5b7ea0000000000ffffffff02e8030000000000001976a9142c8826cd93b186b81c1926115e0287efbf23486a88ac401f000000000000160014505049839bc32f869590adc5650c584e17c917fc000000000001012b10270000000000002251203d558197d465de33a5fbc3c2a879e51d5c16a4ae90fcf6aa8f27fb483421f2284215c150929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0571c2083eaabb20407f08f81edd91590dcf4e9c42d7d69bb82520a5d22a4c3eff120b4b25d72d2d813bee73c679473ddb5f47956ae93e41a3e16b60a7190bccb78afad20a37236e8875b30cad25a3c7df7d07fd09ef29331f8e270ad954f6ba9b42d5bd6ad2057349e985e742d5131e1e2b227b5170f6350ac2e2feb72254fcc25b3cee21a18ac2059d3532148a597a2d05c0395bf5f7176044b1cd312f37701a9b4d0aad70bc5a4ba20a5c60c2188e833d39d0fa798ab3f69aa12ed3dd2f3bad659effa252782de3c31ba20c8ccb03c379e452f10c81232b41a1ca8b63d0baf8387e57d302c987e5abb8527ba20ffeaec52a9b407b355ef6967a7ffc15fd6c3fe07de2844d61550475e7a5233e5ba53a2c001172050929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0000000";
    const privateKey = "cPnvkvUYyHcSSS26iD1dkrJdV7k1RoUqJLhn3CYxpo398PdLVE22";
    const toSignInputs: toSignInput[] = [];
    toSignInputs.push({
        index: 2,
        address: "tb1pyrujq6htc7crmd3uejdkllhk0kctahkfxq75dflnqlg846kgl34qpawucx",
        sighashTypes: [0],
        disableTweakSigner: false,
    });
    let wallet = new TBtcWallet()
    let params = {
        type: 3,
        psbt: psbtHex,
        autoFinalized: false,
        toSignInputs: toSignInputs,
    };
    let signParams: SignTxParams = {
        privateKey: "cPnvkvUYyHcSSS26iD1dkrJdV7k1RoUqJLhn3CYxpo398PdLVE22",
        data: params,
    };
    let signedPsbtHex = await wallet.signTransaction(signParams);
    console.info(signedPsbtHex);
    const expected = "70736274ff0100740200000001258fedc4ea8a2945ef64bc4388ab79e8ab8a173894342c2449bfeb3c6bf5b7ea0000000000ffffffff02e8030000000000001976a9142c8826cd93b186b81c1926115e0287efbf23486a88ac401f000000000000160014505049839bc32f869590adc5650c584e17c917fc000000000001012b10270000000000002251203d558197d465de33a5fbc3c2a879e51d5c16a4ae90fcf6aa8f27fb483421f2284215c150929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0571c2083eaabb20407f08f81edd91590dcf4e9c42d7d69bb82520a5d22a4c3eff120b4b25d72d2d813bee73c679473ddb5f47956ae93e41a3e16b60a7190bccb78afad20a37236e8875b30cad25a3c7df7d07fd09ef29331f8e270ad954f6ba9b42d5bd6ad2057349e985e742d5131e1e2b227b5170f6350ac2e2feb72254fcc25b3cee21a18ac2059d3532148a597a2d05c0395bf5f7176044b1cd312f37701a9b4d0aad70bc5a4ba20a5c60c2188e833d39d0fa798ab3f69aa12ed3dd2f3bad659effa252782de3c31ba20c8ccb03c379e452f10c81232b41a1ca8b63d0baf8387e57d302c987e5abb8527ba20ffeaec52a9b407b355ef6967a7ffc15fd6c3fe07de2844d61550475e7a5233e5ba53a2c001172050929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0000000";
});
```

* autoFinalized: boolean, whether finalize psbt after signing, default is true
* toSignInputs: array
    * index - number: which input to sign
    * address - string: (at least specify either an address or a publicKey) Which corresponding private key to use for signing
    * publicKey - string: (at least specify either an address or a publicKey) Which corresponding private key to use for signing
    * sighashTypes - number[]: (optionals) sighashTypes 
    * disableTweakSigner - boolean :(optionals) When signing and unlocking Taproot addresses, the tweakSigner is used by default for signature generation. Enabling this allows for signing with the original private key.

## sign psbt with key path and script path for batch
```typescript
test("sign psbt with key path and script path for batch", async () => {
    const network = networks.testnet;
    const psbtHex = "70736274ff0100740200000001258fedc4ea8a2945ef64bc4388ab79e8ab8a173894342c2449bfeb3c6bf5b7ea0000000000ffffffff02e8030000000000001976a9142c8826cd93b186b81c1926115e0287efbf23486a88ac401f000000000000160014505049839bc32f869590adc5650c584e17c917fc000000000001012b10270000000000002251203d558197d465de33a5fbc3c2a879e51d5c16a4ae90fcf6aa8f27fb483421f2284215c150929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0571c2083eaabb20407f08f81edd91590dcf4e9c42d7d69bb82520a5d22a4c3eff120b4b25d72d2d813bee73c679473ddb5f47956ae93e41a3e16b60a7190bccb78afad20a37236e8875b30cad25a3c7df7d07fd09ef29331f8e270ad954f6ba9b42d5bd6ad2057349e985e742d5131e1e2b227b5170f6350ac2e2feb72254fcc25b3cee21a18ac2059d3532148a597a2d05c0395bf5f7176044b1cd312f37701a9b4d0aad70bc5a4ba20a5c60c2188e833d39d0fa798ab3f69aa12ed3dd2f3bad659effa252782de3c31ba20c8ccb03c379e452f10c81232b41a1ca8b63d0baf8387e57d302c987e5abb8527ba20ffeaec52a9b407b355ef6967a7ffc15fd6c3fe07de2844d61550475e7a5233e5ba53a2c001172050929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0000000";
    const privateKey = "cPnvkvUYyHcSSS26iD1dkrJdV7k1RoUqJLhn3CYxpo398PdLVE22";
    const toSignInputs: toSignInput[] = [];
    toSignInputs.push({
        index: 2,
        address: "tb1pyrujq6htc7crmd3uejdkllhk0kctahkfxq75dflnqlg846kgl34qpawucx",
        sighashTypes: [0],
        disableTweakSigner: false,
    });
    let wallet = new TBtcWallet()
    let params = {
        type: 4,
        psbtHexs: [psbtHex],
        options: [{
            autoFinalized: false,
            toSignInputs: toSignInputs,
        }],
    };
    let signParams: SignTxParams = {
        privateKey: "cPnvkvUYyHcSSS26iD1dkrJdV7k1RoUqJLhn3CYxpo398PdLVE22",
        data: params,
    };
    let signedPsbtHex = await wallet.signTransaction(signParams);
    console.info(signedPsbtHex);
    const expected = '70736274ff0100740200000001258fedc4ea8a2945ef64bc4388ab79e8ab8a173894342c2449bfeb3c6bf5b7ea0000000000ffffffff02e8030000000000001976a9142c8826cd93b186b81c1926115e0287efbf23486a88ac401f000000000000160014505049839bc32f869590adc5650c584e17c917fc000000000001012b10270000000000002251203d558197d465de33a5fbc3c2a879e51d5c16a4ae90fcf6aa8f27fb483421f2284215c150929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0571c2083eaabb20407f08f81edd91590dcf4e9c42d7d69bb82520a5d22a4c3eff120b4b25d72d2d813bee73c679473ddb5f47956ae93e41a3e16b60a7190bccb78afad20a37236e8875b30cad25a3c7df7d07fd09ef29331f8e270ad954f6ba9b42d5bd6ad2057349e985e742d5131e1e2b227b5170f6350ac2e2feb72254fcc25b3cee21a18ac2059d3532148a597a2d05c0395bf5f7176044b1cd312f37701a9b4d0aad70bc5a4ba20a5c60c2188e833d39d0fa798ab3f69aa12ed3dd2f3bad659effa252782de3c31ba20c8ccb03c379e452f10c81232b41a1ca8b63d0baf8387e57d302c987e5abb8527ba20ffeaec52a9b407b355ef6967a7ffc15fd6c3fe07de2844d61550475e7a5233e5ba53a2c001172050929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0000000';
});
```
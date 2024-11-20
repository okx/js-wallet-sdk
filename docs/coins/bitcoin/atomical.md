# BTC atomical

## FT token transfer

1. Prepare 
* wif private key
* the address of receiver
* The sender has atomicals assets
* Sufficient transaction fee
2. Transfer procedure
  
* build wallet and privateKey verify

```typescript
let wallet = new TBtcWallet();
const validPrivateKeyData = await wallet.validPrivateKey({ privateKey: privateKey });
if (!validPrivateKeyData.isValid) {
      throw new Error("Invalid private key");
  }
```
* parameter structure

```typescript
const transactionParams = {
        data: {
            inputs: [...
          ],
            outputs: [...
          ],
            address: "change address",
            feePerB: 10, // satoshis per byte
            dustSize:546,
        },
        privateKey: "privateKey"
};
```
* parameter definition

```typescript
export type AtomicalData = {
    atomicalId:string // case：9527290d5f28479fa752f3eb9484ccbc5a951e2b2b5a49870318683e188e357ei0
    type:string // token type: FT | NFT 
}

export type PrevOutput = {
    txId: string
    vOut: number
    amount: number
    address: string
    data:AtomicalData[]
}

export type Output = {
    amount: number
    address: string
    data:AtomicalData[]  // Compatible with subsequent asset splitting scenarios and asset compounding scenarios (reducing transfer costs)
}

export type SignTxParams = {
    inputs: PrevOutput[]
    outputs: Output[]
    feePerB: number
    address: string   // BTC & arc20 change address
    dustSize?: number // BTC The minimum amount of change, if not set, the default is 546
    privateKey: string
}

 async signTransaction(param: SignTxParams): Promise<any> {}
 async estimateFee(param: SignTxParams): Promise<number> {}
```
* estimateFee

```typescript
let txfee = await wallet.estimateFee(signParams);
console.log("txfee:",txfee)
```

* signature broadcast
```typescript
const signTransactionParam = await wallet.signTransaction(transactionParams);
const boardRes = await broadcastTransaction(signTransactionParam);
```

The following are examples of token transfer

### Same Asset One-to-One Transfer

```typescript
test("Same Asset One-to-One Transfer", async () => {
    let wallet = new AtomicalTestWallet()
    let atomicalTxParams = {
        inputs: [
            // atomical token info
            {
                txId: "1b1072c24fce7fe658163553a9ea812784d57b83603fe241fde8eea0b2a31fd9",
                vOut: 1,
                amount: 546,
                address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
                data: [
                    {"atomicalId": "9527efa43262636d8f5917fc763fbdd09333e4b387afd6d4ed7a905a127b27b4i0", "type": "FT","amount":"400"}
                ] ,// maybe many atomical token
                privateKey: curPrivateKey,
            },
            // gas fee utxo
            {
                txId: "1b1072c24fce7fe658163553a9ea812784d57b83603fe241fde8eea0b2a31fd9",
                vOut: 2,
                amount: 1339086,
                address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
                privateKey: curPrivateKey,
            },
        ],
        outputs: [
            { // atomical send output
                address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
                amount: 546,
                data: [
                    {"atomicalId": "9527efa43262636d8f5917fc763fbdd09333e4b387afd6d4ed7a905a127b27b4i0", "type": "FT","amount":"400"}
                ]
            }
        ],
        address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
        feePerB: 6,
        dustSize : 546
    };

    let signParams: SignTxParams = {
        privateKey: curPrivateKey,
        data: atomicalTxParams
    };
    let txfee = await wallet.estimateFee(signParams);
    expect(txfee).toEqual(1272)
    let txraw = await wallet.signTransaction(signParams);
    const partial = /^02000000000102d91fa3b2a0eee8fd41e23f60837bd5842781eaa953351658e67fce4fc272101b0100000000ffffffffd91fa3b2a0eee8fd41e23f60837bd5842781eaa953351658e67fce4fc272101b0200000000ffffffff0222020000000000002251200a70fd98b28bfcf103f9e2a9e12ebac5d4c2a4b32f076bfd1e9f83076361001ed6691400000000002251200a70fd98b28bfcf103f9e2a9e12ebac5d4c2a4b32f076bfd1e9f83076361001e0140[0-9a-fA-F]{260}00000000$/
    expect(txraw).toMatch(partial)

});
```
Parameter
1. Add the data parameter amount field (must be passed in) as the asset quantity. FT no longer uses the sats quantity as the asset quantity. NFT needs to pass in amount = 1.


### Same Asset One-to-Many Transfer

```typescript
test("Same Asset One-to-Many Transfer", async () => {
    let wallet = new AtomicalTestWallet()
    let atomicalTxParams = {
        inputs: [
            // atomical token info
            {
                txId: "2ff565d4b73b401d68eef5fb572c19f64b9c8705a79ec14f322528dbc34179e1",
                vOut: 0,
                amount: 2000,
                address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
                data: [
                    {"atomicalId": "9527efa43262636d8f5917fc763fbdd09333e4b387afd6d4ed7a905a127b27b4i0", "type": "FT","amount":"2000"}
                ] // maybe many atomical token
            },
            // gas fee utxo
            {
                txId: "1413c03a4d179d4d78d4ffb9e79b954bdc31716b0ba98fdc9288a676636464a0",
                vOut: 1,
                amount: 900842,
                address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
            },
        ],
        outputs: [
            { // atomical send output
                address: "tb1pmye4w4txqsrddyguc5x6z2h5qkms0u38r6y90m8us53h4ndkwprst34fnw",
                amount: 1500,
                data: [
                    {"atomicalId": "9527efa43262636d8f5917fc763fbdd09333e4b387afd6d4ed7a905a127b27b4i0", "type": "FT","amount":"1500"}
                ]
            },
            { // atomical send output
                address: "tb1pmye4w4txqsrddyguc5x6z2h5qkms0u38r6y90m8us53h4ndkwprst34fnw",
                amount: 546,
                data: [
                    {"atomicalId": "9527efa43262636d8f5917fc763fbdd09333e4b387afd6d4ed7a905a127b27b4i0", "type": "FT","amount":"500"}
                ]
            },
        ],
        address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
        feePerB: 1,
        dustSize :  546
    };

    let signParams: SignTxParams = {
        privateKey: curPrivateKey,
        data: atomicalTxParams
    };
    let txfee = await wallet.estimateFee(signParams);
    expect(txfee).toEqual(255)
    let txraw = await wallet.signTransaction(signParams);
    const partial = /^02000000000102e17941c3db2825324fc19ea705879c4bf6192c57fbf5ee681d403bb7d465f52f0000000000ffffffffa064646376a68892dc8fa90b6b7131dc4b959be7b9ffd4784d9d174d3ac013140100000000ffffffff03dc05000000000000225120d9335755660406d6911cc50da12af405b707f2271e8857ecfc85237acdb670472202000000000000225120d9335755660406d6911cc50da12af405b707f2271e8857ecfc85237acdb67047bdbd0d00000000002251200a70fd98b28bfcf103f9e2a9e12ebac5d4c2a4b32f076bfd1e9f83076361001e0140[0-9a-fA-F]{260}00000000$/
    expect(txraw).toMatch(partial)
});
```


### Same Asset Many-to-One Transfer


```typescript
test("Same Asset Many-to-One Transfer", async () => {
    let wallet = new AtomicalTestWallet()
    let atomicalTxParams = {
        inputs: [
            // atomical token info
            {
                txId: "2ff565d4b73b401d68eef5fb572c19f64b9c8705a79ec14f322528dbc34179e1",
                vOut: 0,
                amount: 1000,
                address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
                data: [
                    {"atomicalId": "9527efa43262636d8f5917fc763fbdd09333e4b387afd6d4ed7a905a127b27b4i0", "type": "FT","amount":"1000"}
                ] ,// maybe many atomical token
            },
            {
                txId: "2ff565d4b73b401d68eef5fb572c19f64b9c8705a79ec14f322528dbc34179e1",
                vOut: 1,
                amount: 1000,
                address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
                data: [
                    {"atomicalId": "9527efa43262636d8f5917fc763fbdd09333e4b387afd6d4ed7a905a127b27b4i0", "type": "FT","amount":"1000"}
                ] ,// maybe many atomical token
            },
            // gas fee utxo
            {
                txId: "1413c03a4d179d4d78d4ffb9e79b954bdc31716b0ba98fdc9288a676636464a0",
                vOut: 1,
                amount: 900842,
                address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
            },
        ],
        outputs: [
            { // atomical send output
                address: "tb1pmye4w4txqsrddyguc5x6z2h5qkms0u38r6y90m8us53h4ndkwprst34fnw",
                amount: 1800,
                data: [
                    {"atomicalId": "9527efa43262636d8f5917fc763fbdd09333e4b387afd6d4ed7a905a127b27b4i0", "type": "FT","amount":"1800"}
                ]
            },
            { // atomical send output
                address: "tb1pmye4w4txqsrddyguc5x6z2h5qkms0u38r6y90m8us53h4ndkwprst34fnw",
                amount: 546,
                data: [
                    {"atomicalId": "9527efa43262636d8f5917fc763fbdd09333e4b387afd6d4ed7a905a127b27b4i0", "type": "FT","amount":"200"}
                ]
            },
        ],
        address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
        feePerB: 1,
        dustSize :  546
    };

    let signParams: SignTxParams = {
        privateKey: curPrivateKey,
        data: atomicalTxParams
    };
    let txfee = await wallet.estimateFee(signParams);
    expect(txfee).toEqual(312)
    let txraw = await wallet.signTransaction(signParams);
    const partial = /^02000000000103e17941c3db2825324fc19ea705879c4bf6192c57fbf5ee681d403bb7d465f52f0000000000ffffffffe17941c3db2825324fc19ea705879c4bf6192c57fbf5ee681d403bb7d465f52f0100000000ffffffffa064646376a68892dc8fa90b6b7131dc4b959be7b9ffd4784d9d174d3ac013140100000000ffffffff030807000000000000225120d9335755660406d6911cc50da12af405b707f2271e8857ecfc85237acdb670472202000000000000225120d9335755660406d6911cc50da12af405b707f2271e8857ecfc85237acdb6704758bc0d00000000002251200a70fd98b28bfcf103f9e2a9e12ebac5d4c2a4b32f076bfd1e9f83076361001e0140.*/
    expect(txraw).toMatch(partial)
});
```


## NFT transfer 

```typescript
test("Same Asset One-to-One Transfer", async () => {
    let wallet = new AtomicalTestWallet()
    let atomicalTxParams = {
        inputs: [
            // atomical token info
            {
                txId: "6abc1613438645b04435ac887e6e450f6ca57c3648e2091e968bc20a12e94a5e",
                vOut: 0,
                amount: 1000,
                address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
                data: [
                    {"atomicalId": "33147405f9f24e5ab827413f377854e91b922996e76ffe6b297ee93113dbfd53i0", "type": "NFT","amount":"1"}
                ] ,// maybe many atomical token
            },
            // gas fee utxo
            {
                txId: "c1736e36bd27800916b337b034a643bdd6335645f99a74af5296ace1eed2da12",
                vOut: 1,
                amount: 900630,
                address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
            },
        ],
        outputs: [
            { // atomical send output
                address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
                amount: 1000,
                data: [
                    {"atomicalId": "33147405f9f24e5ab827413f377854e91b922996e76ffe6b297ee93113dbfd53i0", "type": "NFT","amount":"1"}
                ]
            }
        ],
        address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
        feePerB: 1,
        dustSize : 546
    };

    let signParams: SignTxParams = {
        privateKey: curPrivateKey,
        data: atomicalTxParams
    };
    let txfee = await wallet.estimateFee(signParams);
    expect(txfee).toEqual(212)
    let txraw = await wallet.signTransaction(signParams);
    const partial = /^020000000001025e4ae9120ac28b961e09e248367ca56c0f456e7e88ac3544b04586431316bc6a0000000000ffffffff12dad2eee1ac9652af749af9455633d6bd43a634b037b316098027bd366e73c10100000000ffffffff02e8030000000000002251200a70fd98b28bfcf103f9e2a9e12ebac5d4c2a4b32f076bfd1e9f83076361001e42bd0d00000000002251200a70fd98b28bfcf103f9e2a9e12ebac5d4c2a4b32f076bfd1e9f83076361001e0140.*/
    expect(txraw).toMatch(partial)
});
```




import {AtomicalTestWallet} from "../src"
import {SignTxParams} from "@okxweb3/coin-base";

const curPrivateKey  = "aa"

describe('atomical test FT:  ', () => {
    test("Same Asset One-to-One Transfer", async () => {
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
                        {"atomicalId": "9527efa43262636d8f5917fc763fbdd09333e4b387afd6d4ed7a905a127b27b4i0", "type": "FT"}
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
                    amount: 1000,
                    data: [
                        {"atomicalId": "9527efa43262636d8f5917fc763fbdd09333e4b387afd6d4ed7a905a127b27b4i0", "type": "FT"}
                    ]  
                }
            ],
            changeAddress: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
            feeRate: 1,
            minChangeValue : 100 
        };

        let signParams: SignTxParams = {
            privateKey: curPrivateKey,
            data: atomicalTxParams
        };
        // let txfee = await wallet.estimateFee(signParams);
        // console.log("txfee:",txfee)
        let tx = await wallet.signTransaction(signParams);
        console.info("txraw:",tx)
    });
    test("Same Asset One-to-One Transfer Auto Change", async () => {
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
                        {"atomicalId": "9527efa43262636d8f5917fc763fbdd09333e4b387afd6d4ed7a905a127b27b4i0", "type": "FT"}
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
                    amount: 500,
                    data: [
                        {"atomicalId": "9527efa43262636d8f5917fc763fbdd09333e4b387afd6d4ed7a905a127b27b4i0", "type": "FT"}
                    ]  
                }
            ],
            changeAddress: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
            feeRate: 1,
            minChangeValue : 100 
        };

        let signParams: SignTxParams = {
            privateKey: curPrivateKey,
            data: atomicalTxParams
        };
        // let txfee = await wallet.estimateFee(signParams);
        // console.log("txfee:",txfee)
        let tx = await wallet.signTransaction(signParams);
        console.info("txraw:",tx)
    });
    test("Same Asset One-to-Many Transfer", async () => {
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
                        {"atomicalId": "9527efa43262636d8f5917fc763fbdd09333e4b387afd6d4ed7a905a127b27b4i0", "type": "FT"}
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
                    amount: 500,
                    data: [
                        {"atomicalId": "9527efa43262636d8f5917fc763fbdd09333e4b387afd6d4ed7a905a127b27b4i0", "type": "FT"}
                    ]  
                },
                { // atomical send output
                    address: "tb1pmye4w4txqsrddyguc5x6z2h5qkms0u38r6y90m8us53h4ndkwprst34fnw",
                    amount: 500,
                    data: [
                        {"atomicalId": "9527efa43262636d8f5917fc763fbdd09333e4b387afd6d4ed7a905a127b27b4i0", "type": "FT"}
                    ]  
                },
            ],
            changeAddress: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
            feeRate: 1,
            minChangeValue : 100 
        };

        let signParams: SignTxParams = {
            privateKey: curPrivateKey,
            data: atomicalTxParams
        };
        // let txfee = await wallet.estimateFee(signParams);
        // console.log("txfee:",txfee)
        let tx = await wallet.signTransaction(signParams);
        console.info("txraw:",tx)
    });
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
                        {"atomicalId": "9527efa43262636d8f5917fc763fbdd09333e4b387afd6d4ed7a905a127b27b4i0", "type": "FT"}
                    ] ,// maybe many atomical token
                },
                {
                    txId: "2ff565d4b73b401d68eef5fb572c19f64b9c8705a79ec14f322528dbc34179e1",
                    vOut: 1,
                    amount: 1000,
                    address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
                    data: [
                        {"atomicalId": "9527efa43262636d8f5917fc763fbdd09333e4b387afd6d4ed7a905a127b27b4i0", "type": "FT"}
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
                    amount: 2000,
                    data: [
                        {"atomicalId": "9527efa43262636d8f5917fc763fbdd09333e4b387afd6d4ed7a905a127b27b4i0", "type": "FT"}
                    ]  
                },
            ],
            changeAddress: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
            feeRate: 1,
            minChangeValue : 100 
        };

        let signParams: SignTxParams = {
            privateKey: curPrivateKey,
            data: atomicalTxParams
        };
        // let txfee = await wallet.estimateFee(signParams);
        // console.log("txfee:",txfee)
        let tx = await wallet.signTransaction(signParams);
        console.info("txraw:",tx)
    });
})

describe('atomical test NFT:  ', () => {
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
                        {"atomicalId": "33147405f9f24e5ab827413f377854e91b922996e76ffe6b297ee93113dbfd53i0", "type": "NFT"}
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
                        {"atomicalId": "33147405f9f24e5ab827413f377854e91b922996e76ffe6b297ee93113dbfd53i0", "type": "NFT"}
                    ]  
                }
            ],
            changeAddress: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
            feeRate: 1,
            minChangeValue : 100 
        };

        let signParams: SignTxParams = {
            privateKey: curPrivateKey,
            data: atomicalTxParams
        };
        // let txfee = await wallet.estimateFee(signParams);
        // console.log("txfee:",txfee)
        let tx = await wallet.signTransaction(signParams);
        console.info("txraw:",tx)
    });

    test("Same Asset One-to-One Transfer add amount ", async () => {
        let wallet = new AtomicalTestWallet()
        let atomicalTxParams = {
            inputs: [
                // atomical token info
                {
                    txId: "6abc1613438645b04435ac887e6e450f6ca57c3648e2091e968bc20a12e94a5e",
                    vOut: 2,
                    amount: 1000,
                    address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
                    data: [
                        {"atomicalId": "8562d04564ac656a5f37b6333956a029fc98ebffffbaed1cfdcb8a7fa0a9030ei0", "type": "NFT"}
                    ] ,// maybe many atomical token
                },
                // gas fee utxo
                {
                    txId: "3362ed55e4aef5ae548ec40ad447bb04996fae405b262b900dbb000aa8f1ead6",
                    vOut: 1,
                    amount: 899994,
                    address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
                },
            ],
            outputs: [
                { // atomical send output
                    address: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
                    amount: 1000,
                    data: [
                        {"atomicalId": "8562d04564ac656a5f37b6333956a029fc98ebffffbaed1cfdcb8a7fa0a9030ei0", "type": "NFT"}
                    ]  
                }
            ],
            changeAddress: "tb1ppfc0mx9j3070zqleu257zt46ch2v9f9n9urkhlg7n7pswcmpqq0qt3pswx",
            feeRate: 1,
            minChangeValue : 100 
        };

        let signParams: SignTxParams = {
            privateKey: curPrivateKey,
            data: atomicalTxParams
        };
        // let txfee = await wallet.estimateFee(signParams);
        // console.log("txfee:",txfee)
        let tx = await wallet.signTransaction(signParams);
        console.info("txraw:",tx)
    }); 
})
import {PINetworks, PIWallet} from "../src/PIWallet";
import {convertWithDecimals} from "../src/utils";

describe("tx", () => {

    it('getNewAddress', async() => {
        let wallet = new PIWallet();
        let addr = await wallet.getNewAddress({privateKey:"SAGYHCI53Z3QG2TGYUIF24BJEKTZSPSQPQ7OW2WULSSTZXJ426THA4GW"});
        expect(addr.address).toEqual("GBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR5OBA");
        expect(addr.publicKey).toEqual("57f45eaa57e8abfb190f400dc03d3f3f22b59e8b6579facdb1fd1df9a5c1c71e");
    });

    it('validPrivateKey', async() => {
        let wallet = new PIWallet();
        let addr = await wallet.validPrivateKey({privateKey:"SAGYHCI53Z3QG2TGYUIF24BJEKTZSPSQPQ7OW2WULSSTZXJ426THA4GW"});
        expect((await wallet.validPrivateKey({privateKey:"SAGYHCI53Z3QG2TGYUIF24BJEKTZSPSQPQ7OW2WULSSTZXJ426THA4GW"})).isValid).toEqual(true)
        expect((await wallet.validPrivateKey({privateKey:"SAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSU2"})).isValid).toEqual(false)
    });

    it('validAddress', async() => {
        let wallet = new PIWallet();
        expect((await wallet.validAddress({address:"GCYXKRRRU2VUDWY7XX3KD7AAK6XCFB2DMXJQGEN2V7TVKQOKKTI6FI4I"})).isValid).toEqual(true)
        expect((await wallet.validAddress({address:"MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAAAB3NQ"})).isValid).toEqual(true)
        expect((await wallet.validAddress({address:""})).isValid).toEqual(false)
        expect((await wallet.validAddress({address:"GCYXKRRRU2VUDWY7XX3KD7AAK6XCFB2DMXJQGEN2V7TVKQOKKTI6FI4A"})).isValid).toEqual(false)
        expect((await wallet.validAddress({address:"MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAAAB3NN"})).isValid).toEqual(false)
    });

    it('convertWithDecimals test', async() => {

        expect(convertWithDecimals("10000000000000000000000000", 7)).toEqual("1000000000000000000.0000000");
        expect(convertWithDecimals("1000000000000000000", 7)).toEqual("100000000000.0000000");
        expect(convertWithDecimals("100000000000", 7)).toEqual("10000.0000000");
        expect(convertWithDecimals("10000000000", 7)).toEqual("1000.0000000");
        expect(convertWithDecimals("1000000000", 7)).toEqual("100.0000000");
        expect(convertWithDecimals("100000000", 7)).toEqual("10.0000000");
        expect(convertWithDecimals("10000000", 7)).toEqual("1.0000000");
        expect(convertWithDecimals("1000000", 7)).toEqual("0.1000000");
        expect(convertWithDecimals("100000", 7)).toEqual("0.0100000");
        expect(convertWithDecimals("100000", 7)).toEqual("0.0100000");
        expect(convertWithDecimals("10000", 7)).toEqual("0.0010000");
        expect(convertWithDecimals("1000", 7)).toEqual("0.0001000");
        expect(convertWithDecimals("100", 7)).toEqual("0.0000100");
        expect(convertWithDecimals("10", 7)).toEqual("0.0000010");
        expect(convertWithDecimals("1", 7)).toEqual("0.0000001");
        expect(convertWithDecimals("0", 7)).toEqual("0");
        expect(convertWithDecimals("1234567", 7)).toEqual("0.1234567");

        expect(()=>convertWithDecimals("0100000", 7)).toThrow("Number should be a positive integer");
        expect(()=>convertWithDecimals("-100000", 7)).toThrow("Number should be a positive integer");
        expect(()=>convertWithDecimals("00", 7)).toThrow("Number should be a positive integer");
    });


    it('getDerivedPrivateKey Mnemonic (12 words)', async() => {
        let wallet = new PIWallet();
        let hdPath = await wallet.getDerivedPath({index:0});
        let privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:hdPath,
        });
        expect(privateKey).toEqual("SDOT7Y64736KFH243N2V7AHHXYS52IMPQFG4GWWDAW7INE7AVA5ZCLIW");
        let addr = await wallet.getNewAddress({privateKey:privateKey});
        expect(addr.address).toEqual("GASWRHYE32A5A27TQWNRITIOZKOX7XQ6IVI4WEDGPVGX253D63UW2GJ3");
        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:1}),
        });
        expect(privateKey).toEqual("SA33RNHU5MUQMHCHGRLSED3SYVXN4JLOP6IYMYIX5VSJAPPZ7DCAMINN");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GBSIS3JSLARC3D5WXRE3343Y2IMQBKRXHPC672RELHWXVUW4QWCWM2UT");
    });

    it('getDerivedPrivateKey Mnemonic (24 words)', async() => {
        let wallet = new PIWallet();
        let hdPath = await wallet.getDerivedPath({index:0});
        let privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"bench hurt jump file august wise shallow faculty impulse spring exact slush thunder author capable act festival slice deposit sauce coconut afford frown better",
            hdPath:hdPath,
        });
        expect(privateKey).toEqual("SCFBFRF4DXG5U7ETQ5CUQEZX5PPPGEU5TUGAQGC7RXZ4TZWYIH55QODV");
        let addr = await wallet.getNewAddress({privateKey:privateKey});
        expect(addr.address).toEqual("GBPPDJUB5Q55COLFHWRQC5YSCLBEXBEQJSGVMPRIB4IZUMKMAZF3RU7W");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"bench hurt jump file august wise shallow faculty impulse spring exact slush thunder author capable act festival slice deposit sauce coconut afford frown better",
            hdPath:await wallet.getDerivedPath({index:1}),
        });
        expect(privateKey).toEqual("SBXOPZCR52Q6FVSDGHEWIIFZ4Q5Z4QZJHHSSTE22TLOMWXYCY3TMDMNM");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GBYPHPQ3KWVESSLRQ73CJZTZI5UH7NY3754Z4O7D3QKR5DETH2A2Z3T7");
    });

    it('getDerivedPrivateKey Mnemonic (12 words) 2', async() => {
        let wallet = new PIWallet();
        let hdPath = await wallet.getDerivedPath({index:0});
        let privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:hdPath,
        });
        expect(privateKey).toEqual("SDOT7Y64736KFH243N2V7AHHXYS52IMPQFG4GWWDAW7INE7AVA5ZCLIW");
        let addr = await wallet.getNewAddress({privateKey:privateKey});
        expect(addr.address).toEqual("GASWRHYE32A5A27TQWNRITIOZKOX7XQ6IVI4WEDGPVGX253D63UW2GJ3");


        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:1}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GBSIS3JSLARC3D5WXRE3343Y2IMQBKRXHPC672RELHWXVUW4QWCWM2UT");


        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:2}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GCJNFX5HCF3FSJGRV365RIJ5USKRGZVRKEST7ARX22HCL2A35INRTHFC");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:3}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GC6TXXAYTMVJI5FWL2RLWXCMNXR4U6LZY5I3MWF4HGS6LSSKGW3MJLH7");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:4}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GCRWJHB66DLWYNLZJXTBITWXBPQN23IWSE7WFK5TMOTG6DPKUWPSEZ5W");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:5}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GCYH7AW3E6EGAYA2DKEX45LVV5JL6OKXUQOPFSMSX2ZZ6CRHFIHQWXQA");


        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:6}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GCR5B3YAWDTZAJSMG5OXVEO7I4IZTM6JB6I73BV4CDWEDCDT65X3SIBM");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:7}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GAEUAWW7SZD2K2CDPWBV2B5BI26BVF25LAUIM2VOE2RRYEWGGEXHADNQ");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:8}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GDNKRKONXENN5F3OEU3HNESRDHQHMMU6Q4TVGAQXVTNY7IGPCOVZWLU3");


        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:9}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GBHZG4NRQIXZYQE7PNHHZ7BN56YSBLYRK6PBFBMMW5MZETO5GEEJRMD7");



        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:10}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GDSMQKAJX5JRNZYLLE25LEGMXVB6RF5KLROP5FFAVKTT4E5Q5B2UM7TN");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:11}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GBCR4NTGQTHMXFODQCXPLQDSN7S7WR4EQ252AQOPIVBOU6LHL37EYZGD");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:12}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GCV42MXCXTKAIDXKKVXBSHH3FOF5OOAOCLQWU4IZUG5JZNHY3LYTESWN");


        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:13}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GBR7QLQOEZGCLY5VHCWH3KJ4NG2K5NKKW3VINBUPKVFEB3LIFZAGFUGK");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:14}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GDLZJUNU2G7JC7DAZZ2IAWAPKPS7OMGW3QGW6K72D7EOG3FNM2ELKQ7D");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:15}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GAVIE5IWOECMLYTRERM7OIXMFKMQQMMWVDTSIVNODP7VNDSIAMZLIDCV");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:16}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GAGYTGNW7X7W73F5FZ32XUUZE2HVKMTZPFC7WZY6DTUTM6J2ECVAYGPK");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:17}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GCGYUZ6CPHIRH3SVAYSUZTAOQNGJIB52QQL7FU7TK7Q2PKFGYVOO4ZVF");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:18}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GCLY54FIH3SPWPXZQIE5ZO5RIQQHIYFOEIEIFM3BUYRCTQPE3S7AKC7K");


        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:19}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GB5ML75QKGKCQEPQRDA6MGQHBYOZNCICDFYJPMBBRJZER6V3Q3C37G6E");
    });

    it('getDerivedPrivateKey Mnemonic (24 words)2', async() => {
        let wallet = new PIWallet();
        const mnemonic = "garment pizza ginger poverty alpha crazy license stamp sick there require tank erode social tiny parent point gown keep ridge key jaguar dog ostrich";
        let hdPath = await wallet.getDerivedPath({index:0});
        let privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:mnemonic,
            hdPath:hdPath,
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GDD2DCVCARGIO7LZA6QWDOMNJ3LUJONFLHW3ATFOWLZEB2NINXZAWQ3N");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:mnemonic,
            hdPath:await wallet.getDerivedPath({index:1}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GBDY7LCKFLMWCXASIES4QVFVZU56FF4Y3E7T4KIMFRDWSWNH57ONK2BE");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:mnemonic,
            hdPath:await wallet.getDerivedPath({index:2}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GBXQEH2ZAEZXWNMHT3XXPCA7LZQSRXZZNJCFQDGJ3YQ6HL4PTR5ZF7DW");


        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:mnemonic,
            hdPath:await wallet.getDerivedPath({index:3}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GBFDWEZY7G467Z34VPC4Z74HKGOJVK3T426FPLVM5RK3Z7I47FU64S4K");


        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:mnemonic,
            hdPath:await wallet.getDerivedPath({index:4}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GDJKD4HKFJ4O3VQO5XG7WQHCRWSWA5HWCXJXQMLWIJTW4PVAO3PVXUAH");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:mnemonic,
            hdPath:await wallet.getDerivedPath({index:5}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GB574GHLLO4WOXGBA5DS7N3SIAQY6Y7MRQX527IWJMHKMX5PPOKQQA4S");


        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:mnemonic,
            hdPath:await wallet.getDerivedPath({index:6}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GCF6GOUNORW6DH5C44W4ATDOF643CAPBCRHOSE4AO7OEF24PR2HWMR5D");


        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:mnemonic,
            hdPath:await wallet.getDerivedPath({index:7}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GDFP35W2THIIAEMM7URMU4U6DLU6N3A6ZYJMIEAUWVCFL4AFBOPK55XI");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:mnemonic,
            hdPath:await wallet.getDerivedPath({index:8}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GA4BJIWIIZTHRIK27WYJVYY5T2GGYZT3NBMAZM5NPP3OQELKPRJJFEKT");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:mnemonic,
            hdPath:await wallet.getDerivedPath({index:9}),
        });
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GBS3UVLW6WANKS427WJPAB7ETGEVG5JOVFEJJ7B55DV57GRFPZMTUCEE");
    });

    it('getMuxedAddress', async() => {
        let wallet = new PIWallet();
        //SAEIGNAR3PVBDLNOBDBVJBSHCOC7ASL7F7MC2MQX537GDG7NESIKPWRQ
        let addr = await wallet.getNewAddress({privateKey:"SAGYHCI53Z3QG2TGYUIF24BJEKTZSPSQPQ7OW2WULSSTZXJ426THA4GW"});
        expect(await wallet.getMuxedAddress({address:addr.address,id:"0"})).toEqual("MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAAAB3NQ");
        expect(await wallet.getMuxedAddress({address:addr.address,id:"1"})).toEqual("MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAAAFL4Q");
        expect(await wallet.getMuxedAddress({address:addr.address,id:"2"})).toEqual("MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAAAI2PQ");
        expect(await wallet.getMuxedAddress({address:addr.address,id:"3"})).toEqual("MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAAAMK6Q");
        expect(await wallet.getMuxedAddress({address:addr.address,id:"4"})).toEqual("MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAAATZJQ");
        expect(await wallet.getMuxedAddress({address:addr.address,id:"5"})).toEqual("MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAAAXJYQ");
        expect(await wallet.getMuxedAddress({address:addr.address,id:"6"})).toEqual("MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAAA2YLQ");
        expect(await wallet.getMuxedAddress({address:addr.address,id:"7"})).toEqual("MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAAA6I2Q");
        expect(await wallet.getMuxedAddress({address:addr.address,id:"8"})).toEqual("MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAABB7FS");
        expect(await wallet.getMuxedAddress({address:addr.address,id:"9"})).toEqual("MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAABFPUS");
        expect(await wallet.getMuxedAddress({address:addr.address,id:"10"})).toEqual("MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAABI6HS");
        expect(await wallet.getMuxedAddress({address:addr.address,id:"11"})).toEqual("MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAABMOWS");
        expect(await wallet.getMuxedAddress({address:addr.address,id:"12"})).toEqual("MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAABT5BS");
        expect(await wallet.getMuxedAddress({address:addr.address,id:"13"})).toEqual("MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAABXNQS");
        expect(await wallet.getMuxedAddress({address:addr.address,id:"14"})).toEqual("MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAAB24DS");
        expect(await wallet.getMuxedAddress({address:addr.address,id:"15"})).toEqual("MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAAB6MSS");
        expect(await wallet.getMuxedAddress({address:addr.address,id:"16"})).toEqual("MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAACBD4U");
        expect(await wallet.getMuxedAddress({address:addr.address,id:"17"})).toEqual("MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAACFTNU");
        expect(await wallet.getMuxedAddress({address:addr.address,id:"18"})).toEqual("MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAACIC6U");
        expect(await wallet.getMuxedAddress({address:addr.address,id:"19"})).toEqual("MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAACMSPU");


        expect(await wallet.getMuxedAddress({address:addr.address,id:"100"})).toEqual("MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAAMRKPI");
        //uint64 max
        expect(await wallet.getMuxedAddress({address:addr.address,id:"18446744073709551615"})).toEqual("MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR57777777777776LX4");

    });

    test("signCommonMsg", async () => {
        let wallet = new PIWallet();
        let sourceSecret ="SD2I2KBXU4I3SL76NBCLCO5NJ3MLRN2XUWXVXKOEHRI7UH3VMNMEPKKQ";
        let sig = await wallet.signCommonMsg({privateKey:sourceSecret, message:{walletId:"123456789"}});
        expect(sig).toEqual("96b95c933157f0f1dcd576e31ac655c935bf18f8d5eb20fea2a0f7fa19ada8c5ab3f3b302240d1775a758814b69c786034da15516e88fa1165d2c6a48716af02")
        sig = await wallet.signCommonMsg({privateKey:sourceSecret, message:{text:"123456789"}});
        expect(sig).toEqual("a0a5d12f74fd3989cd32561322502e21d9e45339552dc04839e92c7bbecde6d5d58409c58369a64a1b27704854496a53cacb78fb42511fd04bdf97dd19723e0f")
    });

    it('signTransaction transfer native token', async() => {
        let wallet = new PIWallet();
        let sourceSecret ="SD2I2KBXU4I3SL76NBCLCO5NJ3MLRN2XUWXVXKOEHRI7UH3VMNMEPKKQ";
        let sourceAddress = await wallet.getNewAddress({privateKey:sourceSecret});

        let addr = await wallet.getNewAddress({privateKey:"SAGYHCI53Z3QG2TGYUIF24BJEKTZSPSQPQ7OW2WULSSTZXJ426THA4GW"});

        let tx = await wallet.signTransaction({
            privateKey:sourceSecret,
            data:{
                type:"transfer",
                source: sourceAddress.address,
                sequence:"659844415619079",
                toAddress:addr.address,
                amount:"1000000",
                fee: "1000000",
                networkPassphrase: PINetworks.TESTNET2,
                decimals:7
            },
        });
        const expected = "AAAAAgAAAACxdUYxpqtB2x+99qH8AFeuIodDZdMDEbqv51VBylTR4gAPQkAAAlggAAAACAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAABX9F6qV+ir+xkPQA3APT8/IrWei2V5+s2x/R35pcHHHgAAAAAAAAAAAA9CQAAAAAAAAAABylTR4gAAAEDJSiiPpW/jBjQ9ae9D09TczaSQciiA1bZb0wkrMxnMWqWWt2zBK82ECa9a7GCkwGt3TYqXsLxrUztkbz9unh0A";
        expect(tx).toEqual(expected)

        expect(await wallet.calcTxHash({data:{
                tx:tx,
                networkPassphrase: PINetworks.TESTNET2,
            }})).toEqual("d2c1c032c755a054c597087b79f5d9c6237e82aa50234a2de1bd2232a496b0fa")
    });

    it('signTransaction transfer native token with memo', async() => {
        let wallet = new PIWallet();
        let sourceSecret ="SD2I2KBXU4I3SL76NBCLCO5NJ3MLRN2XUWXVXKOEHRI7UH3VMNMEPKKQ";
        let sourceAddress = await wallet.getNewAddress({privateKey:sourceSecret});

        let addr = await wallet.getNewAddress({privateKey:"SAGYHCI53Z3QG2TGYUIF24BJEKTZSPSQPQ7OW2WULSSTZXJ426THA4GW"});
        let tx = await wallet.signTransaction({
            privateKey:sourceSecret,
            data:{
                type:"transfer",
                source: sourceAddress.address,
                sequence:"659844415619074",
                toAddress:addr.address,
                amount:"10000000",
                fee: "1000000",
                networkPassphrase: PINetworks.TESTNET2,
                memo:"hello world",
                decimals:7
            },
        });

        const expected = "AAAAAgAAAACxdUYxpqtB2x+99qH8AFeuIodDZdMDEbqv51VBylTR4gAPQkAAAlggAAAAAwAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAtoZWxsbyB3b3JsZAAAAAABAAAAAAAAAAEAAAAAV/Reqlfoq/sZD0ANwD0/PyK1notlefrNsf0d+aXBxx4AAAAAAAAAAACYloAAAAAAAAAAAcpU0eIAAABAd3z+eCU9Aen4mA+kSqahxbarFWu+V832qnxjSWHvZouTtxQBdjxwVBX6maT2mW/vCH0vJ7ObyZjfdqDCckIDBg==";
        expect(tx).toEqual(expected)
    });

    it('signTransaction transfer native token with muxedAddress', async() => {
        let wallet = new PIWallet();
        let sourceSecret ="SD2I2KBXU4I3SL76NBCLCO5NJ3MLRN2XUWXVXKOEHRI7UH3VMNMEPKKQ";
        let sourceAddress = await wallet.getNewAddress({privateKey:sourceSecret});
        //GCYXKRRRU2VUDWY7XX3KD7AAK6XCFB2DMXJQGEN2V7TVKQOKKTI6FI4I

        let addr = await wallet.getNewAddress({privateKey:"SAGYHCI53Z3QG2TGYUIF24BJEKTZSPSQPQ7OW2WULSSTZXJ426THA4GW"});
        //GBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR5OBA
        let muxedAddress = await wallet.getMuxedAddress({address:addr.address,id:"0"});

        //MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAAAB3NQ

        let tx = await wallet.signTransaction({
            privateKey:sourceSecret,
            data:{
                type:"transfer",
                source: sourceAddress.address,
                sequence:"659844415619081",
                toAddress:muxedAddress,
                amount:"10000000",
                fee: "1000000",
                networkPassphrase: PINetworks.TESTNET2,
                memo:"1",
                decimals:7
            },
        });
        //https://blockexplorer.minepi.com/testnet2/tx/1c32f1b16a97b0fd40141c8e879f345b82a763efa23c1edadcb3ff0d167f1b21
        const expected = "AAAAAgAAAACxdUYxpqtB2x+99qH8AFeuIodDZdMDEbqv51VBylTR4gAPQkAAAlggAAAACgAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAExAAAAAAAAAQAAAAAAAAABAAABAAAAAAAAAAAAV/Reqlfoq/sZD0ANwD0/PyK1notlefrNsf0d+aXBxx4AAAAAAAAAAACYloAAAAAAAAAAAcpU0eIAAABA6j60gH1Nj5RWEpzvUesvUZ2gmWvU9o1muxKh4g4BaHvXlPfnL6Z/BUsjKJe6+8wj0meLCop9PH2xyWcHNqCNDQ==";
        expect(tx).toEqual(expected)
    });

    it('signTransaction create trustline for non-native asset', async() => {
        let wallet = new PIWallet();
        let sourceSecret ="SD2I2KBXU4I3SL76NBCLCO5NJ3MLRN2XUWXVXKOEHRI7UH3VMNMEPKKQ";
        let sourceAddress = await wallet.getNewAddress({privateKey:sourceSecret});
        //GCYXKRRRU2VUDWY7XX3KD7AAK6XCFB2DMXJQGEN2V7TVKQOKKTI6FI4I

        let userSecret = "SAGYHCI53Z3QG2TGYUIF24BJEKTZSPSQPQ7OW2WULSSTZXJ426THA4GW";
        let addr = await wallet.getNewAddress({privateKey:userSecret});
        //GBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR5OBA
        //创建trustline
        let tx = await wallet.signTransaction({
            privateKey:userSecret,
            data:{
                type:"changeTrust",
                source: addr.address,
                sequence:"689097437872129",
                fee: "100",
                networkPassphrase: PINetworks.TESTNET2,
                asset:{
                    assetName:'USDT',
                    issuer:sourceAddress.address,
                    amount:"10000000000"
                },
                decimals:7
            },
        });
        const expected = "AAAAAgAAAABX9F6qV+ir+xkPQA3APT8/IrWei2V5+s2x/R35pcHHHgAAAGQAAnK7AAAAAgAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAABgAAAAFVU0RUAAAAALF1RjGmq0HbH732ofwAV64ih0Nl0wMRuq/nVUHKVNHiAAAAAlQL5AAAAAAAAAAAAaXBxx4AAABAXxF6ppZsC0gVovzZQCPSj5o+eNB721RSL5IkdULeOxYSSyKY5w9oIFrsLvaB72ZVoeMqkA/PhCC77aB/T3MlAQ==";
        expect(tx).toEqual(expected)
    });

    it('signTransaction transfer non-native asset', async() => {
        //https://blockexplorer.minepi.com/testnet2/tx/a7270a4bb12e69abd1a5a89a57855e303bf3735de5e8c18025375e516b3548d2
        let wallet = new PIWallet();
        let sourceSecret ="SD2I2KBXU4I3SL76NBCLCO5NJ3MLRN2XUWXVXKOEHRI7UH3VMNMEPKKQ";
        let sourceAddress = await wallet.getNewAddress({privateKey:sourceSecret});
        //GCYXKRRRU2VUDWY7XX3KD7AAK6XCFB2DMXJQGEN2V7TVKQOKKTI6FI4I

        let userSecret = "SAGYHCI53Z3QG2TGYUIF24BJEKTZSPSQPQ7OW2WULSSTZXJ426THA4GW";
        let addr = await wallet.getNewAddress({privateKey:userSecret});
        //GBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR5OBA
        // let userAccount = new Account(addr.address,"2085700543447040");

        let tx = await wallet.signTransaction({
            privateKey:sourceSecret,
            data:{
                type:"transfer",
                source: sourceAddress.address,
                sequence:"659844415619080",
                toAddress:addr.address,
                asset:{
                    assetName:"USD",
                    issuer:sourceAddress.address,
                    amount:"1000000000",
                },
                fee: "1000000",
                networkPassphrase: PINetworks.TESTNET2,
                memo:"1",
                decimals:7
            },
        });
        const expected = "AAAAAgAAAACxdUYxpqtB2x+99qH8AFeuIodDZdMDEbqv51VBylTR4gAPQkAAAlggAAAACQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAExAAAAAAAAAQAAAAAAAAABAAAAAFf0XqpX6Kv7GQ9ADcA9Pz8itZ6LZXn6zbH9HfmlwcceAAAAAVVTRAAAAAAAsXVGMaarQdsfvfah/ABXriKHQ2XTAxG6r+dVQcpU0eIAAAAAO5rKAAAAAAAAAAABylTR4gAAAECS6VloevuF/O1pEhyeQKday1af2Vpnor2h/dVh3fzAsxHdBCJWkXc4fqtE2d11zdTR1I+gP8yFr1E85PTt1wkA";
        expect(tx).toEqual(expected)
    });

})

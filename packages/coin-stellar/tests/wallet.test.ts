import {StellarTxParam, StellarWallet} from "../src";
import {Account, Asset, Networks, Operation, xdr} from "../src/stellar_base";
import {Memo} from "../src/stellar_base";

describe("tx", () => {

    it('getRandomPrivateKey', async() => {
        let wallet = new StellarWallet();
        let addr = await wallet.getNewAddress({privateKey:"SAGYHCI53Z3QG2TGYUIF24BJEKTZSPSQPQ7OW2WULSSTZXJ426THA4GW"});
        expect(addr.address).toEqual("GBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR5OBA");
        expect(addr.publicKey).toEqual("57f45eaa57e8abfb190f400dc03d3f3f22b59e8b6579facdb1fd1df9a5c1c71e");
        expect((await wallet.validAddress({address:addr.address})).isValid).toEqual(true);
        expect((await wallet.validPrivateKey({privateKey:"SAGYHCI53Z3QG2TGYUIF24BJEKTZSPSQPQ7OW2WULSSTZXJ426THA4GW"})).isValid).toEqual(true);
        expect((await wallet.validPrivateKey({privateKey:"SAGYHCI53Z3QG2TGYUIF24BJEKTZSPSQPQ7OW2WULSSTZXJ426THA4GA"})).isValid).toEqual(false);
    });

    it('getDerivedPrivateKey Mnemonic (12 words)', async() => {
        let wallet = new StellarWallet();
        let hdPath = await wallet.getDerivedPath({index:0});
        let privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:hdPath,
        });
        expect(privateKey).toEqual("SBGWSG6BTNCKCOB3DIFBGCVMUPQFYPA2G4O34RMTB343OYPXU5DJDVMN");
        let addr = await wallet.getNewAddress({privateKey:privateKey});
        expect(addr.address).toEqual("GDRXE2BQUC3AZNPVFSCEZ76NJ3WWL25FYFK6RGZGIEKWE4SOOHSUJUJ6");


        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:1}),
        });
        expect(privateKey).toEqual("SCEPFFWGAG5P2VX5DHIYK3XEMZYLTYWIPWYEKXFHSK25RVMIUNJ7CTIS");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GBAW5XGWORWVFE2XTJYDTLDHXTY2Q2MO73HYCGB3XMFMQ562Q2W2GJQX");



        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:2}),
        });
        expect(privateKey).toEqual("SDAILLEZCSA67DUEP3XUPZJ7NYG7KGVRM46XA7K5QWWUIGADUZCZWTJP");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GAY5PRAHJ2HIYBYCLZXTHID6SPVELOOYH2LBPH3LD4RUMXUW3DOYTLXW");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:3}),
        });
        expect(privateKey).toEqual("SBMWLNV75BPI2VB4G27RWOMABVRTSSF7352CCYGVELZDSHCXWCYFKXIX");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GAOD5NRAEORFE34G5D4EOSKIJB6V4Z2FGPBCJNQI6MNICVITE6CSYIAE");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:4}),
        });
        expect(privateKey).toEqual("SCPCY3CEHMOP2TADSV2ERNNZBNHBGP4V32VGOORIEV6QJLXD5NMCJUXI");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GBCUXLFLSL2JE3NWLHAWXQZN6SQC6577YMAU3M3BEMWKYPFWXBSRCWV4");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:5}),
        });
        expect(privateKey).toEqual("SCK27SFHI3WUDOEMJREV7ZJQG34SCBR6YWCE6OLEXUS2VVYTSNGCRS6X");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GBRQY5JFN5UBG5PGOSUOL4M6D7VRMAYU6WW2ZWXBMCKB7GPT3YCBU2XZ");



        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:6}),
        });
        expect(privateKey).toEqual("SDJ4WDPOQAJYR3YIAJOJP3E6E4BMRB7VZ4QAEGCP7EYVDW6NQD3LRJMZ");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GBY27SJVFEWR3DUACNBSMJB6T4ZPR4C7ZXSTHT6GMZUDL23LAM5S2PQX");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:7}),
        });
        expect(privateKey).toEqual("SA3HXJUCE2N27TBIZ5JRBLEBF3TLPQEBINP47E6BTMIWW2RJ5UKR2B3L");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GAY7T23Z34DWLSTEAUKVBPHHBUE4E3EMZBAQSLV6ZHS764U3TKUSNJOF");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:8}),
        });
        expect(privateKey).toEqual("SCD5OSHUUC75MSJG44BAT3HFZL2HZMMQ5M4GPDL7KA6HJHV3FLMUJAME");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GDJTCF62UUYSAFAVIXHPRBR4AUZV6NYJR75INVDXLLRZLZQ62S44443R");


        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:9}),
        });
        expect(privateKey).toEqual("SCJGVMJ66WAUHQHNLMWDFGY2E72QKSI3XGSBYV6BANDFUFE7VY4XNXXR");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GBTVYYDIYWGUQUTKX6ZMLGSZGMTESJYJKJWAATGZGITA25ZB6T5REF44");



        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:10}),
        });
        expect(privateKey).toEqual("SBTVMFG422YMFZLY5LZ6GEQVNSD53YAPGZMGGSW6SU2AMZUHNVBEN2CJ");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GDY2KYHZA3LTLRVOYGBVZLXUM7MYKC4USGJ4SDK7TVMOXLEIGWHG4GMS");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:11}),
        });
        expect(privateKey).toEqual("SAS52QDDVJNRSBGN6JXSJ3AT2CLGOB62TCQHDFY7XQNQSAUEW6TV5NGY");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GBZOTWXCPU2ZGPF3TL3PEIB7E6F5IYIYPVQTVITKTCQGYMCSXVA6NWQN");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:12}),
        });
        expect(privateKey).toEqual("SBDBEDJMBWHGMWX3SCV6QEGNDZ5FJMJT3SXO7TPOI736LJUCMGE7QYCK");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GCNNPQSO3D76JQ2DHT7M6SNWIA35GX2STKEOWPPJTWRKBJ4N44EYJK2K");


        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:13}),
        });
        expect(privateKey).toEqual("SDH2JBSCMQIPK5A7QEEGKJRYBEAJX2DB3UX5GWRVYWUZOFZ54KNA2FFB");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GDV2LA3XKRXWNX6S4FILCKOB4ZG577NNZYNA5JOFOUVWZ2F7NHEXWJAY");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:14}),
        });
        expect(privateKey).toEqual("SCVS7ODCLUQUAU3NLNPHEBNT2K5CI4OHZ2D2FZHPP67ZMSIBN3YMKO3F");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GCNTUN4RBPBNHFD5QDLTZRNUVFNYLA4QXUUYU2OWPQJLZO6QXGYFIPLL");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:15}),
        });
        expect(privateKey).toEqual("SB3V5T7WYQYSXT4ANRAYHDP335XOYBPFGD64NIWHDOBGUYK7KEZH75NE");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GDWESBQYW5CPEL7R32TDIA7XGKUFMSLIL3JZSUBSPX5BQFONI5I6RCRZ");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:16}),
        });
        expect(privateKey).toEqual("SCCEKA5SMCT53WAZML5IQVM4FJO4LMYHE7RWKKLEDB4C65XOIJZWUYXY");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GDSQPXNCB3WNQY724CTGWDVW4SVD7TP66KXUHOIFLAQCRJQRDGTWLNM6");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:17}),
        });
        expect(privateKey).toEqual("SB2UZ5AAWXBRLIJDETQAEDRJ3UCSB3EQNWGEFEHPL2BCPHLTRTUG5NFT");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GBQ4EJ42QC2XJQYD6H2NCNF5TDQX6XK3VZL5MUNREUJA24PWZIQSYVEU");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:18}),
        });
        expect(privateKey).toEqual("SCDTRP567E7O5DAIBKLGKGJIWMNCK3R4UCQQJYJKB56AYUHD52ZSIXB4");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GCHVF35GQBB7ET6DHHXP3WLCO6XH3APHHTW5VSQDXNM3LACQVP3O74AK");


        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"illness spike retreat truth genius clock brain pass fit cave bargain toe",
            hdPath:await wallet.getDerivedPath({index:19}),
        });
        expect(privateKey).toEqual("SDFYYK43KUBWGE5L7FBNNJ7VB7AZBG3KW23NWKHT44CMP6GVFGQ75K7D");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GCODYLFQ43GLR5ZBDVLH274NJL6FSER6ERWOREEYVOIKZJZVGMEC5B4R");
    });

    it('getDerivedPrivateKey Mnemonic (24 words)', async() => {
        let wallet = new StellarWallet();
        let hdPath = await wallet.getDerivedPath({index:0});
        let privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"bench hurt jump file august wise shallow faculty impulse spring exact slush thunder author capable act festival slice deposit sauce coconut afford frown better",
            hdPath:hdPath,
        });
        expect(privateKey).toEqual("SAEWIVK3VLNEJ3WEJRZXQGDAS5NVG2BYSYDFRSH4GKVTS5RXNVED5AX7");
        let addr = await wallet.getNewAddress({privateKey:privateKey});
        expect(addr.address).toEqual("GC3MMSXBWHL6CPOAVERSJITX7BH76YU252WGLUOM5CJX3E7UCYZBTPJQ");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"bench hurt jump file august wise shallow faculty impulse spring exact slush thunder author capable act festival slice deposit sauce coconut afford frown better",
            hdPath:await wallet.getDerivedPath({index:1}),
        });
        expect(privateKey).toEqual("SBKSABCPDWXDFSZISAVJ5XKVIEWV4M5O3KBRRLSPY3COQI7ZP423FYB4");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GB3MTYFXPBZBUINVG72XR7AQ6P2I32CYSXWNRKJ2PV5H5C7EAM5YYISO");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"bench hurt jump file august wise shallow faculty impulse spring exact slush thunder author capable act festival slice deposit sauce coconut afford frown better",
            hdPath:await wallet.getDerivedPath({index:2}),
        });
        expect(privateKey).toEqual("SD5CCQAFRIPB3BWBHQYQ5SC66IB2AVMFNWWPBYGSUXVRZNCIRJ7IHESQ");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GDYF7GIHS2TRGJ5WW4MZ4ELIUIBINRNYPPAWVQBPLAZXC2JRDI4DGAKU");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"bench hurt jump file august wise shallow faculty impulse spring exact slush thunder author capable act festival slice deposit sauce coconut afford frown better",
            hdPath:await wallet.getDerivedPath({index:3}),
        });
        expect(privateKey).toEqual("SBSGSAIKEF7JYQWQSGXKB4SRHNSKDXTEI33WZDRR6UHYQCQ5I6ZGZQPK");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GAFLH7DGM3VXFVUID7JUKSGOYG52ZRAQPZHQASVCEQERYC5I4PPJUWBD");


        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"bench hurt jump file august wise shallow faculty impulse spring exact slush thunder author capable act festival slice deposit sauce coconut afford frown better",
            hdPath:await wallet.getDerivedPath({index:4}),
        });
        expect(privateKey).toEqual("SBIZH53PIRFTPI73JG7QYA3YAINOAT2XMNAUARB3QOWWVZVBAROHGXWM");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GAXG3LWEXWCAWUABRO6SMAEUKJXLB5BBX6J2KMHFRIWKAMDJKCFGS3NN");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"bench hurt jump file august wise shallow faculty impulse spring exact slush thunder author capable act festival slice deposit sauce coconut afford frown better",
            hdPath:await wallet.getDerivedPath({index:5}),
        });
        expect(privateKey).toEqual("SCVM6ZNVRUOP4NMCMMKLTVBEMAF2THIOMHPYSSMPCD2ZU7VDPARQQ6OY");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GA6RUD4DZ2NEMAQY4VZJ4C6K6VSEYEJITNSLUQKLCFHJ2JOGC5UCGCFQ");


        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"bench hurt jump file august wise shallow faculty impulse spring exact slush thunder author capable act festival slice deposit sauce coconut afford frown better",
            hdPath:await wallet.getDerivedPath({index:6}),
        });
        expect(privateKey).toEqual("SBSHUZQNC45IAIRSAHMWJEJ35RY7YNW6SMOEBZHTMMG64NKV7Y52ZEO2");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GCUDW6ZF5SCGCMS3QUTELZ6LSAH6IVVXNRPRLAUNJ2XYLCA7KH7ZCVQS");


        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"bench hurt jump file august wise shallow faculty impulse spring exact slush thunder author capable act festival slice deposit sauce coconut afford frown better",
            hdPath:await wallet.getDerivedPath({index:7}),
        });
        expect(privateKey).toEqual("SC2QO2K2B4EBNBJMBZIKOYSHEX4EZAZNIF4UNLH63AQYV6BE7SMYWC6E");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GBJ646Q524WGBN5X5NOAPIF5VQCR2WZCN6QZIDOSY6VA2PMHJ2X636G4");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"bench hurt jump file august wise shallow faculty impulse spring exact slush thunder author capable act festival slice deposit sauce coconut afford frown better",
            hdPath:await wallet.getDerivedPath({index:8}),
        });
        expect(privateKey).toEqual("SCGMC5AHAAVB3D4JXQPCORWW37T44XJZUNPEMLRW6DCOEARY3H5MAQST");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GDHX4LU6YBSXGYTR7SX2P4ZYZSN24VXNJBVAFOB2GEBKNN3I54IYSRM4");

        privateKey = await wallet.getDerivedPrivateKey({
            mnemonic:"bench hurt jump file august wise shallow faculty impulse spring exact slush thunder author capable act festival slice deposit sauce coconut afford frown better",
            hdPath:await wallet.getDerivedPath({index:9}),
        });
        expect(privateKey).toEqual("SCPA5OX4EYINOPAUEQCPY6TJMYICUS5M7TVXYKWXR3G5ZRAJXY3C37GF");
        expect((await wallet.getNewAddress({privateKey:privateKey})).address).toEqual("GDXOY6HXPIDT2QD352CH7VWX257PHVFR72COWQ74QE3TEV4PK2KCKZX7");
    });

    it('getMuxedAddress', async() => {
        let wallet = new StellarWallet();
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


    it('signTransaction transfer native token', async() => {
        let wallet = new StellarWallet();
        let sourceSecret ="SCPVS2UMH4EPBAZPEQXGSC7OMNJTTS5STD7EIDL4OEJW2HYHES7DNUJ4";
        let sourceAddress = await wallet.getNewAddress({privateKey:sourceSecret});
        let addr = await wallet.getNewAddress({privateKey:"SAGYHCI53Z3QG2TGYUIF24BJEKTZSPSQPQ7OW2WULSSTZXJ426THA4GW"});
        let tx = await wallet.signTransaction({
            privateKey:sourceSecret,
            data:{
                type:"transfer",
                source: sourceAddress.address,
                sequence:"2077119198789635",
                toAddress:addr.address,
                amount:"10000000",
                fee: "100",
                networkPassphrase: Networks.TESTNET,
                decimals:7
            },
        });
        const expected = "AAAAAgAAAABAHMhZ42KL0uN8Frv19HEpSZ59UUvBy5z5opuMNgb1lwAAAGQAB2EhAAAABAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAABX9F6qV+ir+xkPQA3APT8/IrWei2V5+s2x/R35pcHHHgAAAAAAAAAAAJiWgAAAAAAAAAABNgb1lwAAAEB3OYJmqalDj/+o51UFjVr66KiDSnyCgIEmTeY6nimeQCIdohbz+lu9WO/TFvvd7iSkz/tW6+2qEZFZKiwAjRIF";
        expect(tx).toEqual(expected)
    });

    it('signTransaction transfer native token with memo', async() => {
        let wallet = new StellarWallet();
        let sourceSecret ="SCPVS2UMH4EPBAZPEQXGSC7OMNJTTS5STD7EIDL4OEJW2HYHES7DNUJ4";
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
                fee: "100",
                networkPassphrase: Networks.TESTNET,
                memo:"hello world",
                decimals:7
            },
        });

        const expected = "AAAAAgAAAABAHMhZ42KL0uN8Frv19HEpSZ59UUvBy5z5opuMNgb1lwAAAGQAAlggAAAAAwAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAtoZWxsbyB3b3JsZAAAAAABAAAAAAAAAAEAAAAAV/Reqlfoq/sZD0ANwD0/PyK1notlefrNsf0d+aXBxx4AAAAAAAAAAACYloAAAAAAAAAAATYG9ZcAAABAK77nnYoU09ldRIUnva+GUXwpDrigCt06WnSvxkHmcyKl/9ZbtgeCmAUdFo3bQkcKdn0A+LQhq/evUucL0SaoDw==";
        expect(tx).toEqual(expected)
    });

    it('signTransaction transfer native token with muxedAddress', async() => {
        let wallet = new StellarWallet();
        let sourceSecret ="SCPVS2UMH4EPBAZPEQXGSC7OMNJTTS5STD7EIDL4OEJW2HYHES7DNUJ4";
        let sourceAddress = await wallet.getNewAddress({privateKey:sourceSecret});

        let addr = await wallet.getNewAddress({privateKey:"SAGYHCI53Z3QG2TGYUIF24BJEKTZSPSQPQ7OW2WULSSTZXJ426THA4GW"});
        //GBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR5OBA
        let muxedAddress = await wallet.getMuxedAddress({address:addr.address,id:"0"});

        //MBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR4AAAAAAAAAAAAB3NQ
        let tx = await wallet.signTransaction({
            privateKey:sourceSecret,
            data:{
                type:"transfer",
                source: sourceAddress.address,
                sequence:"2077119198789636",
                toAddress:addr.address,
                amount:"10000000",
                fee: "100",
                networkPassphrase: Networks.TESTNET,
                memo:"1",
                decimals:7
            },
        });
        const expected = "AAAAAgAAAABAHMhZ42KL0uN8Frv19HEpSZ59UUvBy5z5opuMNgb1lwAAAGQAB2EhAAAABQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAExAAAAAAAAAQAAAAAAAAABAAAAAFf0XqpX6Kv7GQ9ADcA9Pz8itZ6LZXn6zbH9HfmlwcceAAAAAAAAAAAAmJaAAAAAAAAAAAE2BvWXAAAAQL6t0R6Eps+j091ZJNEm6T9TraDpf+ODgoROIIDFti1cTf5+an+sSjdQ0igMCwOyhYNmb9PMtedgYZrxrtGDJgA=";
        expect(tx).toEqual(expected)
    });

    it('signTransaction create trustline for non-native asset', async() => {
        let wallet = new StellarWallet();
        let sourceSecret ="SCPVS2UMH4EPBAZPEQXGSC7OMNJTTS5STD7EIDL4OEJW2HYHES7DNUJ4";
        let sourceAddress = await wallet.getNewAddress({privateKey:sourceSecret});
        //GBABZSCZ4NRIXUXDPQLLX5PUOEUUTHT5KFF4DS447GRJXDBWA32ZOJFW

        let userSecret = "SAGYHCI53Z3QG2TGYUIF24BJEKTZSPSQPQ7OW2WULSSTZXJ426THA4GW";
        let addr = await wallet.getNewAddress({privateKey:userSecret});
        //GBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR5OBA
        let tx = await wallet.signTransaction({
            privateKey:userSecret,
            data:{
                type:"changeTrust",
                source: addr.address,
                sequence:"4402770975129600",
                fee: "100",
                networkPassphrase: Networks.TESTNET,
                asset:{
                    assetName:'USDT',
                    issuer:sourceAddress.address,
                    amount:"10000000000"
                },
                memo:"1",
                decimals:7
            },
        });
        const expected = "AAAAAgAAAABX9F6qV+ir+xkPQA3APT8/IrWei2V5+s2x/R35pcHHHgAAAGQAD6RMAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAExAAAAAAAAAQAAAAAAAAAGAAAAAVVTRFQAAAAAQBzIWeNii9LjfBa79fRxKUmefVFLwcuc+aKbjDYG9ZcAAAACVAvkAAAAAAAAAAABpcHHHgAAAEBOvQPRVYK7E9fLkkPcb1vvkj51Ei8J6fTC8srbnLf3vzTydZHcQOzscvYsd2Ho1u/ukxJ1AJmnMHB6+Hnn7SMI";
        expect(tx).toEqual(expected)
    });

    it('signTransaction transfer non-native asset', async() => {
        let wallet = new StellarWallet();
        let sourceSecret ="SCPVS2UMH4EPBAZPEQXGSC7OMNJTTS5STD7EIDL4OEJW2HYHES7DNUJ4";
        let sourceAddress = await wallet.getNewAddress({privateKey:sourceSecret});
        //GBABZSCZ4NRIXUXDPQLLX5PUOEUUTHT5KFF4DS447GRJXDBWA32ZOJFW

        let userSecret = "SAGYHCI53Z3QG2TGYUIF24BJEKTZSPSQPQ7OW2WULSSTZXJ426THA4GW";
        let addr = await wallet.getNewAddress({privateKey:userSecret});
        //GBL7IXVKK7UKX6YZB5AA3QB5H47SFNM6RNSXT6WNWH6R36NFYHDR5OBA

        let tx = await wallet.signTransaction({
            privateKey:sourceSecret,
            data:{
                type:"transfer",
                source: sourceAddress.address,
                sequence:"2077119198789637",
                toAddress:addr.address,
                fee: "100",
                networkPassphrase: Networks.TESTNET,
                asset:{
                    assetName:"USD",
                    issuer:sourceAddress.address,
                    amount:"1000000000",
                },
                memo:"1",
                decimals:7
            },
        });
        const expected = "AAAAAgAAAABAHMhZ42KL0uN8Frv19HEpSZ59UUvBy5z5opuMNgb1lwAAAGQAB2EhAAAABgAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAExAAAAAAAAAQAAAAAAAAABAAAAAFf0XqpX6Kv7GQ9ADcA9Pz8itZ6LZXn6zbH9HfmlwcceAAAAAVVTRAAAAAAAQBzIWeNii9LjfBa79fRxKUmefVFLwcuc+aKbjDYG9ZcAAAAAO5rKAAAAAAAAAAABNgb1lwAAAEDuIQr7l4tQFrvBPSESmVN6FcRoTVX7HbXMeeiOjlo1y4UQNMn97vlTDZpG6IgR3PmD4RRgsppkt0NZKR+1zt4I";
        expect(tx).toEqual(expected)
    });

})
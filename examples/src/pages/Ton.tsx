import {VStack} from "@chakra-ui/react";
import {useState} from "react";
import TonPrivateKey from "../components/TonPrivateKey";
import {TonWallet} from "@okxweb3/coin-ton";
import TonSignTx from "../components/TonSignTx";
import TonSignJettonTx from "../components/TonSignJettonTx";


export default function Ton() {
    const [privateKey, setPrivateKey] = useState("49c0722d56d6bac802bdf5c480a17c870d1d18bc4355d8344aa05390eb778280")
    const wallet = new TonWallet()

    return (
        <VStack spacing={2} align="center" justify={"center"}  >
            <TonPrivateKey wallet={wallet} privateKey={privateKey} setPrivateKey={setPrivateKey}/>
            <TonSignTx wallet={wallet} privateKey={privateKey}/>
            <TonSignJettonTx wallet={wallet} privateKey={privateKey}/>
        </VStack>
    );
}
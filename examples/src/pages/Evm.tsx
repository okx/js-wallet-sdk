import {VStack} from "@chakra-ui/react";
import {EthWallet} from "@okxweb3/coin-ethereum";
import React, {useState} from "react";
import EvmPrivateKey from "../components/EvmPrivateKey";
import EvmSignLegacyTx from "../components/EvmSignLegacyTx";
import EvmSignLegacyTokenTx from "../components/EvmSignLegacyTokenTx";
import EvmSignEIP1559TokenTx from "../components/EvmSignEIP1559TokenTx";
import EvmSignEIP1559Tx from "../components/EvmSignEIP1559Tx";
import EvmSignTypedMessage from "../components/EvmSignTypedMessage";
import EvmSignMessage from "../components/EvmSignMessage";


export default function Evm() {
    const [privateKey, setPrivateKey] = useState("0x49c0722d56d6bac802bdf5c480a17c870d1d18bc4355d8344aa05390eb778280")
    const wallet = new EthWallet()

    return (

        <VStack spacing={2} align="center" justify={"center"}  >
            <EvmPrivateKey wallet={wallet} privateKey={privateKey} setPrivateKey={setPrivateKey}/>
            <EvmSignLegacyTx wallet={wallet} privateKey={privateKey}/>
            <EvmSignLegacyTokenTx wallet={wallet} privateKey={privateKey}/>
            <EvmSignEIP1559Tx wallet={wallet} privateKey={privateKey}/>
            <EvmSignEIP1559TokenTx wallet={wallet} privateKey={privateKey}/>
            <EvmSignMessage privateKey={privateKey} wallet={wallet}/>
            <EvmSignTypedMessage privateKey={privateKey} wallet={wallet}/>
        </VStack>
    );
}
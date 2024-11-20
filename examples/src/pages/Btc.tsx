import { Box, VStack} from "@chakra-ui/react";
import {useState} from "react";
import BtcSignTx from "../components/BtcSignTx";
import {BtcWallet} from "@okxweb3/coin-bitcoin";
import {BitcoinWallets} from "../components/types";
import BtcPrivateKey from "../components/BtcPrivateKey";


export default function Btc() {
    const [privateKey, setPrivateKey] = useState("L2Nk86vWbm8eETtJa8N6DCeejRRJkjcHuYufkMq4A8sCLroS1rKU")
    const [wallet, setWallet] = useState<BitcoinWallets>(new BtcWallet())


    return (
        <Box>
            <VStack bg={"gray.100"} spacing={2} align="center" justify={"center"}  >
                <BtcPrivateKey wallet={wallet} setWallet={setWallet} privateKey={privateKey} setPrivateKey={setPrivateKey}/>
                <BtcSignTx privateKey={privateKey} wallet={wallet}/>
            </VStack>
        </Box>
    );

}
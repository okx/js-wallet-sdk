import React, { useState } from 'react';
import {
    Button,
    Heading,
} from "@chakra-ui/react";
import {TransactionFormProps} from "./types";
import SignOutput from "./SignedOutput";
import FormTextarea from "./FormTextarea";
import Box100 from "./Box100";


const EvmSignTypedMessage: React.FC<TransactionFormProps> = (props) => {
    const [message, setMessage] = useState<string>('')
    const [data, setData] = useState<{message: string, type: number}>({message:`{"domain":{"name":"EtchMarket","version":"1","chainId":1,"verifyingContract":"0x57b8792c775d34aa96092400983c3e112fcbc296"},"primaryType":"EthscriptionOrder","types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"EthscriptionOrder":[{"name":"signer","type":"address"},{"name":"creator","type":"address"},{"name":"ethscriptionId","type":"bytes32"},{"name":"quantity","type":"uint256"},{"name":"currency","type":"address"},{"name":"price","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"startTime","type":"uint64"},{"name":"endTime","type":"uint64"},{"name":"protocolFeeDiscounted","type":"uint16"},{"name":"creatorFee","type":"uint16"},{"name":"params","type":"bytes"}]},"message":{"signer":"0x7bbc6cf96b7faa0c1f8acc9a5ab383fe8dc507bc","creator":"0x57b8792c775d34aa96092400983c3e112fcbc296","quantity":"1000","ethscriptionId":"0x78e7b34c766c6a174340ef2687732b68649d2bd722351d2ef10de0ea23182ec5","currency":"0x0000000000000000000000000000000000000000","price":"1890000000000000","nonce":"1","startTime":1696786756,"endTime":1699378756,"protocolFeeDiscounted":200,"creatorFee":0,"params":"0x"}}`, type:4})
    const [tx, setTx] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const  tx = await props.wallet.signMessage({privateKey: props.privateKey, data})
        setTx(tx)
        setScroll(true)
    };

    const [scroll, setScroll] = useState(false);
    return (
        <Box100 scroll={scroll} setScroll={setScroll}>
            <Heading marginBottom="5">Sign Typed Message</Heading>
            <FormTextarea name={"message"} data={data} setData={setData} rows={20} format={true}></FormTextarea>
            <Button onClick={handleSubmit} type="submit" colorScheme="blue" width="full">
                Sign Transaction
            </Button>
            <SignOutput name={"Signature"} output={tx}/>
        </Box100>
    );
};

export default EvmSignTypedMessage;

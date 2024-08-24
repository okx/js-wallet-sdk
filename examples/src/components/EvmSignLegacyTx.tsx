import React, { useState } from 'react';
import {
    Alert, AlertIcon,
    Button,
    Heading, Link,
    Text, useToast,
    VStack
} from "@chakra-ui/react";
import Box100 from "./Box100";
import FormInput from "./FormInput";
import {TransactionFormProps, EvmTxData} from "./types";
import SignedOutput from "./SignedOutput";
import {errorToast, successToast} from "./toast";


const EvmSignLegacyTx: React.FC<TransactionFormProps> = (props) => {
    const toast = useToast()

    const [txData, setTxData] = useState<EvmTxData>({
        to: '0xd74c65ad81aa8537327e9ba943011a8cec7a7b6b',
        value: '0',
        nonce: '5',
        gasPrice: '100000000000',
        gasLimit: '21000',
        chainId: '42',
        data: '',
    });
    const [tx, setTx] = useState('')


    const [scroll, setScroll] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        props.wallet.signTransaction({privateKey: props.privateKey, data: txData})
            .then(data => {
                setTx(data)
                setScroll(true);
                successToast(toast, "Sign Tx Success")
            })
            .catch(e => {
                setTx('')
                errorToast(toast, e)
            })
    };
    return (
        <Box100 scroll={scroll} setScroll={setScroll}>
            <Heading marginBottom="5">Sign Legacy Transaction</Heading>
            <VStack spacing={2} align="stretch" w={"100%"}>
                <Alert status='info'>
                    <AlertIcon />
                    <Text>
                        You may broadcast your transactions at {' '}
                        <Link href={"https://etherscan.io/pushTx" } isExternal color="teal.500">
                            https://etherscan.io/pushTx
                        </Link>
                        {' '} for Ethereum mainnet transactions
                    </Text>
                </Alert>
                <FormInput name={"to"} data={txData} setData={setTxData}/>
                <FormInput name={"value"} data={txData} setData={setTxData}/>
                <FormInput name={"nonce"} data={txData} setData={setTxData}/>
                <FormInput name={"gasPrice"} data={txData} setData={setTxData}/>
                <FormInput name={"gasLimit"} data={txData} setData={setTxData}/>
                <FormInput name={"chainId"} data={txData} setData={setTxData}/>
                <FormInput name={"data"} data={txData} setData={setTxData}/>
                <Button onClick={handleSubmit} type="submit" colorScheme="blue" width="full">
                    Sign Transaction
                </Button>
                <SignedOutput name="Signed Transaction" output={tx}/>
            </VStack>
        </Box100>
    );
};

export default EvmSignLegacyTx;

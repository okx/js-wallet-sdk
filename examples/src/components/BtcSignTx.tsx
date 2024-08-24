import React, {useEffect, useState} from 'react';
import {
    Alert,
    Button,
    Link,
    Heading,
    Text, useToast, VStack, AlertIcon
} from "@chakra-ui/react";
import Box100 from "./Box100";
import FormInput from "./FormInput";
import {TransactionFormProps, BtcTxData, utxoInput, utxoOutput} from "./types";
import SignedOutput from "./SignedOutput";
import DynamicForm from "./DynamicForm";
import {errorToast, successToast} from "./toast";


const BtcSignTx: React.FC<TransactionFormProps> = (props) => {
    const toast = useToast()

    const [txInputs, setTxInputs] = useState<utxoInput[]>([
            {
                txId: "a7881146cc7671ad89dcd1d99015ed7c5e17cfae69eedd01f73f5ab60a6c1318",
                vOut: 0,
                amount: "50000",
                address: "bc1qe26atm09hfkj4rze8aw6779u27zaadme3z96x9"
            },
        ])
    const [txOutputs, setTxOutputs] = useState<utxoOutput[]>([
            {
                address: "bc1pd4xhw0cn78duyr4vldr8xntxqxcgvg023tl78turden0k2rkn3ssfqzn8r",
                amount: "1000"
            }
        ])
    const [txData, setTxData] = useState<BtcTxData>({
        inputs: txInputs ,
        outputs: txOutputs,
        address: "bc1pd4xhw0cn78duyr4vldr8xntxqxcgvg023tl78turden0k2rkn3ssfqzn8r",
        feePerB: "2"
    });

    const [tx, setTx] = useState('')

    useEffect(() => {
        setTxData((prevTxData) => ({
            ...prevTxData,
            inputs: txInputs,
            outputs: txOutputs,
        }))
    }, [txInputs, txOutputs]);

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
            <VStack spacing={4} align="stretch" w={"100%"}>
                <Alert status='info'>
                    <AlertIcon />
                    <Text>
                        You may broadcast your transactions at {' '}
                        <Link href={"https://mempool.space/tx/push" } isExternal color="teal.500">
                            https://mempool.space/tx/push
                        </Link>
                        {' or '}
                        <Link href={"https://mempool.space/testnet/tx/push"} isExternal color="teal.500">
                            https://mempool.space/testnet/tx/push
                        </Link>
                    </Text>
                </Alert>
                <DynamicForm<utxoInput> label="Input" inputs={txInputs} setInputs={setTxInputs} />
                <DynamicForm<utxoOutput> label="Output" inputs={txOutputs} setInputs={setTxOutputs} />
                <FormInput name={"feePerB"} data={txData} setData={setTxData}/>
                <FormInput name={"address"} data={txData} setData={setTxData}/>
                <Button onClick={handleSubmit} type="submit" colorScheme="blue" width="full">
                    Sign Transaction
                </Button>
                <SignedOutput name="Signed Transaction" output={tx}/>
            </VStack>
        </Box100>
    );
};

export default BtcSignTx;

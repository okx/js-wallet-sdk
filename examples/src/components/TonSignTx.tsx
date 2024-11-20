import React, { useState } from 'react';
import {
    Button,
    Heading,
    useToast,
    VStack
} from "@chakra-ui/react";
import Box100 from "./Box100";
import FormInput from "./FormInput";
import {TransactionFormProps, TonTxData} from "./types";
import SignedOutput from "./SignedOutput";
import FormCheckbox from "./FormCheckbox";
import {errorToast, successToast} from "./toast";


const TonSignTx: React.FC<TransactionFormProps> = (props) => {
    const toast = useToast()
    const [txData, setTxData] = useState<TonTxData>({
        type: "transfer", // type of TON transfer
        to: "EQA3_JIJKDC0qauDUEQe2KjQj1iLwQRtrEREzmfDxbCKw9Kr", // destination address
        decimal: 9, // decimal on ton blockchain
        amount: "10000000", // decimal of TON is 9 on ton blockchain, so that here real value is 0.01
        seqno: 14, // nonce or sequence of from address
        toIsInit: true, // destination address init or not
        memo: "ton test", // comment for this tx
        /**
         * export enum SendMode {
         *     CARRY_ALL_REMAINING_BALANCE = 128,
         *     CARRY_ALL_REMAINING_INCOMING_VALUE = 64,
         *     DESTROY_ACCOUNT_IF_ZERO = 32,
         *     PAY_GAS_SEPARATELY = 1,
         *     IGNORE_ERRORS = 2,
         *     NONE = 0
         * }
         */
        sendMode: 1,
    });
    const [tx, setTx] = useState('')

    const [scroll, setScroll] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        props.wallet.signTransaction({privateKey: props.privateKey, data: txData})
            .then(data => {
                setTx(data.boc)
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
            <Heading marginBottom="5">Sign Transaction</Heading>
            <VStack spacing={2} align="stretch" w={"100%"}>
                <FormInput name={"to"} data={txData} setData={setTxData}/>
                <FormInput name={"amount"} data={txData} setData={setTxData}/>
                <FormInput name={"seqno"} data={txData} setData={setTxData}/>
                <FormInput name={"decimal"} data={txData} setData={setTxData}/>
                <FormInput name={"memo"} data={txData} setData={setTxData}/>
                <FormCheckbox name={"toInit"} data={txData} setData={setTxData}/>
                <Button onClick={handleSubmit} type="submit" colorScheme="blue" width="full">
                    Sign Transaction
                </Button>
                <SignedOutput name="Signed Transaction" output={tx}/>
            </VStack>
        </Box100>
    );
};

export default TonSignTx;

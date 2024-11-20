import React, { useState } from 'react';
import {
    Button,
    Heading,
    useToast,
    VStack
} from "@chakra-ui/react";
import Box100 from "./Box100";
import FormInput from "./FormInput";
import {TransactionFormProps, TonJettonTxData} from "./types";
import SignedOutput from "./SignedOutput";
import FormCheckbox from "./FormCheckbox";
import {errorToast, successToast} from "./toast";


const TonSignJettonTx: React.FC<TransactionFormProps> = (props) => {
    const toast = useToast()
    const [txData, setTxData] = useState<TonJettonTxData>({
        type: "jettonTransfer", // type of jetton TOKEN transfer
        // jetton wallet address of from address
        fromJettonAccount: "kQDL9sseMzrh4vewfQgZKJzVwDFbDTpbs2f8BY6iCMgRTyOG",
        to: "UQDXgyxgYKNSdTiJBqmNNfbD7xuRMl6skrBmsEtyXslFm5an",
        seqno: 15, // nonce or sequence of from address
        toIsInit: false, // destination address init or not
        memo: "jetton test", // comment for this tx
        decimal: 2, // decimal of jetton TOKEN on ton blockchain
        amount: "100", // decimal of TOKEN is 2 on ton blockchain, so that here real value is 1
        messageAttachedTons: "50000000", // message fee, default 0.05, here is 0.05 * 10^9
        invokeNotificationFee: "1", // notify fee, official recommend 0.000000001, here is 0.000000001 * 10^9
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
        queryId: "18446744073709551615" // string of uint64 number, eg 18446744073709551615 = 2^64 - 1
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
            <Heading marginBottom="5">Sign Jetton Transaction</Heading>
            <VStack spacing={2} align="stretch" w={"100%"}>
                <FormInput name={"to"} data={txData} setData={setTxData}/>
                <FormInput name={"amount"} data={txData} setData={setTxData}/>
                <FormInput name={"seqno"} data={txData} setData={setTxData}/>
                <FormInput name={"decimal"} data={txData} setData={setTxData}/>
                <FormInput name={"memo"} data={txData} setData={setTxData}/>
                <FormCheckbox name={"toInit"} data={txData} setData={setTxData}/>
                <FormInput name={"messageAttachedTons"} data={txData} setData={setTxData}/>
                <FormInput name={"invokeNotificationFee"} data={txData} setData={setTxData}/>
                <FormInput name={"queryId"} data={txData} setData={setTxData}/>
                <FormInput name={"publicKey"} data={txData} setData={setTxData}/>
                <Button onClick={handleSubmit} type="submit" colorScheme="blue" width="full">
                    Sign Transaction
                </Button>
                <SignedOutput name="Signed Transaction" output={tx}/>
            </VStack>
        </Box100>
    );
};

export default TonSignJettonTx;

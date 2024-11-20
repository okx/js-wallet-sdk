import React, { useState } from 'react';
import {
    Button,
    Heading,
} from "@chakra-ui/react";
import {TransactionFormProps} from "./types";
import SignOutput from "./SignedOutput";
import FormTextarea from "./FormTextarea";
import Box100 from "./Box100";


const SignTypedMessage: React.FC<TransactionFormProps> = (props) => {
    const [data, setData] = useState<{message: string, type: number}>({message:`test message to be signed`, type:1})
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
            <Heading marginBottom="5">Sign Message</Heading>
            <FormTextarea name={"message"} data={data} setData={setData} rows={3}></FormTextarea>
            <Button onClick={handleSubmit} type="submit" colorScheme="blue" width="full">
                Sign Message
            </Button>
            <SignOutput name={"Signature"} output={tx}/>
        </Box100>
    );
};

export default SignTypedMessage;

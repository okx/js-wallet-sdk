import {Alert, AlertIcon, AlertTitle, Box} from "@chakra-ui/react";
import React from "react";


const SignedOutput: React.FC<{name: string, output: string}> = (props) => {
    return (
        props.output ?
            <Alert
                overflow="hidden"
                whiteSpace="normal"
                wordBreak="break-word"
                status='success'
                variant='subtle'
                marginTop={5}
            >
                <AlertIcon  mr={2}/>
                <Box>
                    <AlertTitle>{props.name}:</AlertTitle>
                    {props.output}
                </Box>
            </Alert>
            : <Box></Box>
    );
};
export default SignedOutput
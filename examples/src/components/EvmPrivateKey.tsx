import React, { useState } from 'react';
import {base} from "@okxweb3/crypto-lib";
import {EthWallet} from "@okxweb3/coin-ethereum";
import {
    Alert,
    AlertIcon,
    Button,
    Flex,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightElement,
    useClipboard,
    useToast,
    VStack
} from "@chakra-ui/react";
import Box100 from "./Box100";
import {CheckIcon, CopyIcon} from "@chakra-ui/icons";
import AddressOutput from "./AddressOutput";
import {errorToast, successToast} from "./toast";

interface GeneratePrivateKeyProps{
    wallet: EthWallet
    privateKey: string
    setPrivateKey: React.Dispatch<React.SetStateAction<any>>;
}

const EvmPrivateKey: React.FC<GeneratePrivateKeyProps> = (props) => {
    const toast = useToast()
;
    const [address, setAddress] = useState('')
    const { hasCopied: hasCopiedPrivKey, onCopy: onCopyPrivKey } = useClipboard(props.privateKey);

    const updateAddress = (privateKey: string) => {
        props.wallet.getNewAddress({privateKey})
            .then((addr) => {
                setAddress(addr.address)
                toast.closeAll()
                successToast(toast, "Update address successful")
            })
            .catch((e) => {
                toast.closeAll()
                errorToast(toast, e.toString())
            })
    }

    const handlePrivKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        props.setPrivateKey(value)
    };

    const handleGenPrivKey = async (e: React.FormEvent) => {
        e.preventDefault();
        const privateKey = base.randomBytes(32).toString('hex')
        props.setPrivateKey(privateKey)
        updateAddress(privateKey)
    };

    const handleUpdateAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        const privateKey = props.privateKey
        updateAddress(privateKey)
    };

    return (
        <Box100>
            <Heading marginBottom="5">Generate Private Key</Heading>
            <VStack spacing={2} align="stretch" w={"100%"}>
                <Alert status='warning'>
                    <AlertIcon />
                    You can use your own private key but it is not recommended even though this site is purely ran on the client side and does not make any request to a server. If you wish to use your own private key, you may clone the repository from github and run locally for testing.
                </Alert>
                <InputGroup>
                    <InputLeftAddon minWidth={120}>Private Key</InputLeftAddon>
                    <Input
                        type="text"
                        id="privateKey"
                        name="privateKey"
                        value={props.privateKey}
                        onChange={handlePrivKeyChange}
                    />
                    <InputRightElement>
                    <IconButton
                        onClick={onCopyPrivKey}
                        variant="unstyled"
                        icon={hasCopiedPrivKey ? <CheckIcon /> : <CopyIcon />}
                        aria-label={hasCopiedPrivKey ? 'Copied' : 'Copy'}
                    />
                        </InputRightElement>
                </InputGroup>
                <Flex columnGap="5"
                      width="full"
                      align="center"
                      justify="center"
                >
                    <Button onClick={handleGenPrivKey} type="submit" colorScheme="blue" w="full">
                        Generate Random Private Key
                    </Button>
                    <Button onClick={handleUpdateAddress} type="submit" colorScheme="blue" w="full">
                        Update Address
                    </Button>
                </Flex>
                <AddressOutput address={address}/>
            </VStack>
        </Box100>
    );
};

export default EvmPrivateKey;

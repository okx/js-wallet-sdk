import React, {ChangeEvent, useEffect, useState} from 'react';
import {
    Alert,
    AlertIcon,
    Button,
    Flex,
    Heading,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightElement,
    Select,
    useClipboard,
    useToast,
    VStack
} from "@chakra-ui/react";
import {CheckIcon, CopyIcon} from "@chakra-ui/icons";
import {TonWallet} from "@okxweb3/coin-ton";
import AddressOutput from "./AddressOutput";
import Box100 from './Box100';
import {errorToast, successToast} from "./toast";

const BOUNCEABLE = 'bounceable'
const UNBOUNCEABLE = 'unbounceable'

interface GeneratePrivateKeyProps{
    wallet: TonWallet
    privateKey: string
    setPrivateKey: React.Dispatch<React.SetStateAction<any>>;
}

const TonPrivateKey: React.FC<GeneratePrivateKeyProps> = (props) => {
    const toast = useToast()

    const [address, setAddress] = useState('')
    const [network, setNetwork] = useState('mainnet')
    const [addressBounceable, setAddressBounceable] = useState(UNBOUNCEABLE);

    const { hasCopied: hasCopiedPrivKey, onCopy: onCopyPrivKey} = useClipboard(props.privateKey);

    const updateAddress = async () => {
        const privateKey = props.privateKey
        getAddress(privateKey)
            .then((addr) => {
                setAddress(addr)
                successToast(toast, "Update address successful")
            })
            .catch((e) => {
                errorToast(toast, e.toString())
            })
    }
    const getAddress = async (privateKey: string) => {
        const {address: a} = await props.wallet.getNewAddress({privateKey})
        const {address: addr} = await props.wallet.parseAddress({address: a})
        return addr.toString({
            urlSafe: true,
            bounceable: addressBounceable === BOUNCEABLE,
            testOnly: network === 'testnet',
        })
    }
    const handleSelectAddressBounceable = (event: ChangeEvent<HTMLSelectElement>) => {
        setAddressBounceable(event.target.value);
    };
    const handleSelectNetworkChange = (
        event: ChangeEvent<HTMLSelectElement>) => {
        setNetwork(event.target.value)
    }

    const handleUpdateAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        const privateKey = props.privateKey
        const addr = await getAddress(privateKey)
        setAddress(addr)
    };

    const handlePrivKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { value } = e.target;
        props.setPrivateKey(value)
    };

    const handleGenPrivKey = async (e: React.FormEvent) => {
        e.preventDefault();
        const privateKey = await props.wallet.getRandomPrivateKey()
        props.setPrivateKey(privateKey)

        const addr = await getAddress(privateKey)
        setAddress(addr)
    };

    useEffect(() => {
        updateAddress()
    }, [updateAddress, addressBounceable, network]);


    return (
        <Box100>
            <HStack mb={5}>
                <Heading flex={8}>Generate Private Key</Heading>
                <Select
                    value={network}
                    onChange={handleSelectNetworkChange}
                    flex={2}
                    alignSelf={"start"}
                >
                    <option value="mainnet">MainNet</option>
                    <option value="testnet">TestNet3</option>
                </Select>
            </HStack>

            <VStack spacing={2} align="stretch" w={"100%"}>
            <Alert status='warning'>
                <AlertIcon />
                You can use your own private key but it is not recommended even though this site is purely ran on the client side and does not make any request to a server. If you wish to use your own private key, you may clone the repository from github and run locally for testing.
            </Alert>
            <HStack>
                <InputGroup flex={2}>
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
                <Select
                    value={addressBounceable} // Controlled component value
                    onChange={handleSelectAddressBounceable} // Update state on change
                    flex={1}
                >
                    <option value={BOUNCEABLE}>Bounceable</option>
                    <option value={UNBOUNCEABLE}>Unbounceable</option>
                </Select>
            </HStack>

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
            <AddressOutput address={address} />
        </VStack>
    </Box100>
    );
};

export default TonPrivateKey;

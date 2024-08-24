import React, {ChangeEvent, useEffect, useState} from 'react';
import {base} from "@okxweb3/crypto-lib";
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
import {BtcWallet, private2Wif, privateKeyFromWIF, TBtcWallet} from "@okxweb3/coin-bitcoin";
import {BitcoinWallets} from "./types";
import AddressOutput from "./AddressOutput";
import Box100 from "./Box100";
import {errorToast, successToast} from "./toast";

interface BtcPrivateKeyProps {
    wallet: BitcoinWallets
    setWallet: React.Dispatch<React.SetStateAction<any>>;
    privateKey: string
    setPrivateKey: React.Dispatch<React.SetStateAction<any>>;
}

const BtcPrivateKey: React.FC<BtcPrivateKeyProps> = (props) => {
    const toast = useToast()

    const [address, setAddress] = useState('')
    const [addressType, setAddressType] = useState('Legacy');

    const { hasCopied: hasCopiedPrivKey, onCopy: onCopyPrivKey } = useClipboard(props.privateKey);

    const updateAddress = (privateKey: string) => {
        props.wallet.getNewAddress({privateKey, addressType})
            .then((addr) => {
                setAddress(addr.address)
                successToast(toast, "Update address successful")
            })
            .catch((e) => {
                errorToast(toast, e.toString())
            })
    }

    const updatePrivateKey = (wallet: BitcoinWallets) => {
        let otherWallet: BitcoinWallets
        if (wallet instanceof TBtcWallet){
            otherWallet = new BtcWallet()
        } else {
            otherWallet = new TBtcWallet()
        }

        try {
            const privKey = privateKeyFromWIF(props.privateKey, otherWallet.network())
            const wif = private2Wif(base.fromHex(privKey), wallet.network())
            props.setPrivateKey(wif)
            updateAddress(wif)
        }
        catch (e) {
            if ((e as Error).toString() === "Invalid network version") {
                updateAddress(props.privateKey)
            }
            // errorToast(toast, (e as Error).toString())
        }
    }

    const handleSelectNetworkChange = (event: ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value === 'mainnet') {
            props.setWallet(new BtcWallet());
        } else if (event.target.value === 'testnet'){
            props.setWallet(new TBtcWallet());
        }
    };
    const handleSelectAddressTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setAddressType(event.target.value);
    };

    const handlePrivKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        props.setPrivateKey(value)
    };

    const handleGenPrivKey = async (e: React.FormEvent) => {
        e.preventDefault();
        const privateKey = private2Wif(base.randomBytes(32), props.wallet.network())
        props.setPrivateKey(privateKey)
        updateAddress(privateKey)
    };

    const handleUpdateAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        const privateKey = props.privateKey
        updateAddress(privateKey)
    };

    useEffect(() => {
        updatePrivateKey(props.wallet)
    }, [updatePrivateKey, props.wallet, addressType]);

    return (
        <Box100>
            <HStack mb={5}>
                <Heading flex={8}>Generate Private Key</Heading>
                    <Select
                        onChange={handleSelectNetworkChange} // Update state on change
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
                        value={addressType} // Controlled component value
                        onChange={handleSelectAddressTypeChange} // Update state on change
                        flex={1}
                    >
                        <option value="Legacy">Legacy</option>
                        <option value="segwit_native">Segwit Native</option>
                        <option value="segwit_nested">Segwit Nested</option>
                        <option value="segwit_taproot">Taproot</option>
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

export default BtcPrivateKey;

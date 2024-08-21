import React from 'react';
import {
    Box,
    Flex,
    Link,
    useColorModeValue,
    Heading
} from '@chakra-ui/react';

const Header: React.FC = () => {
    const bgColor = useColorModeValue('gray.100', 'gray.900');

    return (
        <Box
            bg={bgColor}
            px={4}
            as="header"
            position="fixed"
            top="0"
            width="100%"
            height={16}
            zIndex="1000"
            boxShadow="md"
        >
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <Heading>OKX js-wallet-sdk Demo</Heading>
                <Flex alignItems={'center'}>
                    <Link
                        px={2}
                        py={1}
                        rounded={'md'}
                        _hover={{ textDecoration: 'none', bg: useColorModeValue('gray.200', 'gray.700') }}
                        href={'/'}
                    >
                        Home
                    </Link>
                    <Link
                        px={2}
                        py={1}
                        rounded={'md'}
                        _hover={{ textDecoration: 'none', bg: useColorModeValue('gray.200', 'gray.700') }}
                        href={'/btc'}
                    >
                        Bitcoin
                    </Link>
                    <Link
                        px={2}
                        py={1}
                        rounded={'md'}
                        _hover={{ textDecoration: 'none', bg: useColorModeValue('gray.200', 'gray.700') }}
                        href={'/evm'}
                    >
                        EVM
                    </Link>
                    <Link
                        px={2}
                        py={1}
                        rounded={'md'}
                        _hover={{ textDecoration: 'none', bg: useColorModeValue('gray.200', 'gray.700') }}
                        href={'/ton'}
                    >
                        Ton
                    </Link>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;

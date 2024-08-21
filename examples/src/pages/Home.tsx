import React from 'react';
import { Box, Flex, Text, Link } from '@chakra-ui/react';

const Home = () => {
    return (
        <Flex direction="row" align="center" justify="center" height="100vh">
            <Box
                as={Link}
                href="/btc"
                w="300px"
                h="200px"
                bg="blue.500"
                m="4"
                p="4"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Text color="white" fontSize="xl" textAlign="center">Bitcoin</Text>
            </Box>
            <Box
                as={Link}
                href="/evm"
                w="300px"
                h="200px"
                bg="blue.500"
                m="4"
                p="4"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Text color="white" fontSize="xl" textAlign="center">Ethereum</Text>
            </Box>
            <Box
                as={Link}
                href="/ton"
                w="300px"
                h="200px"
                bg="blue.500"
                m="4"
                p="4"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Text color="white" fontSize="xl" textAlign="center">TON</Text>
            </Box>
        </Flex>
    );
};

export default Home;

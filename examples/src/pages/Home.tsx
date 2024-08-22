import React from 'react';
import { Flex, Text, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
    return (
        <Flex direction="row" align="center" justify="center" height="100vh">
            <Link
                as={RouterLink}
                to="/btc"
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
            </Link>
            <Link
                as={RouterLink}
                to="/evm"
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
            </Link>
            <Link
                as={RouterLink}
                to="/ton"
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
            </Link>
        </Flex>
    );
};

export default Home;

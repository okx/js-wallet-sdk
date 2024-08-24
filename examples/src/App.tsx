import * as React from "react"
import {Box, ChakraProvider, theme } from "@chakra-ui/react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Evm from "./pages/Evm";
import Btc from "./pages/Btc";
import Ton from "./pages/Ton";

export const App = () => (
    <ChakraProvider theme={theme}>
        <Router basename={"/js-wallet-sdk"}>
            <Header/>
            <Box bg="gray.100" pt={20} pb={4} minH={"100vh"}>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/btc" element={<Btc/>} />
                    <Route path="/evm" element={<Evm/>} />
                    <Route path="/ton" element={<Ton/>} />
                </Routes>
            </Box>
        </Router>
    </ChakraProvider>
)

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Plants from './components/Plants';
import Tips from './components/Tips';
import Forum from './components/Forum';
import Layout from './components/Layout';
import Team from './components/Team';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Box minHeight="100vh" display="flex" flexDirection="column">
          <Navbar />
          <Box flex="1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/plants" element={<Plants />} />
              <Route path="/tips" element={<Tips />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/layout" element={<Layout />} />
              <Route path="/team" element={<Team />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;

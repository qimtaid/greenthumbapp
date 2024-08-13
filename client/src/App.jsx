import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Plants from './components/Plants';
import CareSchedule from './components/CareSchedule';
import Forum from './components/Forum';
import Layouts from './components/Layouts';
import AboutUs from './components/AboutUs';
import Login from './components/Login';
import Register from './components/Register';
import FAQ from './components/FAQ';


function App() {
  // State to track if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

  // Effect to update authentication state when the token in localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('access_token'));
    };

    // Listen for changes to localStorage
    window.addEventListener('storage', handleStorageChange);

    return () => {
      // Cleanup the event listener on unmount
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Function to log in and update the auth state
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Function to log out and update the auth state
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
  };

  return (
    <ChakraProvider>
      <Router>
        <Box minHeight="100vh" display="flex" flexDirection="column">
          <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
          <Box flex="1" pt="80px"> {/* Adjust the padding to match the Navbar height */}
            <Routes>
              <Route
                path="/"
                element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/register" />}
              />
              <Route
                path="/register"
                element={!isAuthenticated ? <Register /> : <Navigate to="/home" />}
              />
              <Route
                path="/login"
                element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/home" />}
              />
              <Route
                path="/home"
                element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
              />
              <Route
                path="/plants"
                element={isAuthenticated ? <Plants /> : <Navigate to="/login" />}
              />
              <Route
                path="/careschedule"
                element={isAuthenticated ? <CareSchedule /> : <Navigate to="/login" />}
              />
              <Route
                path="/forum"
                element={isAuthenticated ? <Forum /> : <Navigate to="/login" />}
              />
              <Route
                path="/layout"
                element={isAuthenticated ? <Layouts /> : <Navigate to="/login" />}
              />
              <Route
                path="/about"
                element={isAuthenticated ? <AboutUs /> : <Navigate to="/login" />}
              />
              <Route
                path="/faq"
                element={isAuthenticated ? <FAQ /> : <Navigate to="/login" />}
              />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;

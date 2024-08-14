import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import { login } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const color = useColorModeValue('black', 'white');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when form is submitted

    try {
      const response = await login(email, password);
      if (response.access_token) {
        // Store access token and username in local storage
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('username', response.username); // Store username

        // Call the onLogin function passed from App.jsx to update authentication state
        onLogin();

        // Navigate to home page or other protected routes
        navigate('/home');
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('An error occurred during login.');
    } finally {
      setLoading(false); // Reset loading state after login attempt
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={10}
      p={8}
      borderWidth={1}
      borderRadius="lg"
      bg={bgColor}
      color={color}
      boxShadow="lg"
    >
      <Heading mb={6} textAlign="center">Login</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormControl>
        <Button
          colorScheme="teal"
          type="submit"
          width="full"
          mt={4}
          isLoading={loading} // Disable button and show loading spinner if logging in
        >
          Login
        </Button>
      </form>
      <Text mt={4} textAlign="center">
        New to this app? <Link color="teal.500" onClick={() => navigate('/register')}>Sign up</Link>
      </Text>
    </Box>
  );
};

// Add propTypes for the Login component
Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;

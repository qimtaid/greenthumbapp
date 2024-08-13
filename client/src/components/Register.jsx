import React, { useState } from 'react';
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
import { register } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const color = useColorModeValue('black', 'white');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await register(username, email, password);
        if (response.access_token) {
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('username', username); // Store username
            navigate('/home');  // Navigate to the home page or a different route after registration
        } else {
            alert(response.msg || 'Registration successful, please log in.');
            navigate('/login');
        }
    } catch (error) {
        console.error('Registration failed:', error);
        alert(error.message || 'An error occurred during registration.');
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
      <Heading mb={6} textAlign="center">Register</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </FormControl>
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
        <Button colorScheme="teal" type="submit" width="full" mt={4}>
          Register
        </Button>
      </form>
      <Text mt={4} textAlign="center">
        Already have an account? <Link color="teal.500" onClick={() => navigate('/login')}>Sign in</Link>
      </Text>
    </Box>
  );
};

export default Register;

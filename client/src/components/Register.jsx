// src/components/Register.jsx
import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useColorModeValue
} from '@chakra-ui/react';

const Register = () => {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const color = useColorModeValue('black', 'white');

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
      <form>
        <FormControl mb={4}>
          <FormLabel>Username</FormLabel>
          <Input type="text" placeholder="Enter your username" />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input type="email" placeholder="Enter your email" />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Password</FormLabel>
          <Input type="password" placeholder="Enter your password" />
        </FormControl>
        <Button colorScheme="teal" type="submit" width="full" mt={4}>
          Register
        </Button>
      </form>
    </Box>
  );
};

export default Register;

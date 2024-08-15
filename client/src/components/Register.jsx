// src/components/Register.jsx
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useColorModeValue
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const color = useColorModeValue('black', 'white');

  const[username, setUsername] = useState("")
  const[email, setEmail]= useState("")
  const[password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleRegisterUser = (e) => {
    e.preventDefault()

    const userDetails = {
      username: username,
      email: email,
      password: password
    }

    fetch('http://127.0.0.1:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userDetails)
    })
    .then((response) => {
      console.log("Server response status:", response.status);
      if (!response.ok) {
        console.error("Sign Up failed");
        throw new Error("Sign Up failed");
      }
      return response.json();
    })
    .then((result) => {
      console.log(result);
      navigate("/login")
      return "Successfully signed up. You can now Log in.";
    })
    .catch((err)=>{
      console.error(err);
    });
  }

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
      <form onSubmit={handleRegisterUser}>
        <FormControl mb={4}>
          <FormLabel>Username</FormLabel>
          <Input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Enter your username" />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter your email" />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter your password" />
        </FormControl>
        <Button colorScheme="teal" type="submit" width="full" mt={4}>
          Register
        </Button>
      </form>
    </Box>
  );
};

export default Register;

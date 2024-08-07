import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Flex, HStack, IconButton, Link, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import LogoImage from '../assets/logo.png';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const linkColor = useColorModeValue('black', 'white');

  return (
    <Flex as="nav" bg={useColorModeValue('gray.100', 'gray.900')} p={4} align="center" justify="center">
      <Flex align="center" w="full" maxW="1200px">
        <Box as="img" src={LogoImage} alt="Logo" boxSize="50px" mr="auto" />
        <HStack spacing={4}>
          <Link as={RouterLink} to="/" color={linkColor}>Home</Link>
          <Link as={RouterLink} to="/plants" color={linkColor}>Plants</Link>
          <Link as={RouterLink} to="/tips" color={linkColor}>Tips</Link>
          <Link as={RouterLink} to="/forum" color={linkColor}>Forum</Link>
          <Link as={RouterLink} to="/layout" color={linkColor}>Layout</Link>
          <Link as={RouterLink} to="/team" color={linkColor}>Team</Link>
          <Link as={RouterLink} to="/login" color={linkColor}>Login</Link>
          <Link as={RouterLink} to="/register" color={linkColor}>Register</Link>
        </HStack>
        <IconButton
          ml="auto"
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          variant="outline"
          aria-label="Toggle dark mode"
        />
      </Flex>
    </Flex>
  );
};

export default Navbar;

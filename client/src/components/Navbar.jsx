import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Link as RouterLink } from 'react-router-dom';
import { Box, Flex, HStack, IconButton, Link, useColorMode, useColorModeValue, Button } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import LogoImage from '../assets/logo.png';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const linkColor = useColorModeValue('black', 'white');
  const bgColor = useColorModeValue('gray.100', 'gray.900');

  return (
    <Flex
      as="nav"
      bg={bgColor}
      p={4}
      align="center"
      justify="center"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={10} // Ensure the navbar stays above other content
      boxShadow="md"
      width="100%"
    >
      <Flex align="center" w="full" maxW="1200px">
        <Box as="img" src={LogoImage} alt="Logo" boxSize="50px" mr="auto" />
        <HStack spacing={4}>
          <Link as={RouterLink} to="/home" color={linkColor}>Home</Link>
          <Link as={RouterLink} to="/plants" color={linkColor}>Plants</Link>
          <Link as={RouterLink} to="/careschedule" color={linkColor}>Care Schedule</Link>
          <Link as={RouterLink} to="/forum" color={linkColor}>Forum</Link>
          <Link as={RouterLink} to="/layout" color={linkColor}>Layout</Link>
          <Link as={RouterLink} to="/about" color={linkColor}>About Us</Link>
          {isAuthenticated ? (
            <Button colorScheme="teal" onClick={onLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Link as={RouterLink} to="/login" color={linkColor}>Login</Link>
              <Link as={RouterLink} to="/register" color={linkColor}>Register</Link>
            </>
          )}
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

// Add PropTypes validation
Navbar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired, // Ensure onLogout is validated as a required function
};

export default Navbar;

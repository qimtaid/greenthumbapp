import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Link,
  useColorMode,
  useColorModeValue,
  Button,
  Text,
  Collapse,
  Stack,
  useDisclosure,
  useBreakpointValue,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon, HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { FaThumbsUp } from 'react-icons/fa';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onToggle } = useDisclosure();
  const linkColor = useColorModeValue('black', 'white');
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const logoColor = 'teal.500';
  const fontStyle = { fontFamily: 'Pacifico, cursive', fontWeight: 'bold', fontSize: '2xl' };
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    onToggle();
  };

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
      zIndex={10}
      boxShadow="md"
      width="100%"
    >
      <Flex
        align="center"
        w="full"
        maxW="1200px"
        justify="space-between"
      >
        {/* Logo and app name */}
        <HStack spacing={2} mr="auto">
          <Box as={FaThumbsUp} color={logoColor} boxSize="30px" />
          <Text color={logoColor} {...fontStyle}>
            GreenThumb
          </Text>
        </HStack>

        {isDesktop ? (
          <HStack spacing={4} display={{ base: 'none', md: 'flex' }} flex="1" justify="center">
            <Link as={RouterLink} to="/home" color={linkColor}>Home</Link>
            <Link as={RouterLink} to="/plants" color={linkColor}>Plants</Link>
            <Link as={RouterLink} to="/careschedule" color={linkColor}>Care Schedule</Link>
            <Link as={RouterLink} to="/forum" color={linkColor}>Forum</Link>
            <Link as={RouterLink} to="/layout" color={linkColor}>Layout</Link>
            <Link as={RouterLink} to="/about" color={linkColor}>About</Link>
            <Link as={RouterLink} to="/faq" color={linkColor}>FAQs</Link>
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
        ) : (
          <>
            <IconButton
              ml="auto"
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              onClick={onToggle}
              variant="outline"
              aria-label="Toggle Navigation"
            />
            <Collapse in={isOpen}>
              <Stack
                spacing={4}
                p={4}
                display={{ base: 'flex', md: 'none' }}
                bg={bgColor}
                position="absolute"
                top="60px"
                left="0"
                right="0"
                borderRadius="md"
                zIndex={1}
                align="center" // Center items in the dropdown menu
              >
                <Link as={RouterLink} to="/home" color={linkColor} onClick={() => handleNavigation('/home')}>Home</Link>
                <Link as={RouterLink} to="/plants" color={linkColor} onClick={() => handleNavigation('/plants')}>Plants</Link>
                <Link as={RouterLink} to="/careschedule" color={linkColor} onClick={() => handleNavigation('/careschedule')}>Care Schedule</Link>
                <Link as={RouterLink} to="/forum" color={linkColor} onClick={() => handleNavigation('/forum')}>Forum</Link>
                <Link as={RouterLink} to="/layout" color={linkColor} onClick={() => handleNavigation('/layout')}>Layout</Link>
                <Link as={RouterLink} to="/about" color={linkColor} onClick={() => handleNavigation('/about')}>About</Link>
                <Link as={RouterLink} to="/faq" color={linkColor} onClick={() => handleNavigation('/faq')}>FAQs</Link>
                {isAuthenticated ? (
                  <Button colorScheme="teal" onClick={onLogout}>
                    Logout
                  </Button>
                ) : (
                  <>
                    <Link as={RouterLink} to="/login" color={linkColor} onClick={() => handleNavigation('/login')}>Login</Link>
                    <Link as={RouterLink} to="/register" color={linkColor} onClick={() => handleNavigation('/register')}>Register</Link>
                  </>
                )}
              </Stack>
            </Collapse>
          </>
        )}

        <Flex align="center" ml={2}>
          <IconButton
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="outline"
            aria-label="Toggle dark mode"
            mr={2} // Adjusted margin-right to bring closer
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

// PropTypes validation
Navbar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Navbar;

import React from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box
      as="footer"
      bg={useColorModeValue('gray.100', 'gray.900')}
      color={useColorModeValue('gray.600', 'white')}
      py={4}
      width="100%"
      position="fixed"
      bottom="0"
      textAlign="center"
    >
      <Text>&copy; {new Date().getFullYear()} GreenThumb. All rights reserved.</Text>
    </Box>
  );
};

export default Footer;

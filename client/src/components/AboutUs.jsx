import React from 'react';
import { Box, Text, Grid, GridItem, Image, VStack, Heading, Container, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import backgroundImage from '../assets/aboutuslogo.jpg';

// Import member images
import ericImage from '../assets/Riko.jpg';
import danImage from '../assets/DanK.png';
import dorcasImage from '../assets/Dorcas.jpg';

const AboutUs = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardTextColor = useColorModeValue('gray.800', 'white');
  const glowColor = useColorModeValue('teal', 'teal');

  // Sample data for team members
  const teamMembers = [
    { name: 'Eric Choge', image: ericImage, role: 'Product Manager', description: 'Eric is our lead horticulturist, ensuring every tip is backed by science.' },
    { name: 'Dan Kimutai', image: danImage, role: 'CEO', description: 'Dan manages community engagement and brings gardeners together.' },
    { name: 'Dorcas Akamuran', image: dorcasImage, role: 'SWE', description: 'Dorcas is our tech expert, making sure the app runs smoothly.' },
  ];

  const cardVariants = {
    hover: {
      scale: 1.05,
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
    },
  };

  return (
    <Box textAlign="center" p={8}>
      <Container maxW="container.lg">
        <Heading as="h1" size="2xl" mb={6}>About Us</Heading>
        <Text fontSize="lg" mb={8}>
          Welcome to GreenThumb, where we are passionate about bringing people closer to nature.
          Our journey began with a shared love for gardening, and we have grown into a community-driven platform
          dedicated to helping gardeners of all levels.
        </Text>

        <Box mb={10}>
          <Heading as="h2" size="xl" mb={4}>Our Mission</Heading>
          <Text fontSize="lg" mb={4}>
            To empower individuals to grow and care for their plants, and to connect them with a community of like-minded gardeners.
          </Text>
          <Heading as="h2" size="xl" mb={4}>Our Vision</Heading>
          <Text fontSize="lg" mb={4}>
            To be the go-to platform for all gardening enthusiasts, providing tools, knowledge, and inspiration for a greener world.
          </Text>
        </Box>

        <Heading as="h2" size="xl" mb={6}>Meet the Team</Heading>
        <Box
          position="relative"
          mb={10}
          p={10}
          bgImage={`url(${backgroundImage})`}
          bgSize="cover"
          bgPosition="center"
          borderRadius="lg"
          boxShadow="none"
          border="2px solid"
          borderColor={glowColor}
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(5px)',
            zIndex: -1,
            boxShadow: `0 0 20px ${glowColor}`,
          }}
        >
          <Grid templateColumns="repeat(3, 1fr)" gap={6} justifyItems="center">
            {teamMembers.map((member, index) => (
              <GridItem
                key={index}
                as={motion.div}
                whileHover="hover"
                variants={cardVariants}
                p={6}
                bg={cardBg}
                color={cardTextColor}
                borderRadius="lg"
                boxShadow="md"
                textAlign="center"
                maxW="sm"
                position="relative"
                zIndex={0} // Ensure content is above the background
                border="2px solid"
                borderColor={glowColor}
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  boxShadow: `0 0 20px ${glowColor}`,
                  borderRadius: 'inherit',
                  zIndex: -1,
                }}
              >
                <VStack spacing={4} align="center">
                  <Image
                    src={member.image}
                    alt={member.name}
                    borderRadius="full"
                    boxSize="150px"
                    objectFit="cover"
                  />
                  <Heading as="h3" size="lg">{member.name}</Heading>
                  <Text fontSize="md" fontWeight="bold">{member.role}</Text>
                  <Text fontSize="sm">{member.description}</Text>
                </VStack>
              </GridItem>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUs;

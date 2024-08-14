import React, { useState, useEffect } from 'react';
import { Box, Image, Text, VStack, HStack, Circle, Flex } from '@chakra-ui/react';
import pic0 from '../assets/pic0.jpg';
import pic1 from '../assets/pic1.jpg';
import pic2 from '../assets/pic2.jpg';
import pic3 from '../assets/pic3.jpg';
import pic4 from '../assets/pic4.jpg';
import pic5 from '../assets/pic5.jpg';

const PhotoCarousel = () => {
  const slides = [
    {
      imageUrl: pic0,
      message: (
        <>
          Welcome to <Text as="span" color="teal.300">GreenThumb</Text>! Your gardening companion.
        </>
      ),
    },
    {
      imageUrl: pic1,
      message: (
        <>
          Add and remove your <Text as="span" color="teal.300">plants</Text> with ease.
        </>
      ),
    },
    {
      imageUrl: pic2,
      message: (
        <>
          Design your dream <Text as="span" color="teal.300">garden layout</Text> effortlessly.
        </>
      ),
    },
    {
      imageUrl: pic3,
      message: (
        <>
          Join our <Text as="span" color="teal.300">community</Text> and share your gardening tips.
        </>
      ),
    },
    {
      imageUrl: pic4,
      message: (
        <>
          Stay on top of your <Text as="span" color="teal.300">Care Schedule</Text> with reminders.
        </>
      ),
    },
    {
      imageUrl: pic5,
      message: (
        <>
          Check out our <Text as="span" color="teal.300">FAQ</Text> section for common questions.
        </>
      ),
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleCircleClick = (index) => {
    console.log(`Circle ${index} clicked`);
    setCurrentIndex(index);
  };

  const { imageUrl, message } = slides[currentIndex];

  return (
    <Box position="relative" width="full" height="82vh" overflow="hidden" marginTop="-0.5">
      <Image
        src={imageUrl}
        alt={`Slide ${currentIndex + 1}`}
        objectFit="cover"
        width="100%"
        height="100%"
        position="absolute"
        top="0"
        left="0"
        zIndex="-1"
      />
      <Flex
        position="relative"
        width="full"
        height="full"
        justify="center"
        align="center"
        zIndex="1"
        bgGradient="linear(to-b, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))"
      >
        <VStack textAlign="center" color="white" spacing={4}>
          <Text fontSize="4xl" fontWeight="bold">
            {message}
          </Text>
        </VStack>
      </Flex>

      <HStack position="absolute" bottom="20px" left="50%" transform="translateX(-50%)">
        {slides.map((_, index) => (
          <Circle
            key={index}
            size="12px"
            bg={index === currentIndex ? 'teal.300' : 'whiteAlpha.800'}
            opacity={index === currentIndex ? 1 : 0.5}
            cursor="pointer"
            onClick={() => handleCircleClick(index)}
            mx={1}
          />
        ))}
      </HStack>
    </Box>
  );
};

export default PhotoCarousel;

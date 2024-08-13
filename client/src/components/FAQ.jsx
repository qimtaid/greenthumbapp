import React from 'react';
import { Box, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';

const FAQ = () => {
  const faqs = [
    {
      question: 'How do I start a garden?',
      answer: 'Start by choosing a suitable location with enough sunlight, and decide what plants you want to grow based on your climate and soil type.',
    },
    {
      question: 'How often should I water my plants?',
      answer: 'The frequency of watering depends on the type of plants and the weather conditions. Generally, water deeply once or twice a week.',
    },
    {
      question: 'What is the best way to deal with garden pests?',
      answer: 'Integrated Pest Management (IPM) is the best approach, combining biological, cultural, mechanical, and chemical methods to manage pests.',
    },
    {
      question: 'How do I improve soil quality?',
      answer: 'You can improve soil quality by adding organic matter, such as compost or manure, and ensuring proper pH levels and nutrient balance.',
    },
    {
      question: 'What are the easiest plants to grow for beginners?',
      answer: 'Some easy-to-grow plants for beginners include tomatoes, basil, lettuce, marigolds, and radishes.',
    },
    {
      question: 'How do I prune my plants properly?',
      answer: 'Pruning involves removing dead or overgrown branches to encourage healthy growth. The technique varies depending on the plant type.',
    },
    {
      question: 'What is companion planting?',
      answer: 'Companion planting is the practice of growing different plants together to enhance growth, deter pests, and improve yields.',
    },
    {
      question: 'How can I extend the growing season?',
      answer: 'You can extend the growing season by using techniques like row covers, cold frames, and choosing late-season varieties.',
    },
    {
      question: 'What should I do with my garden in the winter?',
      answer: 'In winter, protect your garden with mulch, plant cover crops, and prepare for the next growing season by planning and maintaining tools.',
    },
    {
      question: 'How do I compost at home?',
      answer: 'Composting involves combining green and brown organic materials, keeping the pile moist, and turning it regularly to create nutrient-rich compost.',
    },
  ];

  return (
    <Box maxWidth="800px" mx="auto" my={10}>
      <Text fontSize="3xl" fontWeight="bold" mb={6} textAlign="center">
        Frequently Asked Questions
      </Text>
      <Accordion allowToggle>
        {faqs.map((faq, index) => (
          <AccordionItem key={index}>
            <h2>
              <AccordionButton display="flex" alignItems="center">
                <Box flex="1" textAlign="left" fontWeight="medium">
                  {faq.question}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              {faq.answer}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

export default FAQ;

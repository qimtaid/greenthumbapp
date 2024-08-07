import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { BiAddToQueue } from 'react-icons/bi';
import { BASE_URL } from '../App'; // Ensure this path is correct

const CreatePlant = ({ setPlants }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    name: '',
    species: '',
    description: '',
    careInstructions: '',
  });
  const toast = useToast();

  const handleCreatePlant = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/plants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }

      toast({
        status: 'success',
        title: 'Plant Added',
        description: 'Your plant has been successfully added.',
        duration: 2000,
        position: 'top-center',
      });
      onClose();
      setPlants((prevPlants) => [...prevPlants, data]); // Update plants

      setInputs({
        name: '',
        species: '',
        description: '',
        careInstructions: '',
      }); // Clear inputs
    } catch (error) {
      toast({
        status: 'error',
        title: 'An error occurred',
        description: error.message,
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={onOpen} leftIcon={<BiAddToQueue />}>
        Add Plant
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={handleCreatePlant}>
          <ModalContent>
            <ModalHeader>Add New Plant</ModalHeader>
            <ModalCloseButton />

            <ModalBody pb={6}>
              <Flex direction="column" gap={4}>
                <FormControl>
                  <FormLabel>Plant Name</FormLabel>
                  <Input
                    placeholder='e.g., Rose'
                    value={inputs.name}
                    onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Species</FormLabel>
                  <Input
                    placeholder='e.g., Rosa'
                    value={inputs.species}
                    onChange={(e) => setInputs({ ...inputs, species: e.target.value })}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    resize='none'
                    placeholder='Describe the plant'
                    value={inputs.description}
                    onChange={(e) => setInputs({ ...inputs, description: e.target.value })}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Care Instructions</FormLabel>
                  <Textarea
                    resize='none'
                    placeholder='How to take care of the plant'
                    value={inputs.careInstructions}
                    onChange={(e) => setInputs({ ...inputs, careInstructions: e.target.value })}
                  />
                </FormControl>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} type='submit' isLoading={isLoading}>
                Add
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

CreatePlant.propTypes = {
  setPlants: PropTypes.func.isRequired, // Validate setPlants prop
};

export default CreatePlant;

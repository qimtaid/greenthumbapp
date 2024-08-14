import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  IconButton,
  Image,
  useToast,
} from '@chakra-ui/react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { fetchPlants, addPlant, updatePlant, deletePlant } from '../utils/api'; // Import functions

const Plants = () => {
  const [plants, setPlants] = useState([]);
  const [newPlant, setNewPlant] = useState({ name: '', description: '', img_url: '' });
  const [currentPlant, setCurrentPlant] = useState(null);

  const { isOpen: isAddModalOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isEditModalOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const toast = useToast();

  useEffect(() => {
    fetchPlantsData();
  }, []);

  const fetchPlantsData = async () => {
    try {
      const data = await fetchPlants();
      setPlants(data);
    } catch (error) {
      console.error('Error fetching plants:', error);
      setPlants([]); // Set to an empty array in case of an error
    }
  };

  const handleAddPlant = async () => {
    const formData = new FormData();
    formData.append('name', newPlant.name);
    formData.append('description', newPlant.description);
    formData.append('image', newPlant.img_url); // Assuming img_url contains the file object

    try {
      await addPlant(formData);
      toast({
        title: 'Plant added.',
        description: 'The plant has been successfully added.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setNewPlant({ name: '', description: '', img_url: '' });
      onAddClose();
      fetchPlantsData();
    } catch (error) {
      console.error('Error adding plant:', error);
      toast({
        title: 'Error adding plant.',
        description: 'There was an error adding the plant.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
};


  const handleUpdatePlant = async (plant) => {
    try {
      await updatePlant(plant.id, plant);
      toast({
        title: 'Plant updated.',
        description: 'The plant has been successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setCurrentPlant(null);
      onEditClose();
      fetchPlantsData();
    } catch (error) {
      console.error('Error updating plant:', error);
      toast({
        title: 'Error updating plant.',
        description: 'There was an error updating the plant.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeletePlant = async (id) => {
    try {
      await deletePlant(id);
      toast({
        title: 'Plant deleted.',
        description: 'The plant has been successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchPlantsData();
    } catch (error) {
      console.error('Error deleting plant:', error);
      toast({
        title: 'Error deleting plant.',
        description: 'There was an error deleting the plant.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const openEditModal = (plant) => {
    setCurrentPlant({ ...plant });
    onEditOpen();
  };

  const openDeleteModal = (plant) => {
    setCurrentPlant(plant);
    onDeleteOpen();
  };

  return (
    <Box p={4}>
      <Button mb={4} colorScheme="teal" onClick={onAddOpen}>
        Add Plant
      </Button>

      <Table variant="simple">
        <TableCaption>Plants in your collection</TableCaption>
        <Thead>
          <Tr>
            <Th>Image</Th>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {plants.length > 0 ? (
            plants.map((plant) => (
              <Tr key={plant.id}>
                <Td>
                  <Image
                    boxSize="100px"
                    objectFit="cover"
                    src={plant.img_url}
                    alt={plant.name}
                    fallbackSrc="https://via.placeholder.com/100"
                  />
                </Td>
                <Td>{plant.name}</Td>
                <Td>{plant.description}</Td>
                <Td>
                  <IconButton
                    aria-label="Edit plant"
                    icon={<FaEdit />}
                    colorScheme="teal"
                    onClick={() => openEditModal(plant)}
                    mr={2}
                  />
                  <IconButton
                    aria-label="Delete plant"
                    icon={<FaTrash />}
                    colorScheme="red"
                    onClick={() => openDeleteModal(plant)}
                  />
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan="4">No plants found</Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      {/* Add Plant Modal */}
      <Modal isOpen={isAddModalOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Plant</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Plant Name</FormLabel>
              <Input
                value={newPlant.name}
                onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
              />
              <FormLabel mt={4}>Description</FormLabel>
              <Textarea
                value={newPlant.description}
                onChange={(e) => setNewPlant({ ...newPlant, description: e.target.value })}
              />
              <FormLabel mt={4}>Image URL</FormLabel>
              <Input
                value={newPlant.img_url}
                onChange={(e) => setNewPlant({ ...newPlant, img_url: e.target.value })}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleAddPlant}>
              Add Plant
            </Button>
            <Button onClick={onAddClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Plant Modal */}
      <Modal isOpen={isEditModalOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Plant</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Plant Name</FormLabel>
              <Input
                value={currentPlant?.name || ''}
                onChange={(e) => setCurrentPlant({ ...currentPlant, name: e.target.value })}
              />
              <FormLabel mt={4}>Description</FormLabel>
              <Textarea
                value={currentPlant?.description || ''}
                onChange={(e) => setCurrentPlant({ ...currentPlant, description: e.target.value })}
              />
              <FormLabel mt={4}>Image URL</FormLabel>
              <Input
                value={currentPlant?.img_url || ''}
                onChange={(e) => setCurrentPlant({ ...currentPlant, img_url: e.target.value })}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={() => handleUpdatePlant(currentPlant)}>
              Update Plant
            </Button>
            <Button onClick={onEditClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Plant Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Plant</ModalHeader>
          <ModalBody>
          Are you sure you want to delete the plant &apos;{currentPlant?.name}&apos;?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleDeletePlant(currentPlant.id)}>
              Delete
            </Button>
            <Button onClick={onDeleteClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Plants;

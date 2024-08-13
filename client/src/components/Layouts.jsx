import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Text,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { addLayout } from '../utils/api'; // Correct import

const Layouts = () => {
  const [layouts, setLayouts] = useState([]);
  const [editingLayout, setEditingLayout] = useState(null);
  const [layoutName, setLayoutName] = useState('');
  const [layoutData, setLayoutData] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Memoized fetchLayouts function
  const fetchAllLayouts = useCallback(async () => {
    try {
      const response = await fetchLayouts(); // Call the function to fetch layouts
      setLayouts(response);
    } catch (error) {
      console.error('Error fetching layouts:', error);
      showToast('Error', 'Failed to fetch layouts.', 'error');
    }
  }, []); // Empty dependency array ensures the function does not change

  useEffect(() => {
    fetchAllLayouts();
  }, [fetchAllLayouts]); // Dependency array includes fetchAllLayouts

  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
    });
  };

  const handleAddLayout = async () => {
    try {
      await addLayout({ name: layoutName, layout_data: layoutData });
      fetchAllLayouts();
      setLayoutName('');
      setLayoutData('');
      showToast('Success', 'Layout added successfully.', 'success');
    } catch (error) {
      console.error('Error adding layout:', error);
      showToast('Error', 'Failed to add layout.', 'error');
    }
  };

  const handleUpdateLayout = async () => {
    try {
      await updateLayout(editingLayout.id, { name: layoutName, layout_data: layoutData });
      fetchAllLayouts();
      setEditingLayout(null);
      setLayoutName('');
      setLayoutData('');
      showToast('Success', 'Layout updated successfully.', 'success');
      onClose();
    } catch (error) {
      console.error('Error updating layout:', error);
      showToast('Error', 'Failed to update layout.', 'error');
    }
  };

  const handleDeleteLayout = async (id) => {
    try {
      await deleteLayout(id);
      fetchAllLayouts();
      showToast('Success', 'Layout deleted successfully.', 'success');
    } catch (error) {
      console.error('Error deleting layout:', error);
      showToast('Error', 'Failed to delete layout.', 'error');
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Button onClick={() => { setEditingLayout(null); onOpen(); }} colorScheme="teal">
          Add New Layout
        </Button>

        {layouts.map((layout) => (
          <HStack key={layout.id} p={4} borderWidth={1} borderRadius="md" spacing={4} align="center">
            <Box flex="1">
              <Text fontWeight="bold">{layout.name}</Text>
              <Text>{layout.layout_data}</Text>
            </Box>
            <IconButton
              icon={<EditIcon />}
              aria-label="Edit"
              onClick={() => {
                setEditingLayout(layout);
                setLayoutName(layout.name);
                setLayoutData(layout.layout_data);
                onOpen();
              }}
            />
            <IconButton
              icon={<DeleteIcon />}
              aria-label="Delete"
              onClick={() => handleDeleteLayout(layout.id)}
            />
          </HStack>
        ))}

        {/* Add/Edit Layout Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{editingLayout ? 'Edit Layout' : 'Add Layout'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Layout Name</FormLabel>
                <Input
                  value={layoutName}
                  onChange={(e) => setLayoutName(e.target.value)}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Layout Data</FormLabel>
                <Input
                  value={layoutData}
                  onChange={(e) => setLayoutData(e.target.value)}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={editingLayout ? handleUpdateLayout : handleAddLayout}>
                {editingLayout ? 'Update Layout' : 'Add Layout'}
              </Button>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default Layouts;

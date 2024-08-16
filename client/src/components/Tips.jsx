import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Textarea,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Heading,
  Flex,
  Icon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, InfoIcon, EditIcon } from '@chakra-ui/icons';
import { BsThreeDotsVertical } from 'react-icons/bs'; // 3-dot menu icon
import { fetchTips, addTip, updateTip, deleteTip } from '../utils/api';

const Tips = () => {
  const [tips, setTips] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [currentTip, setCurrentTip] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tipToDelete, setTipToDelete] = useState(null); // Track which tip is being deleted
  const cancelRef = React.useRef();
  const toast = useToast();

  const loadTips = useCallback(async () => {
    try {
      const fetchedTips = await fetchTips();
      setTips(fetchedTips);
    } catch (error) {
      toast({
        title: 'Error loading tips',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    loadTips();
  }, [loadTips]);

  const handleAddOrUpdateTip = async () => {
    if (currentTip) {
      await handleUpdateTip();
    } else {
      await handleAddTip();
    }
  };

  const handleAddTip = async () => {
    try {
      await addTip({ title, content });
      toast({
        title: 'Tip added successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      loadTips();
      closeModal();
    } catch (error) {
      toast({
        title: 'Error adding tip',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdateTip = async () => {
    try {
      await updateTip(currentTip.id, { title, content });
      toast({
        title: 'Tip updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      loadTips();
      closeModal();
    } catch (error) {
      toast({
        title: 'Error updating tip',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const confirmDeleteTip = (tipId) => {
    setTipToDelete(tipId);
    setIsAlertOpen(true);
  };

  const handleDeleteTip = async () => {
    try {
      await deleteTip(tipToDelete);
      toast({
        title: 'Tip deleted successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      loadTips();
      setIsAlertOpen(false);
    } catch (error) {
      toast({
        title: 'Error deleting tip',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsAlertOpen(false);
    }
  };

  const openModal = (tip = null) => {
    if (tip) {
      setCurrentTip(tip);
      setTitle(tip.title);
      setContent(tip.content);
    } else {
      setCurrentTip(null);
      setTitle('');
      setContent('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Box p={4}>
      <VStack
        spacing={4}
        align="center"
        bg="teal.500"
        color="white"
        borderRadius="md"
        p={4}
        mb={6}
        shadow="md"
      >
        <Icon as={InfoIcon} boxSize={10} />
        <Heading size="md">Gardening Tips</Heading>
        <Text fontSize="lg" textAlign="center">
          Here you can add tips based on your gardening experience. Share your knowledge and help others improve their gardens!
        </Text>
      </VStack>

      <Button onClick={() => openModal()} leftIcon={<AddIcon />} colorScheme="teal" mb={4}>
        Add Tip
      </Button>

      <VStack spacing={4} align="stretch">
        {tips.length > 0 ? (
          tips.map((tip) => (
            <Box
              key={tip.id}
              p={4}
              borderRadius="md"
              shadow="md"
              transition="transform 0.2s, box-shadow 0.2s"
              _hover={{
                transform: 'translateY(-5px)',
                boxShadow: 'lg',
                cursor: 'pointer',
              }}
              onClick={() => openModal(tip)}
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Box>
                  <Heading size="md">{tip.title}</Heading>
                  <Text mt={2} isTruncated>
                    {tip.content}
                  </Text>
                </Box>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<BsThreeDotsVertical />}
                    variant="outline"
                    onClick={(e) => e.stopPropagation()} // Prevent modal from opening
                  />
                  <MenuList>
                    <MenuItem icon={<EditIcon />} onClick={(e) => {
                      e.stopPropagation(); // Prevent modal from opening
                      openModal(tip);
                    }}>
                      Edit
                    </MenuItem>
                    <MenuItem icon={<DeleteIcon />} onClick={(e) => {
                      e.stopPropagation(); // Prevent modal from opening
                      confirmDeleteTip(tip.id);
                    }}>
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </Box>
          ))
        ) : (
          <Text>No tips found</Text>
        )}
      </VStack>

      {/* Add/Edit Tip Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{currentTip ? 'Edit Tip' : 'Add Tip'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              mb={3}
            />
            <Textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleAddOrUpdateTip}>
              {currentTip ? 'Update Tip' : 'Add Tip'}
            </Button>
            <Button onClick={closeModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Tip
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this tip? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteTip} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Tips;

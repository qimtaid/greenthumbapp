import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Heading, Stack, Text, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea, useToast } from '@chakra-ui/react';
import { fetchTips, addTip, updateTip, deleteTip } from '../utils/api';

const Tips = () => {
    const [tips, setTips] = useState([]);
    const [editingTip, setEditingTip] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [formTitle, setFormTitle] = useState('');
    const [formContent, setFormContent] = useState('');
    const toast = useToast(); // Chakra UI toast for user feedback

    useEffect(() => {
        const fetchAllTips = async () => {
            try {
                const data = await fetchTips();
                setTips(data);
            } catch (error) {
                console.error('Error fetching tips:', error);
            }
        };

        fetchAllTips();
    }, []);

    const handleOpenForm = (tip = null) => {
        setEditingTip(tip);
        setFormTitle(tip ? tip.title : '');
        setFormContent(tip ? tip.content : '');
        onOpen();
    };

    const handleSubmit = async () => {
        if (!formTitle || !formContent) {
            toast({
                title: 'Validation Error',
                description: 'Title and content cannot be empty.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        try {
            const newTip = { title: formTitle, content: formContent, author_id: 1 }; // Replace with actual author_id
            if (editingTip) {
                await updateTip(editingTip.id, newTip);
                setTips(tips.map(tip => (tip.id === editingTip.id ? { ...tip, ...newTip } : tip)));
            } else {
                const addedTip = await addTip(newTip);
                setTips([...tips, addedTip]);
            }
            toast({
                title: editingTip ? 'Tip Updated' : 'Tip Added',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            onClose();
        } catch (error) {
            console.error('Error saving tip:', error);
            toast({
                title: 'Error',
                description: 'An error occurred while saving the tip.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTip(id);
            setTips(tips.filter(tip => tip.id !== id));
            toast({
                title: 'Tip Deleted',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error deleting tip:', error);
            toast({
                title: 'Error',
                description: 'An error occurred while deleting the tip.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box p={4}>
            <Button onClick={() => handleOpenForm()} colorScheme="teal" mb={4}>
                Add New Tip
            </Button>
            <Stack spacing={4}>
                {tips.map(tip => (
                    <Box key={tip.id} borderWidth={1} borderRadius="md" p={4} shadow="md">
                        <Heading size="md">{tip.title}</Heading>
                        <Text mt={2}>{tip.content}</Text>
                        <Flex mt={4} justify="space-between">
                            <Button colorScheme="blue" onClick={() => handleOpenForm(tip)}>
                                Edit
                            </Button>
                            <Button colorScheme="red" onClick={() => handleDelete(tip.id)}>
                                Delete
                            </Button>
                        </Flex>
                    </Box>
                ))}
            </Stack>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{editingTip ? 'Edit Tip' : 'Add Tip'}</ModalHeader>
                    <ModalBody>
                        <Stack spacing={4}>
                            <Input
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                                placeholder="Title"
                            />
                            <Textarea
                                value={formContent}
                                onChange={(e) => setFormContent(e.target.value)}
                                placeholder="Content"
                            />
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                            {editingTip ? 'Update' : 'Add'}
                        </Button>
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default Tips;

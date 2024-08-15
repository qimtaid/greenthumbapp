import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Flex,
    Heading,
    Stack,
    Text,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Select,
    FormControl,
    FormLabel,
    useToast
} from '@chakra-ui/react';
import { saveLayout, loadLayouts } from '../utils/api'; // Make sure these functions are correctly exported

// Component for the garden layout planner
const Layouts = () => {
    const [selectedPlant, setSelectedPlant] = useState('');
    const [layout, setLayout] = useState([]);
    const [layouts, setLayouts] = useState([]);
    const [layoutName, setLayoutName] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        const fetchLayouts = async () => {
            try {
                const data = await loadLayouts();
                // Assuming data comes as an array of layout objects with layout_data as a JSON string
                const parsedLayouts = data.map((layout) => ({
                    ...layout,
                    layout_data: JSON.parse(layout.layout_data)
                }));
                setLayouts(parsedLayouts);
            } catch (error) {
                console.error('Error fetching layouts:', error);
            }
        };
        fetchLayouts();
    }, []);

    const handlePlantSelect = (e) => {
        setSelectedPlant(e.target.value);
    };

    const handleAddPlant = () => {
        if (selectedPlant) {
            const newPlant = { plantId: selectedPlant, position: { x: 0, y: 0 } };
            setLayout([...layout, newPlant]);
        }
    };

    const handleSaveLayout = async () => {
        try {
            const layoutData = {
                name: layoutName,
                layout_data: JSON.stringify(layout),
                user_id: 1 // Assuming a static user ID for demonstration
            };
            await saveLayout(layoutData);
            toast({ title: 'Layout saved successfully!', status: 'success' });
            setLayout([]);
            setLayoutName('');
        } catch (error) {
            console.error('Error saving layout:', error);
            toast({ title: 'Error saving layout', status: 'error' });
        }
    };

    return (
        <Box p={4}>
            <Heading mb={4}>Garden Layout Planner</Heading>
            <Flex mb={4} direction="column" align="center">
                <Stack spacing={4} mb={4}>
                    <Select placeholder="Select a plant" onChange={handlePlantSelect}>
                        {layouts.map((layoutItem) => (
                            <option key={layoutItem.id} value={layoutItem.id}>
                                {layoutItem.name}
                            </option>
                        ))}
                    </Select>
                    <Button colorScheme="teal" onClick={handleAddPlant}>
                        Add Plant to Layout
                    </Button>
                </Stack>
                <FormControl mb={4}>
                    <FormLabel htmlFor="layoutName">Layout Name</FormLabel>
                    <Input
                        id="layoutName"
                        value={layoutName}
                        onChange={(e) => setLayoutName(e.target.value)}
                        placeholder="Enter layout name"
                    />
                </FormControl>
                <Flex mb={4}>
                    <Button colorScheme="blue" onClick={handleSaveLayout} mr={4}>
                        Save Layout
                    </Button>
                </Flex>
            </Flex>
            <Box borderWidth={1} borderRadius="md" p={4} minHeight="500px" position="relative" bg="gray.100">
                <Text mb={2}>Garden Layout:</Text>
                <Box borderWidth={1} borderRadius="md" height="400px" bg="green.50" position="relative" width="100%">
                    {layout.map((item, index) => (
                        <Box
                            key={index}
                            position="absolute"
                            top={`${item.position.y}px`}
                            left={`${item.position.x}px`}
                            width="50px"
                            height="50px"
                            bg="green.300"
                            borderRadius="md"
                            textAlign="center"
                            lineHeight="50px"
                        >
                            {item.plantId}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default Layouts;

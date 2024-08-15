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

// Mock data for plants
const plants = [
    { id: 1, name: 'Tomato' },
    { id: 2, name: 'Basil' },
    { id: 3, name: 'Cucumber' }
];

// Component for the garden layout planner
const Layouts = () => {
    const [selectedPlant, setSelectedPlant] = useState('');
    const [layout, setLayout] = useState([]);
    const [layouts, setLayouts] = useState([]);
    const [layoutName, setLayoutName] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [formPlantName, setFormPlantName] = useState('');
    const [formPlantType, setFormPlantType] = useState('');
    const toast = useToast();

    useEffect(() => {
        const fetchLayouts = async () => {
            try {
                const data = await loadLayouts();
                setLayouts(data);
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
            setLayout([...layout, { plantId: selectedPlant, position: { x: 0, y: 0 } }]);
        }
    };

    const handleSaveLayout = async () => {
        try {
            const layoutData = {
                name: layoutName,
                plants: layout
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

    const handleAddNewPlant = () => {
        
        console.log('New plant added:', formPlantName, formPlantType);
        onClose();
    };

    return (
        <Box p={4}>
            <Heading mb={4}>Garden Layout Planner</Heading>
            <Flex mb={4} direction="column" align="center">
                <Stack spacing={4} mb={4}>
                    <Select placeholder="Select a plant" onChange={handlePlantSelect}>
                        {plants.map((plant) => (
                            <option key={plant.id} value={plant.id}>
                                {plant.name}
                            </option>
                        ))}
                    </Select>
                    <Button colorScheme="teal" onClick={handleAddPlant}>Add Plant to Layout</Button>
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
                    <Button colorScheme="blue" onClick={handleSaveLayout} mr={4}>Save Layout</Button>
                </Flex>
                <Button colorScheme="teal" onClick={onOpen}>Add New Plant</Button>
            </Flex>
            <Box
                borderWidth={1}
                borderRadius="md"
                p={4}
                minHeight="500px"
                position="relative"
                bg="gray.100"
            >
                <Text mb={2}>Garden Layout:</Text>
                <Box
                    borderWidth={1}
                    borderRadius="md"
                    height="400px"
                    bg="green.50"
                    position="relative"
                    width="100%"
                >                   
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
                            {plants.find(p => p.id === item.plantId)?.name}
                        </Box>
                    ))}
                </Box>
            </Box>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Plant</ModalHeader>
                    <ModalBody>
                        <Stack spacing={4}>
                            <Input
                                value={formPlantName}
                                onChange={(e) => setFormPlantName(e.target.value)}
                                placeholder="Plant Name"
                            />
                            <Select
                                placeholder="Select Plant Type"
                                value={formPlantType}
                                onChange={(e) => setFormPlantType(e.target.value)}
                            >
                                <option value="Vegetable">Vegetable</option>
                                <option value="Herb">Herb</option>
                                <option value="Flower">Flower</option>
                            </Select>
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleAddNewPlant}>
                            Add Plant
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

export default Layouts;

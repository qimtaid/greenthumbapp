import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Select,
    Image,
    useDisclosure,
    useToast,
    VStack,
    Text,
    Grid,
    GridItem,
    IconButton,
    Input,
    Icon
} from '@chakra-ui/react';
import { FaThLarge, FaTrash, FaSave, FaMap } from 'react-icons/fa';
import { fetchPlants, addLayout, fetchLayouts } from '../utils/api';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Layouts = () => {
    const [plants, setPlants] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [layout, setLayout] = useState([]);
    const [layoutName, setLayoutName] = useState('');
    const [gridColumns, setGridColumns] = useState(3);
    const { isOpen: isAddModalOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
    const toast = useToast();

    // Fetch plants data
    const fetchPlantsData = useCallback(async () => {
        try {
            const data = await fetchPlants();
            setPlants(data);
        } catch (error) {
            toast({
                title: 'Error fetching plants',
                description: 'Unable to fetch plant data.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    }, [toast]);

    useEffect(() => {
        fetchPlantsData();
    }, [fetchPlantsData]);

    // Fetch layouts data
    useEffect(() => {
        const fetchSavedLayouts = async () => {
            try {
                const savedLayouts = await fetchLayouts();
                if (savedLayouts.length > 0) {
                    const firstLayout = savedLayouts[0];
                    setLayoutName(firstLayout.name);

                    const parsedLayout = firstLayout.layout_data; // already parsed in backend
                    if (
                        Array.isArray(parsedLayout) &&
                        parsedLayout.every(item =>
                            item &&
                            typeof item.plant_id === 'number' &&
                            typeof item.name === 'string' &&
                            typeof item.img_url === 'string'
                        )
                    ) {
                        setLayout(parsedLayout);
                    } else {
                        throw new Error('Invalid layout data format');
                    }
                }
            } catch (error) {
                toast({
                    title: 'Error fetching layouts',
                    description: error.message || 'Unable to fetch saved layouts.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        };

        fetchSavedLayouts();
    }, [toast]);

    // Add image to the layout
    const handleAddImage = () => {
        if (selectedPlant) {
            setLayout((prevLayout) => [...prevLayout, selectedPlant]);
            setSelectedPlant(null);
        }
    };

    // Save layout
    const handleSaveLayout = async () => {
        if (layoutName.trim() === '') {
            toast({
                title: 'Error',
                description: 'Please provide a layout name.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            const layoutData = {
                name: layoutName,
                layout_data: layout.map((plant) => ({
                    plant_id: plant.id, // ensuring correct field name
                    name: plant.name,
                    img_url: plant.img_url,
                    position: plant.position || { x: 0, y: 0 } // default position if not set
                })),
            };
            await addLayout(layoutData);
            toast({
                title: 'Layout saved',
                description: 'Your layout has been saved successfully.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error saving layout',
                description: 'Unable to save your layout.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // Drag and Drop functionality
    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedLayout = Array.from(layout);
        const [movedItem] = reorderedLayout.splice(result.source.index, 1);
        reorderedLayout.splice(result.destination.index, 0, movedItem);

        setLayout(reorderedLayout);
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
                <Icon as={FaMap} boxSize={10} />
                <Text fontSize="lg" textAlign="center">
                    Design your garden layout by adding and arranging plants. Use drag and drop to position your plants and save your layout for future reference.
                </Text>
            </VStack>

            <FormControl mb={4}>
                <FormLabel>Layout Name</FormLabel>
                <Input
                    placeholder="Enter layout name"
                    value={layoutName}
                    onChange={(e) => setLayoutName(e.target.value)}
                />
            </FormControl>
            <Button onClick={onAddOpen} leftIcon={<FaThLarge />}>
                Add Plant to Layout
            </Button>
            <Button onClick={handleSaveLayout} leftIcon={<FaSave />} ml={4}>
                Save Layout
            </Button>
            <FormControl mt={4}>
                <FormLabel>Grid Columns</FormLabel>
                <Select value={gridColumns} onChange={(e) => setGridColumns(parseInt(e.target.value, 10))}>
                    {[2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                            {num} Columns
                        </option>
                    ))}
                </Select>
            </FormControl>

            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="layoutGrid">
                    {(provided) => (
                        <Grid
                            templateColumns={`repeat(${gridColumns}, 1fr)`}
                            gap={6}
                            mt={4}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {layout.length > 0 ? (
                                layout.map((plant, index) => (
                                    <Draggable key={plant.plant_id} draggableId={`plant-${plant.plant_id}`} index={index}>
                                        {(provided) => (
                                            <GridItem
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                bg="gray.700" // Darker background for better contrast
                                                p={4}
                                                borderRadius="md"
                                                shadow="lg"
                                                color="white" // Ensure text is white for contrast
                                            >
                                                <VStack spacing={2}>
                                                    <Image
                                                        src={plant.img_url}
                                                        alt={plant.name}
                                                        boxSize="150px"
                                                        objectFit="cover"
                                                        fallbackSrc="https://via.placeholder.com/150"
                                                    />
                                                    <Text fontWeight="bold" fontSize="md">
                                                        {plant.name}
                                                    </Text>
                                                    <IconButton
                                                        aria-label="Delete plant"
                                                        icon={<FaTrash />}
                                                        colorScheme="red"
                                                        size="sm"
                                                        onClick={() => {
                                                            setLayout((prevLayout) =>
                                                                prevLayout.filter((_, i) => i !== index)
                                                            );
                                                        }}
                                                    />
                                                </VStack>
                                            </GridItem>
                                        )}
                                    </Draggable>
                                ))
                            ) : (
                                <GridItem>
                                    <Text>No plants in the layout</Text>
                                </GridItem>
                            )}
                            {provided.placeholder}
                        </Grid>
                    )}
                </Droppable>
            </DragDropContext>

            <Modal isOpen={isAddModalOpen} onClose={onAddClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Select Plant</ModalHeader>
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Plant</FormLabel>
                            <Select
                                placeholder="Select plant"
                                onChange={(e) => {
                                    const selected = plants.find((p) => p.id === parseInt(e.target.value, 10));
                                    setSelectedPlant(selected);
                                }}
                            >
                                {plants.map((plant) => (
                                    <option key={plant.id} value={plant.id}>
                                        {plant.name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleAddImage}>
                            Add Plant
                        </Button>
                        <Button variant="ghost" onClick={onAddClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default Layouts;

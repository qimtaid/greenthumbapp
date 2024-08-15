import React, { useState, useEffect } from 'react';
import {
    Button,
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    FormControl,
    FormLabel,
    Input,
    Select,
    useToast,
} from '@chakra-ui/react';
import {
    fetchCareSchedules,
    addCareSchedule,
    updateCareSchedule,
    deleteCareSchedule,
    fetchPlants,
} from '../utils/api';

const CareSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [plants, setPlants] = useState([]);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [plantId, setPlantId] = useState(''); // Plant ID state
    const toast = useToast();

    useEffect(() => {
        const fetchSchedulesAndPlants = async () => {
            try {
                if (plantId) { // Fetch schedules only if plantId is available
                    const [scheduleData, plantData] = await Promise.all([
                        fetchCareSchedules(plantId), // Pass plantId
                        fetchPlants(),
                    ]);
                    setSchedules(scheduleData);
                    setPlants(plantData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast({
                    title: 'Error fetching data',
                    description: error.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        };

        fetchSchedulesAndPlants();
    }, [plantId, toast]);

    const handleAddSchedule = async (scheduleData) => {
        try {
            const newSchedule = await addCareSchedule(plantId, scheduleData); // Pass plantId
            setSchedules((prevSchedules) => [...prevSchedules, newSchedule]);
            setShowForm(false);
            toast({
                title: 'Care schedule added',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error adding care schedule:', error);
            toast({
                title: 'Error adding care schedule',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleUpdateSchedule = async (id, scheduleData) => {
        try {
            const updatedSchedule = await updateCareSchedule(plantId, id, scheduleData); // Pass plantId
            setSchedules((prevSchedules) =>
                prevSchedules.map((schedule) =>
                    schedule.id === id ? updatedSchedule : schedule
                )
            );
            setEditingSchedule(null);
            setShowForm(false);
            toast({
                title: 'Care schedule updated',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error updating care schedule:', error);
            toast({
                title: 'Error updating care schedule',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleDeleteSchedule = async (id) => {
        try {
            await deleteCareSchedule(plantId, id); // Pass plantId
            setSchedules((prevSchedules) =>
                prevSchedules.filter((schedule) => schedule.id !== id)
            );
            toast({
                title: 'Care schedule deleted',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error deleting care schedule:', error);
            toast({
                title: 'Error deleting care schedule',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const CareScheduleForm = ({ schedule, onSave, onCancel }) => {
        const [task, setTask] = useState(schedule ? schedule.task : '');
        const [scheduleDate, setScheduleDate] = useState(
            schedule ? new Date(schedule.schedule_date).toISOString().substring(0, 10) : ''
        );
        const [interval, setInterval] = useState(schedule ? schedule.interval : '');

        const handleSubmit = (event) => {
            event.preventDefault();
            const newSchedule = { plant_id: plantId, task, schedule_date: scheduleDate, interval };
            if (schedule) {
                onSave(schedule.id, newSchedule);
            } else {
                onSave(newSchedule);
            }
        };

        return (
            <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="md">
                <form onSubmit={handleSubmit}>
                    <FormControl mb={3}>
                        <FormLabel>Task</FormLabel>
                        <Select
                            placeholder="Select task"
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            required
                        >
                            <option value="WATERING">WATERING</option>
                            <option value="PRUNING">PRUNING</option>
                            <option value="FERTILIZING">FERTILIZING</option>
                            <option value="HARVESTING">HARVESTING</option>
                        </Select>
                    </FormControl>
                    <FormControl mb={3}>
                        <FormLabel>Schedule Date</FormLabel>
                        <Input
                            type="date"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            required
                        />
                    </FormControl>
                    <FormControl mb={3}>
                        <FormLabel>Interval</FormLabel>
                        <Select
                            placeholder="Select interval"
                            value={interval}
                            onChange={(e) => setInterval(e.target.value)}
                            required
                        >
                            <option value="DAILY">DAILY</option>
                            <option value="WEEKLY">WEEKLY</option>
                            <option value="MONTHLY">MONTHLY</option>
                        </Select>
                    </FormControl>
                    <Button colorScheme="teal" mr={3} type="submit">
                        {schedule ? 'Update' : 'Add'} Schedule
                    </Button>
                    <Button onClick={onCancel}>Cancel</Button>
                </form>
            </Box>
        );
    };

    return (
        <Box p={4}>
            <FormControl mb={4}>
                <FormLabel>Select Plant</FormLabel>
                <Select
                    placeholder="Select plant"
                    value={plantId}
                    onChange={(e) => setPlantId(e.target.value)}
                    required
                >
                    {plants.map((plant) => (
                        <option key={plant.id} value={plant.id}>
                            {plant.name}
                        </option>
                    ))}
                </Select>
            </FormControl>
            <Button
                mb={4}
                colorScheme="teal"
                onClick={() => {
                    setEditingSchedule(null);
                    setShowForm(true);
                }}
            >
                Add New Schedule
            </Button>
            {showForm && (
                <CareScheduleForm
                    schedule={editingSchedule}
                    onSave={editingSchedule ? handleUpdateSchedule : handleAddSchedule}
                    onCancel={() => setShowForm(false)}
                />
            )}
            <Table variant="simple">
                <TableCaption>Care Schedules</TableCaption>
                <Thead>
                    <Tr>
                        <Th>Plant Name</Th>
                        <Th>Task</Th>
                        <Th>Schedule Date</Th>
                        <Th>Interval</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {schedules.length > 0 ? (
                        schedules.map((schedule) => (
                            <Tr key={schedule.id}>
                                <Td>{schedule.plant_name}</Td>
                                <Td>{schedule.task}</Td>
                                <Td>{new Date(schedule.schedule_date).toLocaleDateString()}</Td>
                                <Td>{schedule.interval}</Td>
                                <Td>
                                    <Button
                                        colorScheme="blue"
                                        size="sm"
                                        mr={2}
                                        onClick={() => {
                                            setEditingSchedule(schedule);
                                            setShowForm(true);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        colorScheme="red"
                                        size="sm"
                                        onClick={() => handleDeleteSchedule(schedule.id)}
                                    >
                                        Delete
                                    </Button>
                                </Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td colSpan="5">No care schedules available</Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>
        </Box>
    );
};

export default CareSchedule;

import React, { useState, useEffect } from 'react';
import { Button, Box, Table, Thead, Tbody, Tr, Th, Td, TableCaption, FormControl, FormLabel, Input, Select, useToast } from '@chakra-ui/react';
import { fetchCareSchedules, addCareSchedule, updateCareSchedule, deleteCareSchedule, fetchPlants, fetchTasks, fetchIntervals } from '../utils/api';

const CareSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [plants, setPlants] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [intervals, setIntervals] = useState([]);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const fetchSchedulesAndData = async () => {
            try {
                const [scheduleData, plantData, taskData, intervalData] = await Promise.all([
                    fetchCareSchedules(),
                    fetchPlants(),
                    fetchTasks(),
                    fetchIntervals()
                ]);
                setSchedules(scheduleData);
                setPlants(plantData);
                setTasks(taskData);
                setIntervals(intervalData);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast({
                    title: 'Error fetching data',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                });
            }
        };

        fetchSchedulesAndData();
    }, [toast]);

    const handleAddSchedule = async (scheduleData) => {
        try {
            const newSchedule = await addCareSchedule(scheduleData);
            setSchedules([...schedules, newSchedule]);
            setShowForm(false);
        } catch (error) {
            console.error('Error adding care schedule:', error);
            toast({
                title: 'Error adding care schedule',
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
        }
    };

    const handleUpdateSchedule = async (id, scheduleData) => {
        try {
            const updatedSchedule = await updateCareSchedule(id, scheduleData);
            setSchedules(schedules.map(schedule => schedule.id === id ? updatedSchedule : schedule));
            setEditingSchedule(null);
            setShowForm(false);
        } catch (error) {
            console.error('Error updating care schedule:', error);
            toast({
                title: 'Error updating care schedule',
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
        }
    };

    const handleDeleteSchedule = async (id) => {
        try {
            await deleteCareSchedule(id);
            setSchedules(schedules.filter(schedule => schedule.id !== id));
        } catch (error) {
            console.error('Error deleting care schedule:', error);
            toast({
                title: 'Error deleting care schedule',
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
        }
    };

    const CareScheduleForm = ({ schedule, onSave, onCancel }) => {
        const [plantName, setPlantName] = useState(schedule ? schedule.plant_name : '');
        const [task, setTask] = useState(schedule ? schedule.task : '');
        const [scheduleDate, setScheduleDate] = useState(schedule ? new Date(schedule.schedule_date).toISOString().substring(0, 10) : '');
        const [interval, setInterval] = useState(schedule ? schedule.interval : '');

        const handleSubmit = (event) => {
            event.preventDefault();
            const newSchedule = { plant_name: plantName, task, schedule_date: scheduleDate, interval };
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
                        <FormLabel>Plant</FormLabel>
                        <Select
                            placeholder="Select plant"
                            value={plantName}
                            onChange={(e) => setPlantName(e.target.value)}
                            required
                        >
                            {plants.map((plant) => (
                                <option key={plant.id} value={plant.name}>
                                    {plant.name}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl mb={3}>
                        <FormLabel>Task</FormLabel>
                        <Select
                            placeholder="Select task"
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            required
                        >
                            {tasks.map((taskItem) => (
                                <option key={taskItem.id} value={taskItem.name}>
                                    {taskItem.name}
                                </option>
                            ))}
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
                            {intervals.map((intervalItem) => (
                                <option key={intervalItem.id} value={intervalItem.name}>
                                    {intervalItem.name}
                                </option>
                            ))}
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
            <Button mb={4} colorScheme="teal" onClick={() => { setEditingSchedule(null); setShowForm(true); }}>
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
                                        onClick={() => { setEditingSchedule(schedule); setShowForm(true); }}
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

import React, { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
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
  Select,
  useDisclosure,
  useToast,
  VStack,
  Heading,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Icon,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaEllipsisV, FaCalendarPlus } from 'react-icons/fa';
import { fetchCareSchedules, addCareSchedule, updateCareSchedule, deleteCareSchedule, fetchPlants } from '../utils/api';

const CareSchedule = () => {
  const [careSchedules, setCareSchedules] = useState([]);
  const [plants, setPlants] = useState([]);
  const [formData, setFormData] = useState({
    task: '',
    schedule_date: '',
    interval: '',
    plant_id: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [currentScheduleId, setCurrentScheduleId] = useState(null);

  const { isOpen: isAddEditModalOpen, onOpen: onOpenAddEditModal, onClose: onCloseAddEditModal } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onOpenDeleteModal, onClose: onCloseDeleteModal } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    loadCareSchedules();
    loadPlants();
  }, []);

  const loadCareSchedules = async () => {
    try {
      const schedules = await fetchCareSchedules();
      setCareSchedules(schedules);
    } catch (error) {
      console.error('Error fetching care schedules:', error);
    }
  };

  const loadPlants = async () => {
    try {
      const plants = await fetchPlants();
      setPlants(plants);
    } catch (error) {
      console.error('Error fetching plants:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateCareSchedule(currentScheduleId, formData);
        toast({
          title: 'Care Schedule Updated.',
          description: 'The care schedule has been successfully updated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setEditMode(false);
        setCurrentScheduleId(null);
      } else {
        await addCareSchedule(formData);
        toast({
          title: 'Care Schedule Added.',
          description: 'The care schedule has been successfully added.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      setFormData({ task: '', schedule_date: '', interval: '', plant_id: '' });
      onCloseAddEditModal();
      loadCareSchedules();
    } catch (error) {
      console.error('Error saving care schedule:', error);
      toast({
        title: 'Error.',
        description: 'There was an error saving the care schedule.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const openAddModal = () => {
    setFormData({ task: '', schedule_date: '', interval: '', plant_id: '' }); // Reset form data
    setEditMode(false);
    onOpenAddEditModal();
  };

  const openEditModal = (schedule) => {
    setCurrentScheduleId(schedule.id);
    setFormData({
      task: schedule.task,
      schedule_date: schedule.schedule_date,
      interval: schedule.interval,
      plant_id: schedule.plant_id,
    });
    setEditMode(true);
    onOpenAddEditModal();
  };

  const openDeleteModal = (schedule) => {
    setCurrentScheduleId(schedule.id);
    onOpenDeleteModal();
  };

  const handleDeleteSchedule = async () => {
    try {
      await deleteCareSchedule(currentScheduleId);
      toast({
        title: 'Care Schedule Deleted.',
        description: 'The care schedule has been successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onCloseDeleteModal();
      loadCareSchedules();
    } catch (error) {
      console.error('Error deleting care schedule:', error);
      toast({
        title: 'Error.',
        description: 'There was an error deleting the care schedule.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const checkIfDue = useCallback((scheduleDate, interval, now) => {
    if (interval === 'daily') {
      return now.isSame(scheduleDate, 'day');
    }
    if (interval === 'weekly') {
      return now.isSame(scheduleDate.add(1, 'week'), 'week');
    }
    if (interval === 'fortnightly') {
      return now.isSame(scheduleDate.add(2, 'weeks'), 'week');
    }
    if (interval === 'monthly') {
      return now.isSame(scheduleDate.add(1, 'month'), 'month');
    }
    return false;
  }, []);

  const checkDueCareSchedules = useCallback(() => {
    const now = dayjs();
    careSchedules.forEach(schedule => {
      const scheduleDate = dayjs(schedule.schedule_date);
      const interval = schedule.interval;
      const isDue = checkIfDue(scheduleDate, interval, now);

      if (isDue) {
        toast({
          title: 'Care Schedule Due!',
          description: `It's time to perform the task: ${schedule.task} for your plant.`,
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
      }
    });
  }, [careSchedules, checkIfDue, toast]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkDueCareSchedules();
    }, 60000); // Check every 60 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [careSchedules, checkDueCareSchedules]);

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
        <Icon as={FaCalendarPlus} boxSize={10} />
        <Heading size="md">Manage Your Care Schedules</Heading>
        <Text fontSize="lg" textAlign="center">
          Track and manage care schedules for your plants. Add, edit, or delete care tasks as needed.
        </Text>
      </VStack>

      <Button mb={4} colorScheme="teal" onClick={openAddModal}>
        Add Care Schedule
      </Button>

      <Table variant="simple">
        <TableCaption>Care Schedules</TableCaption>
        <Thead>
          <Tr>
            <Th>Task</Th>
            <Th>Schedule Date</Th>
            <Th>Interval</Th>
            <Th>Plant</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {careSchedules.length > 0 ? (
            careSchedules.map((schedule) => (
              <Tr key={schedule.id}>
                <Td>{schedule.task}</Td>
                <Td>{schedule.schedule_date}</Td>
                <Td>{schedule.interval}</Td>
                <Td>
                  {plants.find((plant) => plant.id === schedule.plant_id)?.name || 'Unknown Plant'}
                </Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<FaEllipsisV />}
                      variant="outline"
                    />
                    <MenuList>
                      <MenuItem
                        icon={<FaEdit />}
                        onClick={() => openEditModal(schedule)}
                      >
                        Edit
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem
                        icon={<FaTrash />}
                        onClick={() => openDeleteModal(schedule)}
                      >
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan="5">No care schedules found</Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      <Modal isOpen={isAddEditModalOpen} onClose={onCloseAddEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editMode ? 'Edit Care Schedule' : 'Add Care Schedule'}</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl id="task" isRequired>
                <FormLabel>Task</FormLabel>
                <Input
                  name="task"
                  value={formData.task}
                  onChange={handleChange}
                  placeholder="e.g., Watering"
                />
              </FormControl>
              <FormControl id="schedule_date" mt={4} isRequired>
                <FormLabel>Schedule Date</FormLabel>
                <Input
                  type="date"
                  name="schedule_date"
                  value={formData.schedule_date}
                  onChange={handleChange}
                  placeholder="Select a date"
                />
              </FormControl>
              <FormControl id="interval" mt={4} isRequired>
                <FormLabel>Interval</FormLabel>
                <Select
                  name="interval"
                  value={formData.interval}
                  onChange={handleChange}
                  placeholder="Select interval"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="fortnightly">Fortnightly</option>
                  <option value="monthly">Monthly</option>
                </Select>
              </FormControl>
              <FormControl id="plant_id" mt={4} isRequired>
                <FormLabel>Plant</FormLabel>
                <Select
                  name="plant_id"
                  value={formData.plant_id}
                  onChange={handleChange}
                  placeholder="Select a plant"
                >
                  {plants.map((plant) => (
                    <option key={plant.id} value={plant.id}>
                      {plant.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <ModalFooter>
                <Button type="submit" colorScheme="teal" mr={3}>
                  {editMode ? 'Update' : 'Add'}
                </Button>
                <Button onClick={onCloseAddEditModal}>Cancel</Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Care Schedule</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this care schedule? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleDeleteSchedule} mr={3}>
              Delete
            </Button>
            <Button onClick={onCloseDeleteModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CareSchedule;

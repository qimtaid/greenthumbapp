import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Heading,
  Input,
  VStack,
  HStack,
  IconButton,
  useColorModeValue,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Text,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

const LayoutManager = () => {
  const [layouts, setLayouts] = useState([]);
  const [newLayout, setNewLayout] = useState({ name: '', description: '' });
  const [editingLayoutId, setEditingLayoutId] = useState(null);

  useEffect(() => {
    fetchLayouts();
  }, []);

  const fetchLayouts = () => {
    axios.get('http://127.0.0.1:5000/layouts')
      .then(response => setLayouts(response.data))
      .catch(error => console.error('Error fetching layouts:', error));
  };

  const handleAddLayout = () => {
    axios.post('http://127.0.0.1:5000/layouts', newLayout)
      .then(response => {
        setLayouts([...layouts, response.data]);
        setNewLayout({ name: '', description: '' });
      })
      .catch(error => console.error('Error adding layout:', error));
  };

  const handleEditLayout = (layoutId) => {
    axios.put(`http://127.0.0.1:5000/layouts/${layoutId}`, newLayout)
      .then(response => {
        setLayouts(layouts.map(layout =>
          layout.id === layoutId ? response.data : layout
        ));
        setEditingLayoutId(null);
        setNewLayout({ name: '', description: '' });
      })
      .catch(error => console.error('Error editing layout:', error));
  };

  const handleDeleteLayout = (layoutId) => {
    axios.delete(`http://127.0.0.1:5000/layouts/${layoutId}`)
      .then(() => {
        setLayouts(layouts.filter(layout => layout.id !== layoutId));
      })
      .catch(error => console.error('Error deleting layout:', error));
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box maxW="5xl" mx="auto" mt={10} p={4}>
      <Heading mb={6} textAlign="center">Layout Manager</Heading>

      <Box mb={8} p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={bgColor}>
        <Heading fontSize="lg" mb={4} color={textColor}>Add New Layout</Heading>
        <VStack spacing={4}>
          <Input
            placeholder="Layout Name"
            value={newLayout.name}
            onChange={(e) => setNewLayout({ ...newLayout, name: e.target.value })}
          />
          <Input
            placeholder="Layout Description"
            value={newLayout.description}
            onChange={(e) => setNewLayout({ ...newLayout, description: e.target.value })}
          />
          <Button onClick={editingLayoutId ? () => handleEditLayout(editingLayoutId) : handleAddLayout} colorScheme="teal">
            {editingLayoutId ? 'Save Changes' : 'Add Layout'}
          </Button>
        </VStack>
      </Box>

      <VStack spacing={6} align="stretch">
        {layouts.map(layout => (
          <Card key={layout.id} bg={bgColor} shadow="md" borderWidth="1px" borderRadius="lg">
            <CardHeader>
              <HStack justify="space-between">
                <Heading fontSize="xl" color={textColor}>{layout.name}</Heading>
                <HStack>
                  <IconButton
                    icon={<EditIcon />}
                    onClick={() => {
                      setEditingLayoutId(layout.id);
                      setNewLayout({ name: layout.name, description: layout.description });
                    }}
                    size="sm"
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    onClick={() => handleDeleteLayout(layout.id)}
                    size="sm"
                  />
                </HStack>
              </HStack>
            </CardHeader>
            <CardBody>
              <Text color={textColor}>{layout.description}</Text>
            </CardBody>
            <CardFooter>
              <Text color={textColor}>Created on: {new Date(layout.created_at).toLocaleDateString()}</Text>
            </CardFooter>
          </Card>
        ))}
      </VStack>
    </Box>
  );
};

export default LayoutManager;

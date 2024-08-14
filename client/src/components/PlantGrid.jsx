import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import { SimpleGrid } from '@chakra-ui/react';
import PlantCard from './PlantCard';

const PlantGrid = ({ plants, onEdit, onDelete, userId }) => {
  return (
    <SimpleGrid columns={[1, 2, 3]} spacing={10}>
      {plants.map((plant) => (
        <PlantCard
          key={plant.id}
          plant={plant}
          onEdit={onEdit}
          onDelete={onDelete}
          canEdit={plant.user_id === userId}
        />
      ))}
    </SimpleGrid>
  );
};

// Define PropTypes
PlantGrid.propTypes = {
  plants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      user_id: PropTypes.number.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};

export default PlantGrid;

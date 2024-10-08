// GraphPage.js
import React, { useState } from 'react';
import GraphController from './GraphController';
import EditModal from './EditModal';
import SaveButton from './SaveButton';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import { Container, Grid } from '@mui/material';

const useStyles = () => ({
  graphContainer: {
    margin: '20px auto',
    maxWidth: '800px',
  },
  iconsContainer: {
    position: 'absolute',
    top: '20px',
    right: '20px',
  },
});

const GraphPage = () => {
  const classes = useStyles();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [initialParameters, setInitialParameters] = useState({
    xAxis: 'initialXAxis',
    yAxis: 'initialYAxis',
    groupVariable: 'initialGroupVariable',
    // Add other initial parameters as needed
  });

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSave = () => {
    // Logic to save graph settings and download plotted graph
    console.log('Saving graph settings...');
  };

  const handleDelete = () => {
    // Logic to delete changes made to the graph and reset it
    console.log('Deleting changes and resetting graph...');
  };

  return (
    <Container>
      <div style={classes.iconsContainer}>
        <SaveButton onClick={handleSave} />
        <EditButton onClick={openEditModal} />
        <DeleteButton onClick={handleDelete} />
      </div>
      <Grid container style={classes.graphContainer}>
        <Grid item xs={12}>
          <GraphController initialParameters={initialParameters} />
        </Grid>
      </Grid>
      {isEditModalOpen && <EditModal onClose={closeEditModal} initialParameters={initialParameters} />}
    </Container>
  );
};

export default GraphPage;

// EditModal.js
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const EditModal = ({ onClose }) => {
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [groupVariable, setGroupVariable] = useState('');

  const handleSave = () => {
    // Logic to save the edited graph settings
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Edit Graph</DialogTitle>
      <DialogContent>
        <FormControl fullWidth style={{ marginBottom: '16px' }}>
          <InputLabel>X-Axis</InputLabel>
          <Select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
            {/* Add options for X-Axis */}
          </Select>
        </FormControl>
        <FormControl fullWidth style={{ marginBottom: '16px' }}>
          <InputLabel>Y-Axis</InputLabel>
          <Select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
            {/* Add options for Y-Axis */}
          </Select>
        </FormControl>
        <FormControl fullWidth style={{ marginBottom: '16px' }}>
          <InputLabel>Group By</InputLabel>
          <Select value={groupVariable} onChange={(e) => setGroupVariable(e.target.value)}>
            {/* Add options for Group By */}
          </Select>
        </FormControl>
        {/* Add other controls as needed */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;

// SaveButton.js
import React from 'react';
import { IconButton } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const SaveButton = ({ onClick }) => {
  return (
    <IconButton onClick={onClick}>
      <SaveIcon />
    </IconButton>
  );
};

export default SaveButton;

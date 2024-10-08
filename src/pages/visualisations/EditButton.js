// EditButton.js
import React from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const EditButton = ({ onClick }) => {
  return (
    <IconButton onClick={onClick}>
      <EditIcon />
    </IconButton>
  );
};

export default EditButton;

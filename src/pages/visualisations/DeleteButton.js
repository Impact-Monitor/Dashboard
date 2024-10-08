// DeleteButton.js
import React from 'react';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteButton = ({ onClick }) => {
  return (
    <IconButton onClick={onClick}>
      <DeleteIcon />
    </IconButton>
  );
};

export default DeleteButton;

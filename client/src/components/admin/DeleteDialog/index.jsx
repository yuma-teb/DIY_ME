import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

const DeleteDialog = ({ open, name, onClose, onDelete, id }) => {
  const handleClose = () => {
    onClose();
  };

  const handleDelete = (id) => {
    onDelete(id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="delete-dialog-title">
      <DialogTitle id="delete-dialog-title">Delete User</DialogTitle>
      <DialogContent>
        <DialogContentText>Do you want to delete "{name}"?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete(id)} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;

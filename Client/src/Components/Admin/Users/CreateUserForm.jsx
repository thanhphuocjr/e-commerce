import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import userService from '../../../Api/Admin/userService';

const CreateUserForm = ({ open, onClose, onSuccess }) => {
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'user',
    status: 'active',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await userService.addUser(newUser);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Add user error:', error);
    }
  };

  // Shared SelectProps cho tất cả select fields
  const selectProps = {
    MenuProps: {
      disablePortal: false, // Đổi thành false để menu render ra ngoài Dialog
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
      },
      transformOrigin: {
        vertical: 'top',
        horizontal: 'left',
      },
      PaperProps: {
        style: {
          maxHeight: 250,
        },
      },
    },
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent
        dividers
        sx={{
          // Fix overflow để menu không bị cắt
          overflow: 'visible',
        }}
      >
        <TextField
          margin="dense"
          label="Email"
          name="email"
          fullWidth
          value={newUser.email}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Password"
          name="password"
          type="password"
          fullWidth
          value={newUser.password}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Full Name"
          name="fullName"
          fullWidth
          value={newUser.fullName}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          label="Role"
          name="role"
          select
          fullWidth
          value={newUser.role}
          onChange={handleInputChange}
          SelectProps={selectProps}
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="user">User</MenuItem>
        </TextField>
        <TextField
          margin="dense"
          label="Status"
          name="status"
          select
          fullWidth
          value={newUser.status}
          onChange={handleInputChange}
          SelectProps={selectProps}
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
          <MenuItem value="blocked">Blocked</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserForm;

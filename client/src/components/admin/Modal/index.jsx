import React from 'react';
import { useState } from 'react';
import { Button, Modal, Typography, IconButton, TextField, Box, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { deepOrange } from '@mui/material/colors';

const index = () => {
  //For Add Modal
  //Style for Modal
  const ModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  //for Form: Muiltiple textfields
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleFormChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    //form submission logic here
    console.log('Form submitted', formData);
  };

  return (
    <>
      <Button
        color="primary"
        onClick={handleClickOpenModal}
        variant="contained"
        className="btn-custom"
      >
        Open Modal
      </Button>
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle}>
          <div className="d-flex j-spacebtw">
            <Typography
              sx={{ marginBottom: '10px' }}
              id="modal-modal-title"
              variant="h2"
              component="h2"
            >
              Add User
            </Typography>
            <IconButton>
              <CloseIcon onClick={handleCloseModal} />
            </IconButton>
          </div>
          <div className="d-flex j-spacebtw">
            <div className="formField">
              <form onSubmit={handleFormSubmit}>
                <TextField
                  id="outlined-controlled"
                  label="Username"
                  name="username"
                  className="formField-text"
                  sx={{ margin: '12px 0px' }}
                  value={formData.username}
                  onChange={handleFormChange}
                ></TextField>
                <TextField
                  id="outlined-controlled"
                  label="Email"
                  name="email"
                  className="formField-text"
                  sx={{ margin: '12px 0px' }}
                  value={formData.email}
                  onChange={handleFormChange}
                ></TextField>
                <TextField
                  id="outlined-controlled"
                  label="First Name"
                  name="firstName"
                  className="formField-text"
                  sx={{ margin: '12px 0px' }}
                  value={formData.firstName}
                  onChange={handleFormChange}
                ></TextField>
                <TextField
                  id="outlined-controlled"
                  label="Last Name"
                  name="lastName"
                  className="formField-text"
                  sx={{ margin: '12px 0px' }}
                  value={formData.lastName}
                  onChange={handleFormChange}
                ></TextField>
                <TextField
                  id="outlined-controlled"
                  label="Phone"
                  name="phone"
                  className="formField-text"
                  sx={{ margin: '12px 0px' }}
                  value={formData.phone}
                  onChange={handleFormChange}
                ></TextField>
                <TextField
                  id="outlined-controlled"
                  label="Password"
                  name="password"
                  type="password"
                  className="formField-text"
                  sx={{ margin: '12px 0px' }}
                  value={formData.password}
                  onChange={handleFormChange}
                ></TextField>
                <TextField
                  id="outlined-controlled"
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  className="formField-text"
                  sx={{ margin: '12px 0px' }}
                  value={formData.confirmPassword}
                  onChange={handleFormChange}
                ></TextField>
                <Button
                  sx={{ flexGrow: '0', marginRight: '16px', color: '#fff' }}
                  color="view"
                  variant="contained"
                  className="btn-custom"
                >
                  save
                </Button>
              </form>
            </div>
            <div className="user-avatar d-flex flex-col">
              <Avatar
                className="selfcenter"
                sx={{
                  bgcolor: deepOrange[500],
                  width: '132px',
                  height: '132px',
                  marginBottom: '24px',
                }}
              >
                N
              </Avatar>
              <div className="selfcenter">
                <Button
                  sx={{ flexGrow: '0' }}
                  color="secondary"
                  variant="contained"
                  className="btn-custom"
                >
                  Add Picture
                </Button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default index;

import React from 'react';
import { useState } from 'react';
import { useAddUserMutation } from '../../../redux/store';
import {
  Button,
  Modal,
  Typography,
  IconButton,
  TextField,
  Select,
  Box,
  MenuItem,
  InputLabel,
  Grid,
  FormControl,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// import { deepOrange } from '@mui/material/colors';

const index = () => {
  const textFieldStyle = { margin: '12px 0px' };
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
  const [addUser, { isLoading: addUserLoading, isError: addUserError }] = useAddUserMutation();

  const handleClickOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setFormData(defaultForm);
    setOpen(false);
  };
  const defaultForm = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'Member',
    password: '',
    confirmPassword: '',
  };

  //for Form: Muiltiple textfields
  const [formData, setFormData] = useState(defaultForm);

  const handleFormChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      //form submission logic here
      const result = await addUser(formData);
      // console.log('Form submitted', formData);
      // console.log('Form submitted', result);
      // Reset the form to the initial state
      setFormData(defaultForm);
      // Close the modal
      setOpen(false);
    } catch (err) {
      console.log('error', err);
    }
  };

  return (
    <>
      <Button
        color="primary"
        onClick={handleClickOpenModal}
        variant="contained"
        className="btn-custom"
      >
        Add User
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
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
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
                  style={textFieldStyle}
                  value={formData.username}
                  onChange={handleFormChange}
                ></TextField>
                <TextField
                  id="outlined-controlled"
                  label="Email"
                  name="email"
                  className="formField-text"
                  style={textFieldStyle}
                  value={formData.email}
                  onChange={handleFormChange}
                ></TextField>
                <TextField
                  id="outlined-controlled"
                  label="First Name"
                  name="firstName"
                  className="formField-text"
                  style={textFieldStyle}
                  value={formData.firstName}
                  onChange={handleFormChange}
                ></TextField>
                <TextField
                  id="outlined-controlled"
                  label="Last Name"
                  name="lastName"
                  className="formField-text"
                  style={textFieldStyle}
                  value={formData.lastName}
                  onChange={handleFormChange}
                ></TextField>
                <TextField
                  id="outlined-controlled"
                  label="Phone"
                  name="phone"
                  className="formField-text"
                  style={textFieldStyle}
                  value={formData.phone}
                  onChange={handleFormChange}
                ></TextField>
                <FormControl fullWidth style={textFieldStyle}>
                  <InputLabel id="demo-simple-select-label">Role</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formData.role}
                    label="Role"
                    name="role"
                    onChange={handleFormChange}
                    className="formField-text"
                  >
                    {/* <MenuItem value="" disabled>
                      <em>Role</em>
                    </MenuItem> */}
                    <MenuItem value={'Admin'}>Admin</MenuItem>
                    <MenuItem value={'Member'}>Member</MenuItem>
                    <MenuItem value={'Shop'}>Shop</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  id="outlined-controlled"
                  label="Password"
                  name="password"
                  type="password"
                  className="formField-text"
                  style={textFieldStyle}
                  value={formData.password}
                  onChange={handleFormChange}
                ></TextField>
                <TextField
                  id="outlined-controlled"
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  className="formField-text"
                  style={textFieldStyle}
                  value={formData.confirmPassword}
                  onChange={handleFormChange}
                ></TextField>
                <Grid container spacing={1} mt={2}>
                  <Grid item lg={11}>
                    <div className="d-flex itemcenter">
                      <Button color="nonAction" onClick={() => setOpen(false)}>
                        CANCEL
                      </Button>
                      <Button
                        sx={{ flexGrow: '0', marginRight: '16px', color: '#fff' }}
                        color="view"
                        variant="contained"
                        type="submit"
                        disabled={addUserLoading}
                        className="btn-custom selfcenter"
                      >
                        save
                      </Button>
                    </div>
                  </Grid>
                </Grid>
                {addUserLoading && <div>Adding user...</div>}
                {addUserError && <div>Error adding user!</div>}
              </form>
            </div>
            {/* <div className="user-avatar d-flex flex-col">
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
            </div> */}
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default index;

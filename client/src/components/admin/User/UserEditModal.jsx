import React from 'react';
import { useState, useEffect } from 'react';
import { useFetchUserByIdQuery, useEditUserMutation } from '../../../redux/store';
import {
  Button,
  Modal,
  Typography,
  IconButton,
  TextField,
  Select,
  Box,
  Avatar,
  MenuItem,
  InputLabel,
  Grid,
  FormControl,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

const UserEditModal = (id) => {
  const objectId = id?.id;
  const textFieldStyle = { margin: '12px 0px' };
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
  const {
    data,
    error: fetchUserError,
    isLoading: fetchUserLoading,
  } = useFetchUserByIdQuery(objectId);
  const [open, setOpen] = React.useState(false);
  const [editUser, { isLoading: editUserLoading, isError: editUserError }] = useEditUserMutation();
  const [user, setUser] = useState({});
  //for Form: Muiltiple textfields
  const defaultForm = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'Member',
    isActive: true,
    password: '',
    confirmPassword: '',
  };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    getUser();
  }, [open]);

  const getUser = () => {
    if (data?.data?.doc) {
      setUser(data?.data?.doc);
      setFormData({
        username: data?.data?.doc?.username || '',
        email: data?.data?.doc?.email || '',
        firstName: data?.data?.doc?.firstName || '',
        lastName: data?.data?.doc?.lastName || '',
        phone: data?.data?.doc?.phone || '',
        role: data?.data?.doc?.role || 'Member',
        isActive: data?.data?.doc?.isActive || true,
        password: '',
        confirmPassword: '',
      });
    }
  };

  if (fetchUserLoading) {
    return <div>Loading user details...</div>;
  }
  if (fetchUserError) {
    return <Alert severity="error">Error loading user details!</Alert>;
  }
  if (!data) {
    return <div>No user data available</div>;
  }

  const handleClickOpenModal = () => {
    setOpen(true);
    console.log(user);
  };

  const handleCloseModal = () => {
    // setFormData();
    setOpen(false);
  };

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
      // Create a new object with non-empty fields
      const updatedFields = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value !== '' && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});
      // Check if there are any non-empty fields to update
      if (Object.keys(updatedFields).length === 0) {
        console.log('No fields to update.');
        return;
      }
      const result = await editUser({
        id: user?._id,
        updatedUser: updatedFields,
      });
      //   console.log('Form submitted', formData);
      console.log('Form submitted', result);
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
      <IconButton onClick={handleClickOpenModal}>
        <EditIcon color="success" />
      </IconButton>
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
              Edit User
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
                <FormControl fullWidth sx={{ margin: '12px 0' }}>
                  <InputLabel id="demo-simple-select-label">Role</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formData.role}
                    label="Role"
                    name="role"
                    onChange={handleFormChange}
                    className="formField-text"
                    style={textFieldStyle}
                    MenuProps={{
                      sx: {
                        '& .Mui-selected': {
                          backgroundColor: '#F3D8C7',
                        },
                      },
                    }}
                  >
                    {/* <MenuItem value="" disabled>
                      <em>Role</em>
                    </MenuItem> */}
                    <MenuItem value={'Admin'}>Admin</MenuItem>
                    <MenuItem value={'Member'}>Member</MenuItem>
                    <MenuItem value={'Shop'}>Shop</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth style={textFieldStyle}>
                  <InputLabel id="demo-simple-select-label2">IsActive</InputLabel>
                  <Select
                    labelId="demo-simple-select-label2"
                    id="demo-simple-select"
                    value={formData.isActive}
                    label="IsActive"
                    name="isActive"
                    onChange={handleFormChange}
                    className="formField-text"
                  >
                    {/* <MenuItem value={true} disabled>
                      <em>isActive</em>
                    </MenuItem> */}
                    <MenuItem value={true}>True</MenuItem>
                    <MenuItem value={false}>False</MenuItem>
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
                        disabled={editUserLoading}
                        className="btn-custom"
                        onClick={handleFormSubmit}
                      >
                        save
                      </Button>
                    </div>
                  </Grid>
                </Grid>
                {editUserLoading && <div>Editting user...</div>}
                {editUserError && <div>Error editting user!</div>}
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

export default UserEditModal;

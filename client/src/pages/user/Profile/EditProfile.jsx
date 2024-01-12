import React from 'react';
import { useState, useEffect } from 'react';
import {
  Container,
  Avatar,
  Button,
  IconButton,
  Grid,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { useEditSelfMutation } from '../../../redux/store';
import CloseIcon from '@mui/icons-material/Close';

const EditProfile = ({ userInfo, onEditComplete }) => {
  const userProps = userInfo;
  const [user, setUser] = useState({});
  const [choseFile, setChoseFile] = useState();
  const [preview, setPreview] = useState();
  const [showSave, setShowSave] = useState(false);
  const [formData, setFormData] = useState(null);
  const [img, setImg] = useState(null);
  const [editProfile, { isLoading: editProfileLoading, isError: editProfileError }] =
    useEditSelfMutation();

  useEffect(() => {
    setImg(localStorage.getItem('img'));
    if (userProps) {
      // console.log(userProps);
      window.scrollTo(0, 0);
      setFormData({
        username: userProps.username || '',
        email: userProps.email || '',
        phone: userProps.phone ? userProps.phone : '',
        role: userProps.role || 'Member',
        address: userProps.address ? userProps.address : '',
      });
    }
  }, [localStorage.getItem('img'), userProps]);

  // create a preview, whenever selected file is changed
  useEffect(() => {
    if (!choseFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(choseFile);
    setPreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [choseFile]);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setUser((user) => ({
        ...user,
        [name]: files[0],
      }));
      // console.log(userProps);
      setChoseFile(e.target.files[0]);
      setShowSave(true);
    } else {
      setUser((user) => ({
        ...user,
        [name]: value,
      }));
    }
  };

  const handleFormChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataImg = new FormData();
    formDataImg.append('id', userProps?._id);
    formDataImg.append('image', user.image);
    console.log(formDataImg.get('id'));
    console.log(formDataImg.get('image'));
    const res = await editProfile({ id: formDataImg.get('id'), updatedUser: formDataImg });
    console.log(res);
    if (res.data) {
      setShowSave(!showSave);
      console.log('img', res.data.data.img);
      localStorage.setItem('img', res.data.data.img);
    }
    // console.log(res.data.data.img);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log('clicked submit');
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
    console.log(formData, userProps, updatedFields);

    const result = await editProfile({
      id: userProps._id,
      updatedUser: updatedFields,
    });
    console.log('result:', result);
    localStorage.setItem('user', JSON.stringify(result.data.data));
    onEditComplete();
  };

  return (
    <>
      <div className="d-flex j-center itemcenter user-profile-dis">
        <Avatar sx={{ width: 140, height: 140 }} className="avatar">
          {!choseFile && <img className="profile-img" src={img} alt="profile" />}
          {choseFile && <img className="profile-img" src={preview} alt="profile" />}
        </Avatar>
        <div className="space-content">
          <Button variant="contained" className="btn-custom" color="secondary" component="label">
            Upload image
            <input type="file" name="image" hidden onChange={handleChange} />
          </Button>
          {showSave && (
            <div>
              <Button
                color="view"
                sx={{ color: 'white', marginTop: '20px' }}
                variant="contained"
                onClick={handleSubmit}
              >
                Save
              </Button>{' '}
            </div>
          )}
        </div>
        <Typography typography="h2" sx={{ marginBottom: '10px' }}>
          {userProps?.username}
        </Typography>
        <span className="non-action">ID: {userProps._id}</span>
      </div>
      <Container>
        <div className="d-flex j-center">
          <Typography typography="h2" m={3}>
            My Profile
          </Typography>
        </div>
        <Paper sx={{ padding: '10px' }}>
          {/* Profile Card */}
          <form onSubmit={handleEditSubmit}>
            <TextField
              id="outlined-controlled"
              label="Username"
              name="username"
              className="formField-text"
              sx={{ margin: '12px 0px' }}
              value={formData ? formData.username : ''}
              onChange={handleFormChange}
            ></TextField>
            <TextField
              id="outlined-controlled"
              label="Email"
              name="email"
              className="formField-text"
              sx={{ margin: '12px 0px' }}
              value={formData ? formData.email : ''}
              onChange={handleFormChange}
            ></TextField>
            <TextField
              id="outlined-controlled"
              label="Phone"
              name="phone"
              className="formField-text"
              sx={{ margin: '12px 0px' }}
              value={formData ? formData.phone : ''}
              onChange={handleFormChange}
            ></TextField>
            <TextField
              id="outlined-controlled"
              label="Role"
              name="role"
              disabled
              className="formField-text"
              sx={{ margin: '12px 0px' }}
              value={formData ? formData.role : ''}
            ></TextField>
            <TextField
              id="outlined-controlled"
              label="Address"
              name="address"
              className="formField-text"
              sx={{ margin: '12px 0px' }}
              value={formData ? formData.address : ''}
              onChange={handleFormChange}
            ></TextField>
            <Grid container spacing={1} mt={2}>
              <Grid item lg={11} className="d-flex edit-btn">
                <div>
                  <Button
                    sx={{ marginTop: '10px' }}
                    color="nonAction"
                    size="large"
                    onClick={() => onEditComplete()}
                  >
                    CANCEL
                  </Button>
                  <Button
                    sx={{ marginTop: '10px', color: 'white' }}
                    color="view"
                    variant="contained"
                    type="submit"
                    size="large"
                    onClick={() => handleEditSubmit}
                    autoFocus
                  >
                    SAVE
                  </Button>
                </div>
              </Grid>
            </Grid>
          </form>
          <Typography typography="h3" p={1.5}>
            Payment Method
          </Typography>
        </Paper>
      </Container>
    </>
  );
};

export default EditProfile;
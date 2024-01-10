import React from 'react';
import { useState, useEffect } from 'react';
import { Button, Typography, TextField, Grid, Avatar, Container } from '@mui/material';
import {
  useFetchUserByIdQuery,
  useEditUserMutation,
  useEditSelfMutation,
} from '../../../redux/store';
import { convertDateKh } from '../../../helpers/ConvertDate';
import './profile.css';

const index = () => {
  const [userInfo, setUserInfo] = useState({});
  const [editClicked, setEditClicked] = useState(false);
  const [formData, setFormData] = useState(userInfo);
  const [img, setImg] = useState(null);
  const [editImg, { isLoading: editImgLoading, isError: editImgError }] = useEditSelfMutation();
  const [editUser, { isLoading: editUserLoading, isError: editUserError }] = useEditUserMutation();
  const [showSave, setShowSave] = useState(false);
  const [choseFile, setChoseFile] = useState();
  const [preview, setPreview] = useState();
  const joined = convertDateKh(userInfo?.createdAt);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Store user information in local storage
    // localStorage.setItem('user', JSON.stringify(user));
    // Retrieve user information from local storage
    const storedUser = localStorage.getItem('user');
    console.log(storedUser);
    if (storedUser) {
      const userProfile = JSON.parse(storedUser);
      setUserId(userProfile._id);
      console.log(userId);
      // console.log(localStorage.getItem('user')._id);
      // console.log(userId);
    }
  }, [localStorage.getItem('user')]);
  // console.log(userId);
  const {
    data: userData,
    error: fetchUserError,
    isLoading: fetchUserLoading,
  } = useFetchUserByIdQuery(JSON.parse(localStorage.getItem('user')).id);
  // console.log('ID', JSON.parse(localStorage.getItem('user')).id);
  // console.log('User', userData);
  useEffect(() => {
    if (userData) {
      console.log(userData.data);
      setUserInfo(userData.data?.doc);
      setFormData({
        username: userData.data?.doc?.username || '',
        email: userData.data?.doc?.email || '',
        firstName: userData.data?.doc?.firstName || '',
        lastName: userData.data?.doc?.lastName || '',
        phone: userData.data?.doc?.phone || '',
        role: userData.data?.doc?.role || 'Member',
        isActive: userData.data?.doc?.isActive || true,
        password: '',
        confirmPassword: '',
      });
    }
  }, [userData]);

  useEffect(() => {
    setImg(localStorage.getItem('img'));
  }, [localStorage.getItem('img')]);

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
      setUserInfo((user) => ({
        ...user,
        [name]: files[0],
      }));
      console.log(userInfo);
      setChoseFile(e.target.files[0]);
      setShowSave(true);
    } else {
      setUserInfo((user) => ({
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
    formDataImg.append('id', userInfo?._id);
    formDataImg.append('image', userInfo.image);
    console.log(formDataImg.get('id'));
    console.log(formDataImg.get('image'));
    const res = await editImg(formDataImg);
    if (res.data.status) {
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
    console.log(formData);
    const result = await editUser({
      id: userData?.data?.doc?.id,
      updatedUser: updatedFields,
    });
    console.log('@@@@@@@@@@', result.data.data.updatedDoc);
    localStorage.setItem('user', JSON.stringify(result.data.data.updatedDoc));
    setFormData(userInfo);
    // console.log(userInfo);
    // console.log(result);
    //localStorage.setItem('user', JSON.stringify(result.data.data.updatedUser));
    setEditClicked(false);

    window.location.reload();
  };

  if (fetchUserLoading || editUserLoading || editImgLoading) {
    return <div>Loading user data...</div>;
  }

  if (fetchUserError || editUserError || editImgError) {
    return <div>Error loading or editing user!</div>;
  }

  return (
    <>
      {/* {console.log(userInfo.user?.email)} */}
      <Container>
        <Typography typography="h1" mt={2}>
          Admin Profile
        </Typography>
        <Grid container spacing={1} mt={3}>
          <Grid item lg={2}>
            <Avatar sx={{ width: 140, height: 140 }} className="avatar">
              {!choseFile && <img className="profile-img" src={img} alt="profile" />}
              {choseFile && <img className="profile-img" src={preview} alt="profile" />}
            </Avatar>
            <div className="space-content">
              <Button
                variant="contained"
                className="btn-custom"
                color="secondary"
                sx={{ marginTop: '20px' }}
                component="label"
              >
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
          </Grid>
          <Grid item lg={10}>
            <Typography mb={1} typography="h1">
              {userInfo?.username}
            </Typography>
            <Typography typography="h3"> {userInfo?.role}</Typography>
          </Grid>
        </Grid>
        {!editClicked && (
          <Grid container spacing={1} mt={5}>
            <Grid item lg={4}>
              <Typography mb={2} variant="h3">
                <span className="non-action">First name: </span>
                {userInfo?.firstName ? userInfo?.firstName : 'N/A'}
              </Typography>
              <Typography mb={2} variant="h3">
                <span className="non-action">Last name: </span>{' '}
                {userInfo?.lastName ? userInfo?.lastName : 'N/A'}
              </Typography>
            </Grid>
            <Grid item lg={4}>
              <Typography mb={2} variant="h3">
                <span className="non-action">Email : </span>{' '}
                {userInfo?.email ? userInfo?.email : 'N/A'}
              </Typography>
              <Typography mb={2} variant="h3">
                <span className="non-action">Phone: </span>{' '}
                {userInfo?.phone ? userInfo?.phone : 'N/A'}
              </Typography>
            </Grid>
            <Grid item lg={4}>
              <Typography mb={2} variant="h3">
                <span className="non-action">Joined: </span> {userInfo?.createdAt ? joined : 'N/A'}
              </Typography>
            </Grid>
            <Grid container spacing={1} mt={2}>
              <Grid item lg={11} className="d-flex edit-btn">
                <Button
                  onClick={() => setEditClicked(true)}
                  variant="contained"
                  color="secondary"
                  size="large"
                >
                  Edit
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}
        {editClicked && (
          <form onSubmit={handleEditSubmit}>
            <Grid container spacing={2} mt={3}>
              <Grid item lg={4}>
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
              </Grid>
              <Grid item lg={4}>
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
                  label="Phone"
                  name="phone"
                  className="formField-text"
                  sx={{ margin: '12px 0px' }}
                  value={formData.phone}
                  onChange={handleFormChange}
                ></TextField>
              </Grid>
              <Grid item lg={4}>
                <TextField
                  id="outlined-controlled"
                  label="Joined"
                  disabled
                  value={joined}
                  className="formField-text"
                  sx={{ margin: '12px 0px' }}
                ></TextField>
              </Grid>
              <Grid container spacing={1} mt={2}>
                <Grid item lg={11} className="d-flex edit-btn">
                  <div>
                    <Button
                      sx={{ marginTop: '10px' }}
                      color="nonAction"
                      size="large"
                      onClick={() => setEditClicked(false)}
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
            </Grid>
          </form>
        )}
      </Container>
    </>
  );
};

export default index;

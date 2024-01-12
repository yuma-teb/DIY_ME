import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useFetchUserByIdQuery, useFetch4CategoriesQuery } from '../../../redux/store';
import { useFetchUserOrderQuery } from '../../../redux/api/UserApi';
import {
  Container,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Mode';
import CheckIcon from '@mui/icons-material/DoneAll';
import PackageIcon from '@mui/icons-material/Unarchive';
import DeliverIcon from '@mui/icons-material/LocalShipping';
import HomeIcon from '@mui/icons-material/Home';
import EditProfile from './EditProfile';
import './user-profile.css';

// const testUser = {
//   _id: '6551c59bdff538743f695402',
//   username: 'Coca',
//   email: 'coca@yahoo.com',
//   role: 'Member',
//   createdAt: '2023-11-13T06:33:18.465+00:00',
//   shop: null,
//   isActive: true,
// };

const Index = () => {
  const [userInfo, setUserInfo] = useState({});
  const [img, setImg] = useState(localStorage.getItem('img') || null);
  const [editClicked, setEditClicked] = useState(false);


  useEffect(() => {
    // Retrieve user information from local storage
    const storedUser = localStorage.getItem('user');
    // console.log(storedUser);
    if (storedUser) {
      const userProfile = JSON.parse(storedUser);
      setUserInfo(userProfile);
      setImg(localStorage.getItem('img'));
      // setUserId(userProfile._id);
      // console.log(localStorage.getItem('user')._id);
      // console.log(userId);
    }
  }, [localStorage.getItem('user')]);


  const {
    data: dataOrder,
    error: fetchOrderError,
    isLoading: fetchOrderLoading,
  } = useFetchUserOrderQuery(JSON.parse(localStorage.getItem('user'))._id);

  console.log("DATA", dataOrder);
  // const {
  //   data: userData,
  //   error: fetchUserError,
  //   isLoading: fetchUserLoading,
  // } = useFetchUserByIdQuery(userId);

  const cardStyle = {
    display: 'flex',
    backgroundColor: '#F3D8C7',
  };

  const cardMediaStyle = {
    width: 80,
    height: 80,
    margin: '16px 10px',
    borderRadius: '8px',
  };

  const cardStatusStyle = {
    borderRadius: '0 0 5px 5px',
    padding: '10px',
    borderRight: ' 1px solid #F3D8C7',
    borderBottom: '1px solid #F3D8C7',
    borderLeft: '1px solid #F3D8C7',
    boxShadow: 'none',
  };

  const arrayUserInfo = [
    {
      title: 'Username',
      value: ` ${userInfo?.username ? userInfo?.username : 'N/A'}` || 'N/A',
    },
    { title: 'Email', value: ` ${userInfo?.email ? userInfo?.email : 'N/A'}` },
    { title: 'Phone', value: ` ${userInfo?.phone ? userInfo?.phone : 'N/A'}` },
    { title: 'Role', value: ` ${userInfo?.role ? userInfo?.role : 'N/A'}` },
    { title: 'Address', value: ` ${userInfo?.address ? userInfo?.address : 'N/A'}` },
  ];

  const handleEditClicked = () => {
    setEditClicked(true);
  };

  const handleEditComplete = () => {
    setEditClicked(false);
  };

  return (
    <>
      {!editClicked && (
        <>
          <div className="d-flex j-center itemcenter user-profile-dis">
            <Avatar sx={{ width: 140, height: 140, marginBottom: '20px' }}>
              <img className="profile-img" src={img} alt="profile" />
            </Avatar>
            <Typography typography="h2" sx={{ marginBottom: '10px' }}>
              {userInfo?.username}
            </Typography>
            <span className="non-action">ID: {userInfo?._id}</span>
          </div>
          <Container>
            <div className="d-flex j-center">
              <Typography typography="h2" m={3}>
                My Profile
              </Typography>
            </div>
            <Paper>
              {/* Profile Card */}
              <IconButton onClick={handleEditClicked} color="secondary" sx={{ float: 'right' }}>
                <EditIcon />
              </IconButton>
              {arrayUserInfo.map((ele, index) => {
                return (
                  <Typography p={1.5} key={index} className="d-flex j-spacebtw">
                    <Typography className="non-action textalign">{ele.title}</Typography>
                    {ele.title === 'Username' ? (
                      <>
                        {' '}
                        <Typography className="textalign1">&nbsp;&nbsp;: {ele.value}</Typography>
                      </>
                    ) : (
                      <Typography className="textalign1"> : {ele.value}</Typography>
                    )}
                  </Typography>
                );
              })}
              <Typography typography="h3" p={1.5}>
                Payment Method
              </Typography>
            </Paper>
          </Container>
        </>
      )}
      {editClicked && <EditProfile userInfo={userInfo} onEditComplete={handleEditComplete} />}
      <Container>
        <Typography typography="h2" m={3} className="d-flex j-center">
          My Orders
        </Typography>
        <Typography typography="h3" mt={2} mb={1}>
          Ongoing
        </Typography>
        <Card p={1} style={cardStyle}>
          <CardMedia
            component="img"
            style={cardMediaStyle}
            image="../../../../productimg.png"
            alt="product image"
          />
          <Box className="d-flex flex-col">
            <CardContent>
              <Typography typography="h3">Product Name</Typography>
              <Typography variant="subtitle1" color="text.secondary">
                variation and x more
                <Typography variant="subtitle1" color="text.secondary">
                  Order ID:
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Total:
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Payment: Paid
                </Typography>
              </Typography>
            </CardContent>
          </Box>
        </Card>
        <Paper style={cardStatusStyle}>
          <Typography variant="subtitle1" color="text.secondary">
            Status:    HAHA
          </Typography>
          <div className="d-flex"></div>
        </Paper>
        <Typography variant="h2" mt={2}>
          End
        </Typography>
      </Container>
    </>
  );
};

export default Index;
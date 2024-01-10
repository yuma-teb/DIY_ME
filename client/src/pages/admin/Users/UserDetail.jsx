import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useFetchUserByIdQuery } from '../../../redux/store';

import { Avatar, Paper, Divider, List, Typography, Container, Button, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PlaceIcon from '@mui/icons-material/Place';
import CartIcon from '@mui/icons-material/ShoppingCart';
import PayIcon from '@mui/icons-material/Payment';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import OrdersTable from '../../../components/admin/User/OrdersTable';
import CardList from '../../../components/admin/Common/CardList';
import CardSummary from '../../../components/admin/Dashboard/CardSummary';
import AnimatedNumber from '../../../components/admin/Common/AnimatedNumber';
import { convertDateKh } from '../../../helpers/ConvertDate';

const UserDetail = () => {
  const customPrimaryTextStyle = useMemo(
    () => ({
      // Add your custom styles for the primary text
      fontWeight: '400',
      fontSize: '18px',
    }),
    [],
  );

  const customSecondaryTextStyle = useMemo(
    () => ({
      // Add your custom styles for the secondary text
      fontSize: '16px',
      color: '#808080',
    }),
    [],
  );

  const navigate = useNavigate();
  const { id } = useParams();
  const {
    data: userData,
    error: fetchUserError,
    isLoading: fetchUserLoading,
  } = useFetchUserByIdQuery(id);
  const [user, setUser] = useState({});
  const [latestOrder, setLatestOrder] = useState(null);
  const getUser = () => {
    if (userData?.data?.doc) {
      // const userObj = { ...data?.data?.user }; // Use optional chaining
      // console.log(userData?.data?.doc);
      setUser(userData?.data?.doc);
    }
  };
  useEffect(() => {
    getUser();
  }, [userData]);

  let latestDateIso;

  useEffect(() => {
    if (user?.orders?.length === 0) {
      setLatestOrder('N/A');
    } else {
      latestDateIso = user?.orders?.[user?.orders?.length - 1].createdAt;
    }

    if (latestDateIso) {
      const convertDate = convertDateKh(latestDateIso);
      setLatestOrder(convertDate);
    }
  }, [user]);

  if (fetchUserError) {
    return <Alert severity="error">Error loading user details!</Alert>;
  }
  if (!userData) {
    return <div>No user data available</div>;
  }

  const arrayProps = [
    { icon: <LockIcon />, primarytext: 'User ID', secondarytext: `${user?._id}` },
    { icon: <EmailIcon />, primarytext: 'Email', secondarytext: `${user?.email}` },
    {
      icon: <PhoneIcon />,
      primarytext: 'Phone',
      secondarytext: `${user?.phone ? user?.phone : 'N/A'}`,
    },
    {
      icon: <PayIcon />,
      primarytext: 'Payment Method',
      secondarytext: `${user?.paymentMethod ? user?.paymentMethod : 'N/A'}`,
    },
    {
      icon: <PlaceIcon />,
      primarytext: 'Address',
      secondarytext: `${user?.address ? user?.address : 'N/A'}`,
    },
    {
      icon: <CartIcon />,
      primarytext: 'Latest Order',
      secondarytext: `${latestOrder}`,
    },
  ];
  // console.log(arrayProps);
  // console.log(data?.data?.user);
  // console.log(user?.orders[user?.orders.length - 1]);
  // console.log('User:', user);

  return (
    <>
      <Container>
        <Typography variant="h1" mb={2}>
          User Detail
        </Typography>
        {userData && (
          <Grid container spacing={3}>
            <Grid item lg={4}>
              <Paper className=" d-flex flex-col">
                <div className=" d-flex flex-col itemcenter">
                  <Avatar sx={{ width: 60, height: 60, margin: '10px 0 10px 0' }}>
                    {user?.username ? user?.username[0] : 'N/A'}
                  </Avatar>
                  <Typography typography="h3"> {user?.username}</Typography>
                </div>
                <Divider variant="middle" />
                <List>
                  {arrayProps.map((props, index) => {
                    return (
                      <CardList
                        key={index}
                        icon={props.icon}
                        primarytext={props.primarytext}
                        secondarytext={props.secondarytext}
                        primaryStyle={customPrimaryTextStyle}
                        secondaryStyle={customSecondaryTextStyle}
                      />
                    );
                  })}
                </List>
              </Paper>
            </Grid>
            <Grid item lg={8}>
              <Grid container spacing={3}>
                <Grid item lg={6} className="itemcenter">
                  <CardSummary
                    title="Total Orders"
                    value={<AnimatedNumber value={user?.orders?.length || 0} />}
                    icon={<AssignmentIcon />}
                  />
                </Grid>
                <Grid item lg={6}>
                  <CardSummary
                    title="Total Posts"
                    value={<AnimatedNumber value={user?.posts?.length || 0} />}
                    icon={<ArticleIcon />}
                  />
                </Grid>
                <Grid item lg={12}>
                  <OrdersTable user={user} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}

        <Button
          onClick={() => navigate(-1)}
          variant="contained"
          color="nonAction"
          sx={{ marginTop: '20px', color: '#fff' }}
        >
          Go Back
        </Button>
      </Container>
    </>
  );
};

export default UserDetail;

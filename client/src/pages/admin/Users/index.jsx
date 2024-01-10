import React from 'react';
import { Typography, Grid, Container, Alert } from '@mui/material';
import { useFetchAllUsersQuery } from '../../../redux/store';
import StoreIcon from '@mui/icons-material/Store';
import BusinessIcon from '@mui/icons-material/Business';
import UsersIcon from '@mui/icons-material/Group';
import CartIcon from '@mui/icons-material/ShoppingCart';
import UserListTable from '../../../components/admin/User/UserListTable';
import AddModal from '../../../components/admin/User/UserAddModal';
import './user.css';
import SearchUser from '../../../components/admin/User/SearchUser';

const iconStyle = {
  width: '48px',
  height: '48px',
};
import CardSummary from '../../../components/admin/Dashboard/CardSummary';
import AnimatedNumber from '../../../components/admin/Common/AnimatedNumber';

const index = () => {
  const {
    data: userData,
    error: fetchUserError,
    isLoading: fetchUserLoading,
  } = useFetchAllUsersQuery();
  const totalUser = userData ? userData.results : 0;
  const users = userData?.data?.docs || [];
  const memberUsers = users.filter((user) => user.role === 'Member' || user.role === 'Admin');
  const totalShop = users.filter((user) => user.role === 'Shop');
  const activeUsers = users.filter((user) => user.isActive);

  // console.log(totalShop.length);
  // console.log(memberUsers.length);
  // console.log(activeUsers.length);
  const arrayPropsCards = [
    {
      title: 'Total Users',
      value: <AnimatedNumber value={totalUser} />,
      icon: <UsersIcon />,
    },
    {
      title: 'Total Shops',
      value: <AnimatedNumber value={totalShop.length} />,
      icon: <BusinessIcon />,
    },
    {
      title: 'Total Members',
      value: <AnimatedNumber value={memberUsers.length} />,
      icon: <UsersIcon />,
    },
    {
      title: 'Active Users',
      value: <AnimatedNumber value={activeUsers.length} />,
      icon: <UsersIcon />,
    },
  ];

  if (fetchUserError) {
    return <Alert severity="error">Error loading users data!</Alert>;
  }
  return (
    <>
      <Container sx={{marginTop: '32px'}}>
        <div className="d-flex j-spacebtw">
          <Typography variant="h1" mt={2}>
            Users List
          </Typography>
          <div className="selfcenter user-modal">
            <AddModal />
          </div>
        </div>
        <SearchUser />
        <Grid container spacing={5} className="j-center itemcenter" sx={{ marginBottom: '32px', marginTop: '32px' }}>
          {arrayPropsCards.map((props, index) => {
            return (
              <Grid item lg={3}>
                <CardSummary
                  key={index}
                  title={props.title}
                  value={props.value}
                  icon={props.icon}
                />
              </Grid>
            );
          })}
        </Grid>
        <UserListTable />
      </Container>
    </>
  );
};

export default index;

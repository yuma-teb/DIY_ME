import React, { useEffect, useState, useMemo } from 'react';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import PaymentIcon from '@mui/icons-material/Payment';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BusinessIcon from '@mui/icons-material/Business';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import StoreIcon from '@mui/icons-material/Store';
import { useFetchRefundReturnByIdQuery } from '../../../redux/store';
import { useUpdateRefundReturnByIdMutation } from '../../../redux/api/RefundReturnApi';
import { useParams } from 'react-router-dom';
import CardList from '../../../components/admin/Common/CardList';
import { convertDateKh } from '../../../helpers/ConvertDate';
import './returnRefund.css';
import {
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Grid,
  Avatar,
  Divider,
  IconButton,
  Typography,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import Header from '../../../components/admin/Common/Header';

const paperStyleWithHeight = {
  height: '420px',
  overFlow: 'hidden',
};

const paperStyleWithOutHeight = {
  overFlow: 'hidden',
  padding: '10px',
};

const subtitleStyle = {
  color: '#808080',
  fontSize: '20px',
};

const RefundViewDetail = () => {
  const { id } = useParams();
  const [editStatus, { isLoading: isLoading1, isError }] = useUpdateRefundReturnByIdMutation();
  const {
    data,
    error: fetchRefundError,
    isLoading: fetchRefundLoading,
  } = useFetchRefundReturnByIdQuery(id);
  console.log('Datata', data);
  const [refunds, setRefunds] = useState(null);
  if (data) {
    console.log('Order', data?.data?.data?.order);
  }

  const [status, setStatus] = useState('');
  useEffect(() => {
    setRefunds(data);
    if (data?.data.data?.status) {
      setStatus(data?.data.data?.status);
    }
  }, [data]);

  const customPrimaryTextStyle = useMemo(
    () => ({
      fontWeight: '400',
      fontSize: '18px',
    }),
    [],
  );

  const customSecondaryTextStyle = useMemo(
    () => ({
      fontSize: '16px',
      color: 'gray',
    }),
    [],
  );

  const items = data?.data?.data?.order?.orderItems || [];

  const userInfoArray = [
    {
      title: 'User',
      data: `${
        data?.data?.data?.order?.user?.username ? data?.data?.data?.order.user.username : 'N/A'
      }`,
    },
    {
      title: 'Email',
      data: `${
        data?.data?.data?.order?.user?.email ? data?.data?.data?.order?.user?.email : 'N/A'
      }`,
    },
    {
      title: 'Phone',
      data: `${
        data?.data?.data?.order?.user?.username ? data?.data?.data?.order?.user?.username : 'N/A'
      }`,
    },
    {
      title: 'Address',
      data: `${
        data?.data?.data?.order?.user?.address ? data?.data?.data?.order?.user?.address : 'N/A'
      }`,
    },
  ];

  const orderArray = [
    {
      icon: <ShoppingCartCheckoutIcon />,
      primarytext: 'Order ID',
      secondarytext: `${data?.data?.data?.order?._id ? data?.data?.data?.order?._id : 'N/A'}`,
    },
    {
      icon: <EditCalendarIcon />,
      primarytext: 'Added',
      secondarytext: `${
        data?.data?.data?.order?.createdAt ? data?.data?.data?.order.createdAt : 'N/A'
      }`,
    },
    {
      icon: <PaymentIcon />,
      primarytext: 'Payment Method',
      secondarytext: `${
        data?.data?.data?.order?.paymentMethod ? data?.data?.data?.order?.paymentMethod : 'N/A'
      }`,
    },
    {
      icon: <LocalShippingIcon />,
      primarytext: 'Status',
      secondarytext: `${data?.data?.data?.order?.status ? data?.data?.data?.order?.status : 'N/A'}`,
    },
  ];

  const shopArray = [
    {
      icon: <BusinessIcon />,
      primarytext: 'From Shop',
      secondarytext: `${
        data?.data?.data?.order?.fromShop?.name ? data?.data?.data?.order.fromShop?.name : 'N/A'
      }`,
    },
    {
      icon: <StoreIcon />,
      primarytext: 'Shop ID',
      secondarytext: `${
        data?.data?.data?.order?.fromShop?._id ? data?.data?.data?.order.fromShop?._id : 'N/A'
      }`,
    },
    {
      icon: <EmailIcon />,
      primarytext: 'Shop Email',
      secondarytext: `${
        data?.data?.data?.order?.fromShop?.email ? data?.data?.data?.order?.fromShop?.email : 'N/A'
      }`,
    },
    {
      icon: <PhoneIphoneIcon />,
      primarytext: 'Phone',
      secondarytext: `${data?.data?.data?.order?.phone ? data?.data?.data?.order.phone : 'N/A'}`,
    },
  ];

  const handleChange = async (event) => {
    setStatus(event.target.value);
    const res = await editStatus({ id: id, status: event.target.value });
    console.log('res', res);
  };
  if (fetchRefundLoading) {
    return <div>Loading refund details...</div>;
  }

  if (fetchRefundError) {
    return <Alert severity="error">Error loading refund details!</Alert>;
  }

  return (
    <>
      {!data ? (
        'Data is loading...'
      ) : (
        <div>
          <Header
            title={data?.data?.data?.isRefund ? 'Refund Detail' : 'Return Detail'}
            subtitle={data?.data?.data?.isRefund ? 'Refund Detail' : 'Return Detail'}
          />

          <Container>
            <Grid className="top" container spacing={3}>
              <Grid item lg={8}>
                <Paper style={paperStyleWithOutHeight}>
                  <div className="d-flex j-spacebtw">
                    <Typography typography="h2">Product Detail </Typography>
                    <Chip
                      label={data?.data?.data?.isRefund ? 'Refund' : 'Return'}
                      color="secondary"
                    />

                    <FormControl variant="filled" sx={{ m: 1, minWidth: 200 }}>
                      <InputLabel id="demo-simple-select-filled-label">Status</InputLabel>
                      <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={data?.data?.data?.status ? data?.data?.data?.status : 'Status'}
                        label="Status"
                        name="status"
                        onChange={handleChange}
                        className="formField-text"
                        sx={{ marginBottom: '12px' }}
                        MenuProps={{
                          sx: {
                            '& .Mui-selected': {
                              backgroundColor: '#F3D8C7',
                            },
                          },
                        }}
                      >
                        <MenuItem value={'processing'}>processing</MenuItem>
                        <MenuItem value={'approved'}>approved</MenuItem>
                        <MenuItem value={'completed'}>completed</MenuItem>
                        <MenuItem value={'rejected'}>rejected</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="d-flex j-spacebtw">
                    <p style={subtitleStyle}>Product Name</p>
                    <p style={subtitleStyle}>Amount x Price</p>
                    <p style={subtitleStyle}>Total</p>
                  </div>
                  <div className="d-flex j-spacebtw">
                    <Typography typography="body1">
                      {data?.data?.data?.product[0].name
                        ? data?.data?.data?.product[0].name
                        : 'N/A'}
                    </Typography>
                    <Typography typography="body1">
                      1 x{' '}
                      {data?.data?.data?.product[0].price ? data?.data?.data?.product[0].price : 0}{' '}
                      $
                    </Typography>
                    <Typography typography="body1">
                      {data?.data?.data?.product[0].price
                        ? data?.data?.data?.product[0].price
                        : 'N/A'}{' '}
                      $
                    </Typography>
                  </div>
                  <div className="d-flex itemcenter">
                    <Typography typography="h3" mt={3} style={subtitleStyle}>
                      Reason:
                    </Typography>
                    <Typography typography="body1" mt={3} ml={2}>
                      {data?.data?.data?.reason ? data?.data?.data?.reason : 'N/A'}
                    </Typography>
                  </div>
                </Paper>
                <Paper style={paperStyleWithOutHeight} sx={{ marginTop: '20px' }}>
                  <Typography typography="h2">User Detail</Typography>
                  {userInfoArray.map((userInfo, index) => {
                    return (
                      <div className="d-flex itemcenter">
                        <Typography key={index} mt={3} typography="body1" style={subtitleStyle}>
                          {userInfo.title}:
                        </Typography>
                        <Typography key={index} mt={3} ml={2} typography="body1">
                          <span className="spanText"> {userInfo.data}</span>
                        </Typography>
                      </div>
                    );
                  })}
                </Paper>
              </Grid>
              <Grid item lg={4}>
                <Paper style={paperStyleWithOutHeight}>
                  <Typography typography="h2">Order Detail</Typography>
                  {orderArray.map((props, index) => {
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
                  <Typography typography="h2">Shop Detail</Typography>
                  {shopArray.map((props, index) => {
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
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </div>
      )}
    </>
  );
};

export default RefundViewDetail;

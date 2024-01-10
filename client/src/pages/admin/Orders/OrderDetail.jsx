import OrderListDetail from './OrderListDetail';

import { useFetchOrderByIdQuery } from '../../../redux/store';
import React from 'react';
import { useMemo } from 'react';
import { Paper, List } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockIcon from '@mui/icons-material/Lock';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import RedeemIcon from '@mui/icons-material/Redeem';
import { useParams } from 'react-router-dom';
import { convertDateKh } from '../../../helpers/ConvertDate';
import CardList from '../../../components/admin/Common/CardList';
import './Order.css';

const styleIcon = {
  backgroundColor: '#E0E2E7',
  color: '#667085',
  borderRadius: '100px',
  border: '8px solid #F0F1F3',
};

const listStyle = {
  padding: '24px',
};

function OrderDetail() {
  const { id } = useParams();
  const {
    data: orderData,
    error: fetchOrderError,
    isLoading: fetchOrderLoading,
  } = useFetchOrderByIdQuery(id);
  console.log(orderData?.data?.doc);

  const added = convertDateKh(orderData?.data?.doc?.createdAt);
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
      color: 'black',
    }),
    [],
  );

  const customPrimaryTextStyle1 = useMemo(
    () => ({
      // Add your custom styles for the primary text
      fontWeight: '400',
      fontSize: '18px',
      align: 'left',
      color: 'gray',
    }),
    [],
  );

  const customSecondaryTextStyle1 = useMemo(
    () => ({
      // Add your custom styles for the secondary text
      fontSize: '16px',
      color: 'black',
      align: 'left',
    }),
    [],
  );

  const customPrimaryTextStyle2 = useMemo(
    () => ({
      // Add your custom styles for the primary text
      fontWeight: '400',
      fontSize: '18px',
      align: 'left',
      color: 'black',
    }),
    [],
  );

  const customSecondaryTextStyle2 = useMemo(
    () => ({
      // Add your custom styles for the secondary text
      fontSize: '16px',
      color: 'gray',
      align: 'left',
    }),
    [],
  );
  const listItemStyle = useMemo(
    () => ({
      // Add your custom styles for the secondary text
      display: 'flex',
      justifyContent: 'space-between',
    }),
    [],
  );

  // if (isLoading) {
  //   console.log('Loading...');
  // }
  if (fetchOrderLoading) {
    return <div>Loading order details...</div>;
  }

  if (fetchOrderError) {
    return <Alert severity="error">Error loading order details!</Alert>;
  }
  function generateOrderDetail(props) {
    return [0].map((value) => (
      <ListItem key={value} {...props}>
        <ListItemIcon>
          {/* Cutomize Icons passed to props */}
          {props.icon}
        </ListItemIcon>
        <ListItemText
          primary={props.primarytext}
          secondary={props.secondarytext}
          secondaryTypographyProps={{ color: 'black' }}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        />
      </ListItem>
    ));
  }

  const arrayPropsOrder = [
    {
      icon: <EditCalendarIcon style={styleIcon} />,
      primarytext: 'Added',
      secondarytext: `${added != undefined ? added : 'N/A'}`,
    },
    {
      icon: <PaymentIcon />,
      primarytext: 'Payment Method',
      secondarytext: `${
        orderData?.data?.doc?.paymentMethod ? orderData?.data?.doc?.paymentMethod : 'N/A'
      }`,
    },
    {
      icon: <LocalShippingIcon style={styleIcon} />,
      primarytext: 'Status',
      secondarytext: `${orderData?.data?.doc?.status ? orderData?.data?.doc?.status : 'N/A'}`,
    },
  ];

  const arrayPropsUser = [
    {
      icon: <AccountCircleIcon style={styleIcon} />,
      primarytext: 'User',
      secondarytext: `${
        orderData?.data?.doc?.user.username ? orderData?.data?.doc?.user.username : 'N/A'
      }`,
    },
    {
      icon: <EmailIcon style={styleIcon} />,
      primarytext: 'Email',
      secondarytext: `${
        orderData?.data?.doc?.user.email ? orderData?.data?.doc?.user.email : 'N/A'
      }`,
    },
    {
      icon: <PhoneIphoneIcon style={styleIcon} />,
      primarytext: 'Phone',
      secondarytext: `${
        orderData?.data?.doc?.user.phone ? orderData?.data?.doc?.user.phone : 'N/A'
      }`,
    },
  ];
  const arrayPropsDelivery = [
    { icon: <ReceiptIcon style={styleIcon} />, primarytext: 'Invoice', secondarytext: 'INV-32011' },
    {
      icon: <LocalShippingIcon style={styleIcon} />,
      primarytext: 'Number Plate',
      secondarytext: '1TTR-KT98',
    },
  ];
  const arrayPropsStatus = [
    {
      icon: <ShoppingCartCheckoutIcon style={styleIcon} />,
      primarytext: 'Order Placed',
      secondarytext: `${
        orderData?.data?.doc?.user?.address ? orderData?.data?.doc?.user.address : 'N/A'
      }`,
    },
    {
      icon: <RedeemIcon style={styleIcon} />,
      primarytext: 'Packed',
      secondarytext: `${
        orderData?.data?.doc?.user?.address ? orderData?.data?.doc?.user.address : 'N/A'
      }`,
    },
    {
      icon: <LocalShippingIcon style={styleIcon} />,
      primarytext: 'Delivered',
      secondarytext: `${
        orderData?.data?.doc?.user?.address ? orderData?.data?.doc?.user.address : 'N/A'
      }`,
    },
  ];

  return (
    <div className="overall-container">
      {fetchOrderLoading ? (
        <img src="https://media1.tenor.com/m/eL-cXQYmRjQAAAAC/loading-load.gif" alt="loading" />
      ) : (
        <>
          <div className="info-container">
            <Paper className="profile d-flex flex-col">
              <List className="detail-card" style={listStyle}>
                <h1 className="label-detail">Order #{orderData?.data?.doc?.id}</h1>
                {arrayPropsOrder.map((props, index) => {
                  return (
                    <CardList
                      key={index}
                      icon={props.icon}
                      primarytext={props.primarytext}
                      secondarytext={props.secondarytext}
                      primaryStyle={customPrimaryTextStyle}
                      secondaryStyle={customSecondaryTextStyle}
                      listItemStyle={listItemStyle}
                    />
                  );
                })}
              </List>
            </Paper>
            <Paper className="profile d-flex flex-col">
              <List className="detail-card" style={listStyle}>
                <h1 className="label-detail">User</h1>
                {arrayPropsUser.map((props, index) => {
                  return (
                    <CardList
                      key={index}
                      icon={props.icon}
                      primarytext={props.primarytext}
                      secondarytext={props.secondarytext}
                      primaryStyle={customPrimaryTextStyle}
                      secondaryStyle={customSecondaryTextStyle}
                      listItemStyle={listItemStyle}
                    />
                  );
                })}
              </List>
            </Paper>
            <Paper className="profile d-flex flex-col">
              <List className="detail-card" style={listStyle}>
                <h1 className="label-detail">Document</h1>
                {arrayPropsDelivery.map((props, index) => {
                  return (
                    <CardList
                      key={index}
                      icon={props.icon}
                      primarytext={props.primarytext}
                      secondarytext={props.secondarytext}
                      primaryStyle={customPrimaryTextStyle}
                      secondaryStyle={customSecondaryTextStyle}
                      listItemStyle={listItemStyle}
                    />
                  );
                })}
              </List>
            </Paper>
          </div>
          <div className="order-list-container">
            <div className="container-table-detail">
              <OrderListDetail />
            </div>
            <div className="container-right-col">
              <Paper className="profile d-flex flex-col">
                <List className="Address" style={listStyle}>
                  <h1 className="label-detail">Address</h1>
                  <CardList
                    icon={<LocationOnIcon style={styleIcon} />}
                    primarytext={'Location'}
                    secondarytext={`${orderData?.data?.doc?.user.address}`}
                    primaryStyle={customPrimaryTextStyle1}
                    secondaryStyle={customSecondaryTextStyle1}
                  />
                </List>
              </Paper>
              <Paper className="profile d-flex flex-col">
                <List className="Address" style={listStyle}>
                  <h1 className="label-detail">Order Status</h1>
                  {arrayPropsStatus.map((props, index) => {
                    return (
                      <CardList
                        key={index}
                        icon={props.icon}
                        primarytext={props.primarytext}
                        secondarytext={props.secondarytext}
                        primaryStyle={customPrimaryTextStyle2}
                        secondaryStyle={customSecondaryTextStyle2}
                      />
                    );
                  })}
                </List>
              </Paper>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default OrderDetail;

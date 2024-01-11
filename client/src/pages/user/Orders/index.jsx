import React from 'react';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Container, Button, Paper } from '@mui/material';
import './index.css';
import ButtonComponent from '../../../components/admin/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';

import CreditCard from './ABA.png';
import Item from './item.jpg';
import Item2 from './item2.jpg';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutStep from '../Cart/CheckoutStep';
import { useCreateOrderMutation } from '../../../redux/store';
import { useNavigate } from 'react-router-dom';
import { removeItemAfterOrder } from '../../../redux/slices/orderSlice';
import { apiSlice } from '../../../redux/api/ApiSlice';

const paperStyle = {
  padding: '15px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

function Order() {
  const selectedItem = useSelector((state) => state.order.orderItems);
  const user = JSON.parse(localStorage.getItem('user'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [placeOrder, { isLoading: OrderLoading, error: OrderError }] = useCreateOrderMutation();

  const totalPrice = selectedItem.reduce((total, item) => {
    return total + item.quantity * item.variations.price;
  }, 0);

  const handleSubmitPlaceOrder = async (e) => {

    try {
      e.preventDefault();
      console.log('Request Payload:', {
        user: user?._id,
        fromShop: '658bc998e7e2d8e16ffe28f1',
        paymentMethod: 'Paypal',
        selectedItem,
      });

        // Assuming you have a paymentStatus variable indicating success or failure
      const paymentStatus = 'Paypal'; /* your logic to check payment status */

      // Check if payment is not successful
      if (!paymentStatus) {
        navigate('/cart/order/paymentMethod');
        return;
      }

      // If payment is successful, proceed with placing the order
      const result = await placeOrder({
        user: user?._id,
        fromShop: '658bc998e7e2d8e16ffe28f1',
        paymentMethod: 'Paypal',
        selectedItem
      });

      console.log(result);
      // navigate('/cart/order/success')
      // Process the result if needed
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };
  return (
    <>
      <div style={{ backgroundColor: '#D0B8AC', height: '64px' }}></div>
      <CheckoutStep step2 />
      <Container>
        <div className="contain-address-user-info">
          <h1 className="label-each-step-order">Delivery Address</h1>
          <div className="container-user-info">
            <div>
              <AccountBoxIcon />
            </div>
            <div className="user-address-info">
              <span>Maxxi</span>
              <span>098334473</span>
              <span>1833 Bel Meadow Drive, Fontana, California 92335, USA</span>
            </div>
          </div>
          <div className="btn-edit">
            <Link to={`/cart/order/shippingAddress`}>
              <Button variant="text" sx={{ color: 'black' }}>
                Edit
              </Button>
            </Link>
          </div>
        </div>
        <div className="user-payment-info">
          <h1 className="label-each-step-order">Payment Method</h1>
          <Paper sx={{ display: 'flex', justifyContent: 'center', padding: '15px' }}>
            {/* <img src={CreditCard} className="card-size-img" />
            <span>ABA Bank</span> */}
            <Link to={`/cart/order/paymentMethod`}>
              <Button variant="text" sx={{ color: '#49454F' }}>
                select payment
              </Button>
            </Link>
          </Paper>
        </div>
        <div className="product-summary-container">
          <h1 className="label-each-step-order">Product Summary</h1>
          {selectedItem.map((item) => (
            <Paper sx={{ width: '100%', bgcolor: 'background.paper' }}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar variant="rounded" sx={{ height: '40px', width: '56px' }} src={Item} />
                </ListItemAvatar>
                <ListItemText
                  sx={{ marginLeft: '15px' }}
                  primary={item.variations.name}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {item.variations.attribute}
                      </Typography>
                    </React.Fragment>
                  }
                />
                <ListItemText
                  primary={`x${item.quantity}`}
                  sx={{ display: 'flex', justifyContent: 'flex-end' }}
                />
              </ListItem>
            </Paper>
          ))}
        </div>
        <div>
          <h1 className="label-each-step-order">Order Summary</h1>
          <Paper sx={{ width: '100%', minHeight: '210px', bgcolor: 'background.paper' }}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Order from
                    </Typography>
                  </React.Fragment>
                }
                sx={{ display: 'flex', justifyContent: 'flex-start' }}
              />
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      IBC Bookstore
                    </Typography>
                  </React.Fragment>
                }
                sx={{ display: 'flex', justifyContent: 'flex-end' }}
              />
            </ListItem>
            {selectedItem.map((item) => (
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {item.variations.name}
                      </Typography>
                    </React.Fragment>
                  }
                  sx={{ display: 'flex', justifyContent: 'flex-start' }}
                />
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {(item.variations.price * item.quantity).toFixed(2)}$
                      </Typography>
                    </React.Fragment>
                  }
                  sx={{ display: 'flex', justifyContent: 'flex-end' }}
                />
              </ListItem>
            ))}

            <hr style={{ width: '90%', backgroundColor: '#49454F' }} />
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Total
                    </Typography>
                  </React.Fragment>
                }
                sx={{ display: 'flex', justifyContent: 'flex-start' }}
              />
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {totalPrice.toFixed(2)}$
                    </Typography>
                  </React.Fragment>
                }
                sx={{ display: 'flex', justifyContent: 'flex-end' }}
              />
            </ListItem>
          </Paper>
          <Link to={`/cart/order/sucess`}>
            <Button
              sx={{ width: '100%', marginTop: '30px', color: '#FFFFFF', marginBottom: '30px' }}
              variant="contained"
              onClick={handleSubmitPlaceOrder}
            >
              Procceed
            </Button>
          </Link>
        </div>
      </Container>
    </>
  );
}

export default Order;

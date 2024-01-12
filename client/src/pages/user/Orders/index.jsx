import React from 'react';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Container, Button, Paper } from '@mui/material';
import './index.css';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Link, useParams } from 'react-router-dom';

import Item from './item.jpg';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutStep from '../Cart/CheckoutStep';

// const paperStyle = {
//   padding: '15px',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'space-between',
// };

function Order() {
  const selectedItem = useSelector((state) => state.order.orderItems);

  const totalPrice = selectedItem.reduce((total, item) => {
    return total + item.quantity * item.variations.price;
  }, 0);

  return (
    <>
      <div style={{ backgroundColor: '#D0B8AC', height: '56px' }}></div>
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
          <Link to={`/cart/order/paymentMethod`}>
            <Button
              sx={{ width: '100%', marginTop: '30px', color: '#FFFFFF', marginBottom: '30px' }}
              variant="contained"
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

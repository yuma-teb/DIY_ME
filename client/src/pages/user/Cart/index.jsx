import { Container, Paper, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Checkbox from '@mui/material/Checkbox';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import cartImg from './cart.png';
import { Link, useParams } from 'react-router-dom';
import {
  useFetchCartByUserIdQuery,
  useRemoveItemFromCartByItemIdMutation,
  useUpdateQuantityItemByItemIdMutation,
} from '../../../redux/store';

import './index.css';
import { useSelector, useDispatch } from 'react-redux';
import { addToOrder } from '../../../redux/slices/orderSlice';
import CheckoutStep from './CheckoutStep';

import Alert from '@mui/material/Alert';

function Cart() {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user'));
  const { data, isLoading, refetch } = useFetchCartByUserIdQuery(user?._id);
  const [removeItem, { error: removeError, isLoading: removeIsLoading }] =
    useRemoveItemFromCartByItemIdMutation();
  const [updateQtyItem, { error: updateQtyError, isLoading: updateQtyLoading }] =
    useUpdateQuantityItemByItemIdMutation();

  // const totalAmount = data?.data?.totalPrice;
  // const totalQuantity = data?.data?.totalQuantity;

  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  // const [totalPrice, setTotalPrice] = useState(0);
  // const [totalQty, setTotalQty] = useState(0);
  useEffect(() => {
    if (data) {
      const cartItems = data?.data?.cartItems;
      setCart(cartItems);
      // setTotalPrice(totalAmount);
      // setTotalQty(totalQuantity);
    }
  }, [data]);

  const handleClick = (itemId) => {
    // Find the selected item in the cart based on its ID
    const selectedItem = cart.find((item) => item.id === itemId);

    // Check if the item is already selected by looking for its ID in the selectedItems array
    const isItemSelected = selectedItems.some((item) => item.id === itemId);

    if (isItemSelected) {
      // If the item is already selected, remove it from the selectedItems array
      setSelectedItems((prevSelect) => prevSelect.filter((item) => item.id !== itemId));
    } else {
      // If the item is not selected, add it to the selectedItems array
      setSelectedItems((prevSelect) => [...prevSelect, selectedItem]);
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      return <Alert severity="warning">Please select the Item</Alert>;
    }
    // Use selectedItems when dispatching addToOrder
    selectedItems.forEach((item) => {
      dispatch(addToOrder(item));
    });
    // Reset selectedItems
    setSelectedItems([]);
  };

  const handleRemoveItem = async (itemId) => {
    await removeItem(itemId);
    console.log(itemId);
    await refetch();
  };

  const handleIncQty = async (id) => {
    const updatedCart = await Promise.all(
      cart.map(async (item) => {
        if (item.id === id) {
          // If matched, update the quantity of the item in the backend using updateQtyItem
          await updateQtyItem({ quantity: item.quantity + 1, id, user: user?.id });
          // Return a new object with the updated quantity for the item
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      }),
    );

    setCart(updatedCart);
  };

  const hanldeDecQty = async (id) => {
    const updatedCart = await Promise.all(
      cart.map(async (item) => {
        if (item.id === id && item.quantity > 1) {
          await updateQtyItem({ quantity: item.quantity - 1, id, user: user?.id });
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      }),
    );

    setCart(updatedCart);
  };


  return (
    <>
      <div style={{ backgroundColor: '#D0B8AC', height: '56px' }}></div>
      <CheckoutStep step1 />
      {selectedItems.length === 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Please select the Item
          </Alert>
        )}
      <Container sx={{ marginBottom: '72px' }}>
        {cart?.length === 0 ? (
          <div className="loading-shopping-cart">
            <img className="cart-img" src={cartImg} />
            <h1 className="label-cart">Add Item To Cart</h1>
          </div>
        ) : (
          <div className="cart-item">
            {cart?.map((item) => (
              <Paper key={item._id}>
                <ListItem alignItems="flex-start">
                  <Checkbox
                    onClick={() => handleClick(item.id)}
                    checked={selectedItems.some((selectedItem) => selectedItem.id === item.id)}
                  />
                  <ListItemText
                    sx={{ marginLeft: '15px' }}
                    primary={item?.variations?.name}
                    secondary={
                      <>
                        <Typography
                          sx={{ display: 'inline', width: '200px' }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {item?.variations?.attribute}
                        </Typography>
                        <Typography sx={{ color: 'red' }}>{item?.variations?.price}$</Typography>
                      </>
                    }
                  />
                  <IconButton onClick={() => handleRemoveItem(item.id)}>
                    <CloseIcon />
                  </IconButton>
                </ListItem>
                <div className="cart-item-qty">
                  <IconButton onClick={() => hanldeDecQty(item.id)} disabled={item.quantity === 1}>
                    {<RemoveCircleOutlineIcon />}
                  </IconButton>
                  {item.quantity}
                  <IconButton
                    onClick={() => handleIncQty(item.id)}
                    disabled={item.quantity === item.variations.stock}
                  >
                    {<AddCircleOutlineIcon />}
                  </IconButton>
                </div>
              </Paper>
            ))}
          </div>
        )}

      </Container>
      <div className="d-flex itemcenter j-spacebtw buttom-app-bar">
        {selectedItems.length > 0 ? (
          <Link to={'/cart/order'}>
            <Button
              onClick={handleCheckout}
              type="submit"
              variant="contained"
              sx={{ marginRight: '32px' }}
            >
              Checkout
            </Button>
          </Link>
        ) : (
          <Button
            onClick={handleCheckout}
            type="submit"
            variant="contained"
            sx={{ marginRight: '32px' }}
          >
            Checkout
          </Button>
        )}
      </div>
    </>
  );
}

export default Cart;

import { Container, Button } from '@mui/material';
import {
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useCreateOrderMutation,
} from '../../../redux/store';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearOrder } from '../../../redux/slices/orderSlice';
import { useRemoveItemFromCartByItemIdMutation } from '../../../redux/store';

function PaymentMethod() {
  const selectedItem = useSelector((state) => state.order.orderItems);
  const [removeItem, { error: removeError, isLoading: removeIsLoading }] =
    useRemoveItemFromCartByItemIdMutation();
  const [placeOrder, { isLoading: OrderLoading, error: OrderError }] = useCreateOrderMutation();
  const [payOrder, { isLoading: LoadingPayment, error: PaymentError }] = usePayOrderMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();
  const navigator = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const dispatch = useDispatch();

  const totalPrice = selectedItem.reduce((total, item) => {
    return total + item.quantity * item.variations.price;
  }, 0);
  console.log(selectedItem);
  console.log(totalPrice);
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder();

        // Dynamically determine the fromShop value based on the selected items
        // const uniqueShopIds = new Set(selectedItem.map((item) => item.shopId));

        const result = await placeOrder({
          user: user?._id,
          fromShop: '658bc998e7e2d8e16ffe28f1',
          paymentMethod: 'Paypal',
          isPaid: true,
          paidAt: Date.now(),
          selectedItem,
        });
        // Imagine there is a field "orderId" in the result response
        const orderId = result.data.orderId;

        // update the database to remove item that user had been selected order
        await removeItem(user?._id, orderId);
        dispatch(clearOrder());
        navigator('/cart/order/paymentMethod/success');
        toast.success('Payment successful');
      } catch (err) {
        toast.error(err);
      }
    });
  }
  function onError(err) {
    toast.error(err.message);
  }
  function onCreate(data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: totalPrice,
          },
        },
      ],
    });
  }

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal?.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [errorPayPal, loadingPayPal, paypal, paypalDispatch]);
  return (
    <>
      <div style={{ backgroundColor: '#D0B8AC', height: '56px' }}></div>
      <Container sx={{ marginTop: '50px' }}>
        {!isPending && (
          <PayPalButtons
            onApprove={onApprove}
            createOrder={onCreate}
            onError={onError}
          ></PayPalButtons>
        )}
      </Container>
    </>
  );
}

export default PaymentMethod;

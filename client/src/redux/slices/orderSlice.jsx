import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orderItems: [],
    shippingAddress: [],
  },
  reducers: {
    addToOrder: (state, action) => {
      const newItem = action.payload;
      const existItem = state.orderItems.findIndex((item) => item.id === newItem.id);

      if (existItem !== -1) {
        // console.log('Payload', action.payload);
        state.orderItems[existItem].quantity = newItem.quantity;
      } else {
        state.orderItems.push(newItem);
      }
    },
    clearOrder: (state) => {
      state.orderItems = [];
    },
  },
});

export const { addToOrder, clearOrder } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
// addShippingAddress: (state, action) => {
//   const newAddr = action.payload;
//   return state.shippingAddress.push(newAddr);
// },

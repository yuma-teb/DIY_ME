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
    removeItemAfterOrder: (state, action) => {
      const itemToRemove = action.payload;
      state.orderItems = state.orderItems.filter((item) => item.id !== itemToRemove.id);
    },
    clearCart: (state) => {
      state.orderItems = [];
    },
  },
});

export const { addToOrder, removeItemAfterOrder } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
// addShippingAddress: (state, action) => {
//   const newAddr = action.payload;
//   return state.shippingAddress.push(newAddr);
// },

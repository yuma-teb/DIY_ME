import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiSlice } from './ApiSlice';

const ordersApi = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      fetchAllOrders: builder.query({
        providesTags: ['Order'],
        query: () => {
          const token = localStorage.getItem('token');

          return {
            url: '/orders',
            method: 'GET',
            headers: {
              Authorization: token ? `Bearer ${token}` : 'wtf',
            },
          };
        },
      }),
      fetchOrderById: builder.query({
        providesTags: ['Order'],
        query: (id) => ({
          url: `/orders/${id}`,
          method: 'GET',
        }),
      }),
      createOrder: builder.mutation({
        invalidatesTags: ['Order'],
        query: (newOrder) => {
          return {
            url: `/orders`,
            method: 'POST',
            body: newOrder,
          };
        },
      }),

      updateStatusById: builder.mutation({
        query: (updateStatus) => {
          return {
            url: `/orders/${updateStatus.id}`,
            method: 'PATCH',
            body: updateStatus,
          };
        },
        invalidatesTags: ['Order'],
      }),
      updateLocationById: builder.mutation({
        query: (updateLoc) => {
          return {
            url: `/orders/${updateLoc.id}`,
            method: 'PATCH ',
            body: updateLoc,
          };
        },
      }),
      deleteOrderById: builder.mutation({
        query: (id) => ({
          url: `/orders/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Order'],
      }),
      fetchShopOrders: builder.query({
        query: (id) => {
          console.log(id);
          return {
            url: `orders?shop=${id}`,
          };
        },
      }),
      fetchShopOrders: builder.query({
        query: (id) => {
          console.log(id);
          return {
            url: `orders?shop=${id}`,
          };
        },
      }),
    };
  },
});

export const {
  useFetchAllOrdersQuery,
  useFetchOrderByIdQuery,
  useDeleteOrderByIdMutation,
  useUpdateStatusByIdMutation,
  useUpdateLocationByIdMutation,
  useCreateOrderMutation,
  useFetchShopOrdersQuery,
} = ordersApi;
export { ordersApi };

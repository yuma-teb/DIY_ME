import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const ordersApi = createApi({
  reducerPath: 'orders',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
  endpoints(builder) {
    return {
      fetchAllOrders: builder.query({
        providesTags: ['Order'],
        query: () => {
          return {
            url: '/orders',
            method: 'GET',
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
      updateStatusById: builder.mutation({
        invalidatesTags: ['Order'],
        query: (updateStatus) => {
          return {
            url: `/orders/${updateStatus.id}`,
            method: 'PATCH',
            body: updateStatus,
          };
        },
      }),
      deleteOrderById: builder.mutation({
        query: (id) => ({
          url: `/orders/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: (result, error, id) => [{ type: 'Order', id }],
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
  useFetchShopOrdersQuery,
} = ordersApi;
export { ordersApi };

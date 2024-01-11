import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

const CartApi = createApi({
  reducerPath: 'cart',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
  endpoints(builder) {
    return {
      fetchCartByUserId: builder.query({
        providesTags: ['Cart'],
        query: (userId) => {
          return {
            url: `/cart/${userId}`,
            method: 'GET',
          };
        },
      }),
      addProductToCart: builder.mutation({
        invalidatesTags: ['Cart'],
        query: (newItem) => {
          return {
            url: `/cart`,
            method: 'POST',
            body: newItem,
          };
        },
      }),
      updateQuantityItemByItemId: builder.mutation({
        invalidatesTags: ['Cart'],
        query: (updateQty) => {
          return {
            url: `/cart/${updateQty.id}`,
            method: 'PATCH',
            body: updateQty,
          };
        },
      }),
      removeItemFromCartByItemId: builder.mutation({
        invalidatesTags: ['Cart'],
        query: (itemId) => {
          return {
            url: `/cart/${itemId}`,
            method: 'DELETE',
          };
        },
      }),
    };
  },
});

export const {
  useFetchCartByUserIdQuery,
  useAddProductToCartMutation,
  useUpdateQuantityItemByItemIdMutation,
  useRemoveItemFromCartByItemIdMutation,
} = CartApi;
export { CartApi };

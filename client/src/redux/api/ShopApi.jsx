import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../slices/AuthSlice';
import { useEffect } from 'react';

const shopApi = createApi({
  reducerPath: 'shops',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),

  endpoints(builder) {
    return {
      fetchAllShops: builder.query({
        providesTags: ['Shop'],
        query: () => {
          const token = localStorage.getItem('token');
          return {
            url: '/shops',
            method: 'GET',
            headers: {
              Authorization: token ? `Bearer ${token}` : 'wtf',
            },
          };
        },
      }),
      fetchShopById: builder.query({
        providesTags: ['Shop'],
        query: (id) => ({
          url: `/shops/${id}`,
          method: 'GET',
        }),
      }),
      editShopById: builder.mutation({
        invalidatesTags: ['Shop'],
        query: (credential) => {
          console.log(credential.get('id'));
          return {
            url: `/shops/${credential.get('id')}`,
            method: 'PATCH',
            body: credential,
          };
        },
      }),
      createShop: builder.mutation({
        providesTags: ['Shop'],
        query: (credential) => {
          return {
            url: `/shops`,
            method: 'POST',
            body: credential,
          };
        },
      }),
      deleteShop: builder.mutation({
        invalidatesTags: ['Shop'],
        query: (id) => ({
          url: `/shops/${id}`,
          method: 'DELETE',
        }),
      }),
    };
  },
});

export const {
  useFetchAllShopsQuery,
  useFetchShopByIdQuery,
  useEditShopByIdMutation,
  useCreateShopMutation,
  useDeleteShopMutation,
} = shopApi;
export { shopApi };

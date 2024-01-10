import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const refundReturnApi = createApi({
  reducerPath: 'refundReturn',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
  endpoints(builder) {
    return {
      fetchAllRefundReturn: builder.query({
        providesTags: ['Refund'],
        query: () => {
          return {
            url: '/refund',
            method: 'GET',
          };
        },
      }),
      fetchRefundReturnById: builder.query({
        providesTags: ['Refund'],
        query: (id) => {
          return {
            url: `/refund/${id}`,
            method: 'GET',
          };
        },
      }),
      deleteRefundReturnById: builder.mutation({
        invalidatesTags: ['Refund'],
        query: (id) => {
          return {
            url: `/refund/${id}`,
            method: 'DELETE',
          };
        },
      }),
      updateRefundReturnById: builder.mutation({
        invalidatesTags: ['Refund'],
        query: (updateRefund) => {
          console.log(updateRefund);
          return {
            url: `/refund/${updateRefund.id}`,
            method: 'PATCH',
            body: updateRefund,
          };
        },
      }),
      fetchShopRefundReturn: builder.query({
        query: (id) => ({
          url: `refund?shop=${id}`,
        }),
      }),
    };
  },
});

export const {
  useFetchAllRefundReturnQuery,
  useFetchRefundReturnByIdQuery,
  useDeleteRefundReturnByIdMutation,
  useUpdateRefundReturnByIdMutation,
  useFetchShopRefundReturnQuery,
} = refundReturnApi;

export { refundReturnApi };

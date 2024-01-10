import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const refundsApi = createApi({
  reducerPath: 'refund',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
  endpoints(builder) {
    return {
      fetchAllRefunds: builder.query({
        providesTags: ['Refund'],
        query: () => {
          return {
            url: '/refund',
            method: 'GET',
          };
        },
      }),
      fetchRefundById: builder.query({
        providesTags: ['Refund'],
        query: (id) => {
          return {
            url: `/refund/${id}`,
            method: 'GET',
          };
        },
      }),
      deleteRefundById: builder.mutation({
        invalidatesTags: ['Refund'],
        query: (id) => {
          return {
            url: `/refund/${id}`,
            method: 'DELETE',
          };
        },
      }),
      updateRefundById: builder.mutation({
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
    };
  },
});

export const {
  useFetchAllRefundsQuery,
  useFetchRefundByIdQuery,
  useDeleteRefundByIdMutation,
  useUpdateRefundByIdMutation,
} = refundsApi;

export { refundsApi };

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const productReviewApi = createApi({
  reducerPath: 'productReview',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
  endpoints(builder) {
    return {
      fetchAllProductReviews: builder.query({
        providesTags: ['ProductReview'],
        query: (productId) => {
          return {
            url: `/review?product=${productId}`,
            method: 'GET',
          };
        },
      }),
    };
  },
});

export const {
  useFetchAllProductReviewsQuery,
} = productReviewApi;
export { productReviewApi };

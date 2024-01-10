import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const reportsApi = createApi({
  reducerPath: 'reports',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
  endpoints(builder) {
    return {
      fetchAllReports: builder.query({
        query: () => ({
          url: '/reports',
          method: 'GET',
        }),
        providesTags: ['Reports'],
      }),

      addReport: builder.mutation({
        query: (data) => ({
          url: '/reports',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Reports'],
      }),

      fetchSingleReport: builder.query({
        query: (reportId) => ({
          url: `/reports/${reportId}`,
          method: 'GET',
        }),
        providesTags: ['Reports'],
      }),

      deleteReport: builder.mutation({
        query: (reportId) => ({
          url: `/reports/${reportId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Reports'],
      }),
    };
  },
});

export const {
  useFetchAllReportsQuery,
  useAddReportMutation,
  useFetchSingleReportQuery,
  useDeleteReportMutation,
} = reportsApi;

export { reportsApi };

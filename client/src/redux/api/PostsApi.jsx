// Importing necessary functions from @reduxjs/toolkit/query/react
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Creating an API service using createApi
const postsApi = createApi({
  // Specifying the reducer path for storing API state in Redux
  reducerPath: 'posts',
  // Configuring the base query with the backend URL
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
  // Defining endpoints for interacting with the backend
  endpoints(builder) {
    return {
      // Endpoint for fetching posts
      fetchPosts: builder.query({
        providesTags: ['Posts'], // Tags to invalidate when this query is executed
        query: () => ({
          url: '/posts',
          method: 'GET',
        }),
      }),
      // Endpoint for adding a new post
      addPost: builder.mutation({
        invalidatesTags: ['Posts'], // Tags to invalidate when this mutation is executed
        query: (data) => ({
          url: '/posts',
          method: 'POST',
          body: data,
        }),
      }),
      // Endpoint for fetching a single post by ID
      fetchSinglePost: builder.query({
        providesTags: ['Posts'], // Tags to invalidate when this query is executed
        query: (postId) => ({
          url: `/posts/${postId}`,
          method: 'GET',
        }),
      }),
      // Endpoint for deleting a post
      deletePost: builder.mutation({
        invalidatesTags: ['Posts'],
        query: (postId) => ({
          url: `/posts/${postId}`,
          method: 'DELETE',
        }),
      }),
      //Endpoint for updating a post
      updatePost: builder.mutation({
        invalidatesTags: ['Posts'],
        query: (postId) => ({
          url: `/posts/${postId._id}`,
          method: 'PATCH',
          body: postId
        }),
      }),
      //Endpoint for my posts
      fetchPostsById: builder.query({
        providesTags: ['Posts'], // Tags to invalidate when this query is executed
        query: (userId) => ({
          url: `/posts?user=${userId}`,
          method: 'GET',
        }),
      }),
    };
  },
});

// Exporting hooks for each endpoint and the API instance
export const {
  useFetchPostsQuery,
  useAddPostMutation,
  useFetchSinglePostQuery,
  useDeletePostMutation,
  useUpdatePostMutation,
  useFetchPostsByIdQuery,
} = postsApi;

export { postsApi };

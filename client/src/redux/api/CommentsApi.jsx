import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const commentsApi = createApi({
  reducerPath: 'comments',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
  endpoints(builder) {
    return {
      fetchComments: builder.query({
        query: (postId) => ({
          url: `/comment/${postId}/comments`,
          method: 'GET',
        }),
        providesTags: ['Comment'],
      }),
      addComment: builder.mutation({
        query: ({ postId, data }) => ({
          url: `/comment/${postId}/comments`,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Comment'],
      }),
      deleteComment: builder.mutation({
        query: (commentId) => ({
          url: `/comment/${commentId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Comment'],
      }),
      updateComment: builder.mutation({
        query: (commentId) => ({
          url: `/comment/${commentId._id}`,
          method: 'PATCH',
          body: commentId
        }),
        invalidatesTags: ['Comment'],
      }),
      addReply: builder.mutation({
        query: ({ commentId, data }) => ({
          url: `/comment/${commentId}/reply`,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Comment'],
      }),
      deleteReply: builder.mutation({
        query: ({ commentId, replyId }) => ({
          url: `/comment/${commentId}/replies/${replyId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Comment'],
      }),
    };
  },
});

export const {
  useFetchCommentsQuery,
  useAddCommentMutation,
  useAddReplyMutation,
  useDeleteCommentMutation,
  useDeleteReplyMutation,
  useUpdateCommentMutation
} = commentsApi;

export { commentsApi };

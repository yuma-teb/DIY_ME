import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../slices/AuthSlice';
import { useEffect } from 'react';
import { apiSlice } from './ApiSlice';

const usersApi = apiSlice.injectEndpoints({
  endpoints(builder) {
    return {
      editSelf: builder.mutation({
        invalidatesTags: ['User'],
        query: ({ id, updatedUser }) => {
          return {
            url: `/users/${id}/update`,
            method: 'PATCH',
            body: updatedUser,
          };
        },
      }),
      editUser: builder.mutation({
        invalidatesTags: ['User'],
        query: ({ id, updatedUser }) => {
          return {
            url: `/users/${id}`,
            method: 'PATCH',
            body: updatedUser,
          };
        },
      }),
      removeUser: builder.mutation({
        invalidatesTags: ['User'],
        query: (id) => {
          return {
            url: `/users/${id}`,
            method: 'DELETE',
          };
        },
      }),
      addUser: builder.mutation({
        invalidatesTags: ['User'],
        query: (newUserData) => {
          return {
            url: '/users/signup',
            method: 'POST',
            body: newUserData,
          };
        },
      }),
      fetchAllUsers: builder.query({
        providesTags: ['User'],
        query: () => {
          const token = localStorage.getItem('token');
          return {
            url: '/users',
            method: 'GET',
            headers: {
              Authorization: token ? `Bearer ${token}` : 'wtf',
            },
          };
        },
      }),
      fetchUserById: builder.query({
        providesTags: ['User'],
        query: (id) => ({
          url: `/users/${id}`,
          method: 'GET',
        }),
      }),
      fetchUser: builder.query({
        query: (searchTerm) => ({
          url: `/users/search/${searchTerm}`,
          method: 'GET',
        }),
      }),
      fetchShopCandidate: builder.query({
        query: () => ({
          url: `users/shop`,
          method: 'GET',
        }),
      }),
      fetchUserOrder: builder.query({
        query: (id) => {
          console.log("QUERY", id);
          return {
            url: `/orders?user=${id}`
          }

        }
      })
    };
  },
});
// const usersApi = createApi({
//   reducerPath: 'users',
//   baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
//   prepareHeaders: (headers, { getState, endpoint }) => {
//     const token = localStorage.getItem('token');
//     if (user) {
//       headers.set('Authorization', `Bearer ${token}`);
//     }
//     return headers;
//   },

//   endpoints(builder) {
//     return {
//       editSelf: builder.mutation({
//         invalidatesTags: ['User'],
//         query: (updatedUser) => {
//           return {
//             url: `/users/${updatedUser.get('id')}/update`,
//             method: 'PATCH',
//             body: updatedUser,
//           };
//         },
//       }),
//       editUser: builder.mutation({
//         invalidatesTags: ['User'],
//         query: ({ id, updatedUser }) => {
//           return {
//             url: `/users/${id}`,
//             method: 'PATCH',
//             body: updatedUser,
//           };
//         },
//       }),
//       removeUser: builder.mutation({
//         invalidatesTags: ['User'],
//         query: (id) => {
//           return {
//             url: `/users/${id}`,
//             method: 'DELETE',
//           };
//         },
//       }),
//       addUser: builder.mutation({
//         invalidatesTags: ['User'],
//         query: (newUserData) => {
//           return {
//             url: '/users/signup',
//             method: 'POST',
//             body: newUserData,
//           };
//         },
//       }),
//       fetchAllUsers: builder.query({
//         providesTags: ['User'],
//         query: () => {
//           const token = localStorage.getItem('token');
//           return {
//             url: '/users',
//             method: 'GET',
//             headers: {
//               Authorization: token ? `Bearer ${token}` : 'wtf',
//             },
//           };
//         },
//       }),
//       fetchUserById: builder.query({
//         providesTags: ['User'],
//         query: (id) => ({
//           url: `/users/${id}`,
//           method: 'GET',
//         }),
//       }),
//       fetchUser: builder.query({
//         query: (searchTerm) => ({
//           url: `/users/search/${searchTerm}`,
//           method: 'GET',
//         }),
//       }),
//       fetchShopCandidate: builder.query({
//         query: () => ({
//           url: `users/shop`,
//           method: 'GET',
//         }),
//       }),
//     };
//   },
// });

export const {
  useFetchAllUsersQuery,
  useFetchUserByIdQuery,
  useFetchUserQuery,
  useAddUserMutation,
  useRemoveUserMutation,
  useEditUserMutation,
  useEditSelfMutation,
  useFetchShopCandidateQuery,
  useFetchUserOrderQuery,
} = usersApi;
export { usersApi };

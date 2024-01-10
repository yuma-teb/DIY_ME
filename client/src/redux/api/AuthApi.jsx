import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logOut } from '../../redux/slices/AuthSlice';
import { apiSlice } from './ApiSlice';
// Function to get user credentials and headers from storage
export const getStoredCredentials = () => {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');
  const storedHeaders = localStorage.getItem('headers');

  return { user: storedUser, token: storedToken, headers: storedHeaders };
};

// Function to set user credentials and headers to storage
const setStoredCredentials = ({ user, token, headers }) => {
  localStorage.setItem('user', user);
  localStorage.setItem('token', token);
  localStorage.setItem('headers', JSON.stringify(headers));
};

const apiAuthSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: { ...credentials },
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const result = await queryFulfilled;

        // Extract and store headers from the login result
        const loginHeaders = result.originalHeaders;
        dispatch(setCredentials({ ...result.data, loginHeaders }));

        // Store login credentials and headers to storage
        setStoredCredentials({
          user: result.data.user,
          token: result.data.token,
          headers: loginHeaders,
        });
      },
    }),
    resetPassword: builder.mutation({
      query: (email) => ({
        url: '/auth/resetPassword',
        method: 'POST',
        body: email,
      }),
    }),
    updateResetPassword: builder.mutation({
      query: (credentials) => ({
        url: `/auth/updateResetPassword/${credentials.token}`,
        method: 'PATCH',
        body: credentials,
      }),
    }),
    useSignUp: builder.mutation({
      query: (data) => ({
        url: '/users/signup',
        method: 'POST',
        body: data,
      }),
    }),
    thridPartyGoogle: builder.query({
      query: () => ({
        url: '/auth/google',
        method: 'GET',
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const result = await queryFulfilled;

        // Handle the result from the Google OAuth callback
        console.log('Google Callback Result:', result);

        // Extract and store the necessary information from the callback result
        // For example, you can access result.data for user details
      },
    }),
    thirdPartyCallBack: builder.query({
      query: () => ({
        url: '/auth/success',
        method: 'GET',
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const result = await queryFulfilled;

        // Handle the result from the Google OAuth callback
        console.log('Google Callback Result:', result);

        // Extract and store the necessary information from the callback result
        // For example, you can access result.data for user details
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useResetPasswordMutation,
  useUpdateResetPasswordMutation,
  useUseSignUpMutation,
  useThirdPartyCallBackQuery,
  useThridPartyGoogleQuery,
} = apiAuthSlice;
export { apiAuthSlice };

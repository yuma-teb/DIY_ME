import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { Navigate, useNavigate } from 'react-router-dom';

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    logOut: (state, action) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('img');
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;

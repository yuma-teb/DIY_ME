import { useNavigate, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurrentToken,
  setCredentials,
  logOut,
  selectCurrentUser,
} from '../redux/slices/AuthSlice';
import { useEffect, useState } from 'react';
import Login from '../auth/Login';

const RequireAuth = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const storedToken = localStorage.getItem('token');
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const isAuthenticated = useSelector(selectCurrentToken);

  const navigate = useNavigate();

  const logOutAccount = () => {
    dispatch(logOut());
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (storedToken && storedUser) {
        dispatch(setCredentials({ user: storedUser, token: storedToken }));
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (initialCheckDone) {
      // Apply styling here based on the existence of the token
      if (localStorage.getItem('token')) {
        // Apply styles for authenticated state
        document.body.classList.add('authenticated');
      } else {
        // Remove styles for unauthenticated state
        document.body.classList.remove('authenticated');
      }
    } else {
      // Update the state to indicate that the initial check has been performed
      setInitialCheckDone(true);
    }

    if (isAuthenticated && location.pathname === '/login' && initialCheckDone) {
      navigate('/');
    }
    // This logic will be changed.
    if (
      isAuthenticated &&
      initialCheckDone &&
      storedUser.role.toLowerCase() === 'admin' &&
      location.pathname !== '/admin'
    ) {
      // Redirect to the admin page if the user is authenticated as an admin
      navigate('/admin');
      // } else if (
      //
      // ) {
      //   // Redirect to the shop page if the user is authenticated as a shop
      //   navigate('/shop');
    }
  }, [isAuthenticated, navigate, location.pathname, initialCheckDone]);

  return localStorage.getItem('token') &&
    (storedUser.role.toLowerCase() === 'admin' || storedUser.role.toLowerCase() === 'shop') ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
export default RequireAuth;

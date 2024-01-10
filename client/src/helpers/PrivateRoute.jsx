import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectCurrentToken, selectCurrentUser } from '../redux/slices/AuthSlice';
import AccessDenied from '../auth/AccessDeniedPage';
const PrivateRoute = ({ children, roles }) => {
  let location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const userHasRequiredRole = user && roles.includes(user.role);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (token && !userHasRequiredRole) {
    return <AccessDenied />; // Build your own access denied page (something like 404)
  }

  return children;
};

export default PrivateRoute;

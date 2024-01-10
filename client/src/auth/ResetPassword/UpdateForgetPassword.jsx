import React, { useEffect, useState } from 'react';
import { useLoginMutation } from '../../redux/api/AuthApi';
import { logOut } from '../../redux/slices/AuthSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  Alert,
  AlertTitle,
  Avatar,
  Button,
  CssBaseline,
  Collapse,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Container,
  Box,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useUpdateResetPasswordMutation } from '../../redux/api/AuthApi';
import { useParams } from 'react-router-dom';

export default function UpdateForgetPassword() {
  // create at dispatch function
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const [data, setData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(0);
  const [toLogin, setToLogin] = useState(3);
  const [togle, setTogle] = useState(false);
  const [updateResetPassword] = useUpdateResetPasswordMutation();

  useEffect(() => {
    if (alert === 1) {
      const countdownInterval = setInterval(() => {
        console.log(localStorage.getItem('token'));
        setToLogin((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
      }, 1000);

      // Clear the interval when the countdown reaches 0
      if (toLogin === 0) {
        clearInterval(countdownInterval);
        setAlert(0);
        dispatch(logOut());
        navigate('/login');
      }

      // Clear the interval when the component unmounts or the alert state changes
      return () => clearInterval(countdownInterval);
    }
  }, [alert, toLogin]);
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (data.password !== data.confirmPassword) {
      setAlert(2);
      return;
    }
    const res = await updateResetPassword({ token, ...data });
    if (res.data.status === 'success') {
      setAlert(1);
    }
  };

  return (
    <div>
      <div className="login-success">
        <Collapse in={alert == 1}>
          <Alert className="full-width-alert" severity="success">
            <AlertTitle>Success</AlertTitle>
            Reset password success. Redirecting to login page in {toLogin}
          </Alert>{' '}
        </Collapse>

        <Collapse in={alert == 2}>
          <Alert className="full-width-alert" severity="error">
            <AlertTitle>Error</AlertTitle>
            Password not matched
          </Alert>{' '}
        </Collapse>
      </div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            New Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {/* Password TextField */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={data.password}
              onChange={handlePasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {/* Confirm Password TextField */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              id="confirmPassword"
              type={togle ? 'text' : 'password'}
              value={data.confirmPassword}
              onChange={handlePasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setTogle(!togle)}
                      edge="end"
                    >
                      {togle ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Update Password
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

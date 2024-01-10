// index.jsx

import React, { useState, useEffect } from 'react';
import {
  Alert,
  AlertTitle,
  IconButton,
  InputAdornment,
  Avatar,
  Collapse,
  FormControlLabel,
  CssBaseline,
  Checkbox,
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Grid,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Link from '@mui/material/Link';

import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../../redux/slices/AuthSlice';
import { useLoginMutation } from '../../redux/api/AuthApi';
import { selectCurrentToken, selectCurrentUser } from '../../redux/slices/AuthSlice';
import { useNavigate } from 'react-router-dom';
import './style.css';
import AuthUtil from '../AuthUtil';
export default function Index() {
  // create a state which is used for login
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [test, setTesting] = useState('');
  const [passwordValidator, setPasswordValidator] = useState(0);
  const [alert, setAlert] = useState(0);
  const [loginCountDown, setLoginCountDown] = useState(3);
  const [showPassword, setShowPassword] = useState(false);

  // user state
  const [loginMutation, { data, error, isLoading, meta }] = useLoginMutation();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  ////// ---- Email validatation ----//////

  ////// ---- Display countdown for login ----//////
  useEffect(() => {
    if (alert === 4) {
      const countdownInterval = setInterval(() => {
        console.log(localStorage.getItem('token'));
        setLoginCountDown((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
      }, 1000);

      // Clear the interval when the countdown reaches 0
      if (loginCountDown === 0) {
        clearInterval(countdownInterval);
        setAlert(0);
        const user = JSON.parse(localStorage.getItem('user'));
        if (user.role === 'Admin') {
          navigate('/admin');
        } else if (user.role === 'Shop') {
          navigate('/shop');
        } else {
          navigate('/');
        }
      }

      // Clear the interval when the component unmounts or the alert state changes
      return () => clearInterval(countdownInterval);
    }
  }, [alert, loginCountDown, navigate]);

  ////// ---- Email and password validator ----//////
  useEffect(() => {
    if (loginData.email && !AuthUtil.validateEmail(loginData.email)) {
      // not a valid email
      setAlert(7);
      console.log('Alert Invalid email', alert);
    } else {
      setAlert(0);
    }
    if (loginData.password && loginData.password.length < 8) {
      setPasswordValidator(8);
    } else {
      if (loginData.password.length > 7 || loginData.password.length == 0) setPasswordValidator(0);
    }
  }, [loginData.email, loginData.password]);

  ////// ---- Input data ----//////
  const handleInput = (e) => {
    const { name, value } = e.target;
    // set the data to the state
    // Add validation for email and password

    setLoginData((prevData) => {
      console.log(`Previous Data:`, prevData);
      console.log(`Setting ${name} to ${value}`);
      return { ...prevData, [name]: value };
    });
  };

  ////// ---- submit data ----//////
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      alert === 7 ||
      passwordValidator === 8 ||
      loginData.email === '' ||
      loginData.password === ''
    ) {
      if (loginData.email === '' && loginData.password === '') {
        return setAlert(3);
      } else if (loginData.email === '') {
        return setAlert(1);
      } else if (loginData.password === '') {
        return setAlert(2);
      }
      return;
    }

    // submit the data to the server
    const result = await loginMutation(loginData);
    console.log('Result: ', result);
    // check if there is any error
    if (result.error) {
      if (result.error.originalStatus === 404) {
        // alert = 5 mean that no email found
        setAlert(5);
        return;
      } else {
        // incorrect password
        setAlert(6);
        return;
      }
    }

    // Assuming the data is nested under result.data, adjust accordingly
    const userData = result.data.data; // Change this based on the actual structure
    const token = result.data.token;
    console.log(userData.user.role.toLowerCase());

    if (
      (userData && userData.user.role.toLowerCase() === 'admin') ||
      userData.user.role.toLowerCase() === 'shop'
    ) {
      localStorage.setItem('user', JSON.stringify(userData.user));
      localStorage.setItem('token', token);
      console.log('Token: ', localStorage.getItem('user').role);
      // get data
      // set user data to the state
      const dataLogin = {
        user: JSON.parse(localStorage.getItem('user')),
        token: localStorage.getItem('token'),
      };

      if (dataLogin.user && dataLogin.token) {
        dispatch(setCredentials(dataLogin));
        console.log('USER TOKEN: ', userData.token);
        // Use a new code to identify the success state
        setAlert(4);
      }
    } else {
      localStorage.setItem('user', JSON.stringify(userData.user));
      localStorage.setItem('token', token);
      console.log('Token: ', localStorage.getItem('user').role);
      // get data
      // set user data to the state
      const dataLogin = {
        user: JSON.parse(localStorage.getItem('user')),
        token: localStorage.getItem('token'),
      };

      if (dataLogin.user && dataLogin.token) {
        dispatch(setCredentials(dataLogin));
        console.log('USER TOKEN: ', userData.token);
        // Use a new code to identify the success state
        setAlert(4);
      }
      navigate('/');
    }
  };
  const alertMessages = {
    1: 'Please fill your email.',
    2: 'Please fill your password.',
    3: 'Please fill in both email and password fields.',
    5: 'Email not found!',
    6: 'Password Incorrect',
    7: 'Invalid Email',
    8: 'Password is so weak like you',
    9: ' You must login as an admin!',
  };

  ////// ---- switch alert ----//////
  const returnAlert = (code) => {
    const message = alertMessages[code];
    return message ? (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {message}
      </Alert>
    ) : null;
  };

  return (
    <div>
      <div className="login-success">
        <Collapse in={alert == 4}>
          <Alert className="full-width-alert" severity="success">
            <AlertTitle>Success</AlertTitle>
            You are loging to admin page in {loginCountDown}
          </Alert>{' '}
        </Collapse>

        <Collapse in={alert == 9}>
          <Alert className="full-width-alert" severity="error">
            <AlertTitle>Error</AlertTitle>
            You must login as an admin!
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: '56px', height: '56px' }}>
            <AccountCircleIcon sx={{ width: '56px', height: '56px' }} />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              error={alert === 1 || alert === 5 || alert == 7 || alert == 3}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={loginData.email}
              onChange={handleInput}
            />
            <Collapse in={alert == 7}>{returnAlert(7)}</Collapse>

            <TextField
              error={
                alert === 2 || alert === 6 || alert == 1 || passwordValidator === 8 || alert == 3
              }
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={!showPassword ? 'password' : 'text'}
              id="password"
              value={loginData.password}
              onChange={handleInput}
              // toggle eyes
              InputProps={
                loginData.password
                  ? {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            sx={{
                              color:
                                alert === 2 || alert === 6 || passwordValidator === 8 ? 'red' : '',
                            }}
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
                  : ''
              }
            />
            <Collapse in={passwordValidator == 8}>{returnAlert(8)}</Collapse>

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Login
            </Button>
          </Box>
          <Grid container>
            <Grid item xs>
              <Link href="/resetPassword" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
        <Collapse in={alert == 3}>{returnAlert(3)}</Collapse>
        <Collapse in={alert == 5}>{returnAlert(5)}</Collapse>
        <Collapse in={alert == 1}>{returnAlert(1)}</Collapse>
        <Collapse in={alert == 6}>{returnAlert(6)}</Collapse>
        <Collapse in={alert == 2}>{returnAlert(2)}</Collapse>
      </Container>
    </div>
  );
}

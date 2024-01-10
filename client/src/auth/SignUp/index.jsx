import { useEffect, useState } from 'react';

import {
  Collapse,
  Box,
  Grid,
  Checkbox,
  FormControlLabel,
  TextField,
  CssBaseline,
  Button,
  Avatar,
  Link,
  Alert,
  AlertTitle,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Google, Facebook } from '@mui/icons-material';
import { createTheme } from '@mui/material/styles';
import {
  useUseSignUpMutation,
  useThirdPartyCallBackQuery,
  useThridPartyGoogleQuery,
} from '../../redux/api/AuthApi';
import AuthUtil from '../AuthUtil';
import { useNavigate } from 'react-router-dom';
import './style.css';

export default function SignUp() {
  // create hook
  const thridPartyGoogle = useThridPartyGoogleQuery();
  const thirdPartyCallBack = useThirdPartyCallBackQuery();
  console.log(thirdPartyCallBack);
  // create a state which is used to store objects to
  const [signUser, { isLoading, isError }] = useUseSignUpMutation();
  const [user, setUser] = useState(null);
  const [data, setData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [code, setCode] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    thirdPartyCallBack.refetch();

    if (user) {
      console.log('#@USER$#', user);
      setUser(user);
    }
  }, [user]);

  // create useEffect for user to check the email or password
  useEffect(() => {
    // checking email
    if (data.email && !AuthUtil.validateEmail(data.email)) {
      setCode(7);
    } else if (data.password && data.confirmPassword && data.confirmPassword !== data.password) {
      setCode(8);
    } else {
      setCode(0);
    }
  }, [data.email, data.confirmPassword]);

  // handle google sign in
  const handleGoogleSignIn = () => {
    window.open(`${import.meta.env.VITE_BACKEND_URL}/auth/google`);
  };
  // change the state value
  const handleChange = (e) => {
    const { name, value } = e.target;

    // update the state
    setData({ ...data, [name]: value });
    // check value every changes
    console.log(data);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!data.firstName || !data.lastName) {
      setCode(3);
      return;
    }
    if (!data.password || !data.confirmPassword) {
      setCode(11);
      return;
    }

    if (code !== 0) {
      return;
    }
    console.log('@@@ Data @@', data);
    // submit the user
    const res = await signUser(data);
    console.log(res);
    if (res?.error?.status === 400) {
      if (res?.error?.data?.message === 'Username already exists.') {
        return setCode(10);
      } else {
        return setCode(6);
      }
    }

    if (res.data.data.user && res.data.token && res.data.status === 'success') {
      // display success message
      console.log(' SUCCESS SIGN UP');
      console.log('@@ Token @@', res.data.token);

      // set localstorage
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } else {
      setCode(9);
    }

    //
  };

  const alertMessages = {
    1: 'Please fill your email.',
    2: 'Please fill your password.',
    3: 'Please fill your name',
    4: 'Password not matched',
    6: 'Email already exist!',
    7: 'Invalid Email',
    8: 'Password not matched',
    9: 'Error register new user',
    10: 'Username already exists.',
    11: 'Fill in your password',
  };

  // alert meessage
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
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                error={code == 3 || code == 10}
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                value={data.firstName}
                onChange={handleChange}
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                error={code == 3 || code == 10}
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                value={data.lastName}
                onChange={handleChange}
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={code === 7 || code === 6}
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={data.email}
                onChange={handleChange}
              />
              <Collapse in={code == 7}>{returnAlert(7)}</Collapse>
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={code === 8 || code === 11}
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={data.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={code === 8 || code === 11}
                required
                fullWidth
                name="confirmPassword"
                label="confirmPassword"
                type="password"
                id="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </Grid>

            {/* Google Icon */}
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
          <hr />
          <a href={`${import.meta.env.VITE_BACKEND_URL}/auth/google`}>
            <Button fullWidth variant="outlined" sx={{ mt: 1, mb: 1 }}>
              <img src="../../../public/google.png" alt="google" className="img-icon" />
              Continue with google
            </Button>
          </a>

          <Button type="submit" fullWidth variant="outlined" sx={{ mt: 1, mb: 1 }}>
            <img src="../../../public/facebook.png" alt="google" className="img-icon" />
            Continue with facebook
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Collapse in={code}>{returnAlert(code)}</Collapse>
    </Container>
  );
}

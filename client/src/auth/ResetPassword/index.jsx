import { useEffect, useState } from 'react';
import { useResetPasswordMutation } from '../../redux/api/AuthApi';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Alert,
  AlertTitle,
  Collapse,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function ResetPassword() {
  // destructure the api for user
  const [resetPassword] = useResetPasswordMutation();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(0);
  const navigatet = useNavigate();
  useEffect(() => {
    if (email) {
      setCode(0);
    }
  }, [email]);
  // submit the email for a respone link
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      setCode(1);
      return;
    }
    let respone = null;
    if (email) {
      setCode(2);
      respone = await resetPassword({ email });
    }

    if (respone.data.status === 'success') {
      navigatet('/resetPassword/checkingemail');
    }
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
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
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={email.email}
            onChange={handleEmailChange}
            autoComplete="email"
            autoFocus
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Find you gmail
          </Button>
        </Box>
      </Box>
      <Collapse in={code === 1}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          "Please input your email"
        </Alert>
      </Collapse>
      <Collapse in={code === 2}>
        <Alert severity="success">
          <AlertTitle>Sending</AlertTitle>
          Sending the link {email}
        </Alert>
      </Collapse>
    </Container>
  );
}

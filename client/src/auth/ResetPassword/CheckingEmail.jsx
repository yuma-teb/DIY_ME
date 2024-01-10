import React from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';

const CheckingEmailTemplate = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <Typography component="h1" variant="h5">
          Checking Your Email
        </Typography>
        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="body2" color="textSecondary">
            We've sent a confirmation to your email address. Please check your email for
            instructions.
          </Typography>
        </Box>
        <CircularProgress color="primary" />
      </Box>
    </Container>
  );
};

export default CheckingEmailTemplate;

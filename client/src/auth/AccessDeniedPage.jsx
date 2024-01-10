import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Typography, Container, Button, Grid, Paper } from '@mui/material';

const AccessDenied = () => {
  const history = useNavigate();

  const handleGoBack = () => {
    history(-1);
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '50px' }}>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item xs={12} align="center">
            <Typography variant="h4">Access Denied</Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <Typography variant="body1">You do not have permission to access this page.</Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
            >
              Go Back
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AccessDenied;

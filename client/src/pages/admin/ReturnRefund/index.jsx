import React from 'react';
import RefundReturnTable from './ReturnRefundTable';
import SearchRequest from './SearchRequest';
import { Container, CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '../../../components/admin/Theme';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import './returnRefund.css';

const Refund = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box>
          <div className="top">
            <Typography variant="h2">Return and Refund Policy</Typography>
            <Link to="/admin" className="link">
              Order
            </Link>
            {' > Return and Refund Policy'}
          </div>
          <SearchRequest />
          <RefundReturnTable />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Refund;

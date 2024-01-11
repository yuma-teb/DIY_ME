import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import './index.css'

const steps = ['Cart', 'Payment', 'Completed'];

export default function CheckoutStep({ step1, step2, step3 }) {
  const activeStep = step3 ? 2 : step2 ? 1 : step1 ? 0 : 0;

  const icons = {
    0: <ShoppingCartIcon />,
    1: <PaymentIcon />,
    2: <CheckCircleOutlineIcon />,
  };

  return (
    <Box sx={{ width: '100%', marginTop: '20px' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              icon={icons[index]}
              sx={{
                color: index <= activeStep ? '#D0B8AC' : 'inherit',
              }}
              completed={index < activeStep}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

import React from 'react';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Container, Button } from '@mui/material';
import './index.css';

const YourComponent = () => {
  const [selectedValue, setSelectedValue] = React.useState('a');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <>
      <div style={{ backgroundColor: '#D0B8AC', height: '64px' }}></div>

      <Container>
        <div className="payment">
          <h1>PaymentMethod</h1>
          <div className='payment-radio'>
            <FormControlLabel
              control={<Radio />}
              label="Paypal or CreditCard"
              checked={selectedValue === 'a'}
              onChange={handleChange}
              value="a"
              name="radio-buttons"
              inputProps={{ 'aria-label': 'A' }}
            />

            <FormControlLabel
              control={<Radio />}
              label="Cash On Delivery"
              checked={selectedValue === 'b'}
              onChange={handleChange}
              value="b"
              name="radio-buttons"
              inputProps={{ 'aria-label': 'B' }}
            />
          </div>
          <Button variant='contained'>Continue</Button>
        </div>
      </Container>
    </>
  );
};

export default YourComponent;

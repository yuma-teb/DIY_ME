import './index.css';
import { Button, Container } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '../../../components/admin/TextField/index';

function ShippingAddress() {
  const [shipAddress, setShipAddress] = useState('');
  const [cityText, setCity] = useState('');
  const [open, setOpen] = useState(false);


  const handleInfoContainer = () => {
    setOpen(true);
  };
  const handleAddrChange = (e) => {
    setShipAddress(e.target.value);
  };
  const hanldeCityChange = (e) => {
    setCity(e.target.value);
  };

  const hanldeSubmit = (e) => {
    e.preventDefault();

  };

  return (
    <>
      <div style={{ backgroundColor: '#D0B8AC', height: '64px' }}></div>
      <div className="location-info">
        <h1 className="label-location">Location</h1>
        <div className="address-info">
          {/* <span>Maxxi</span>
          <span>098334473</span> */}
          <span>1833 Bel Meadow Drive, Fontana, California 92335, USA</span>
        </div>
      </div>
      <Container>
        <div className="btn-add-location">
          {!open && (
            <Button
              sx={{ width: '340px', color: 'black' }}
              variant="text"
              onClick={handleInfoContainer}
            >
              +Add Location
            </Button>
          )}
          {open && (
            <>
              <div className="addr-info-container">
                <hr style={{ width: '100%', backgroundColor: '#49454F' }} />
                <h1 style={{ padding: '10px' }}>Address Info</h1>

                <TextField
                  id="outlined-basic"
                  label="Address"
                  variant="outlined"
                  value={shipAddress}
                  onChange={handleAddrChange}
                  width={'350px'}
                />

                <TextField
                  id="outlined-basic"
                  label="City"
                  variant="outlined"
                  value={cityText}
                  onChange={hanldeCityChange}
                  width={'350px'}
                />
              </div>
            </>
          )}
        </div>
        <div className="cancel-save-btn">
          <Button sx={{ marginRight: '15px' }} variant="outlined">
            Cancel
          </Button>
          <Button variant="contained" onClick={hanldeSubmit}>
            Save
          </Button>
        </div>
      </Container>
    </>
  );
}
export default ShippingAddress;

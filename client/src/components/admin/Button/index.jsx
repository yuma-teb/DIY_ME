// src/components/ButtonExample.js
import Button from '@mui/material/Button';

const ButtonComponent = ({ label }) => {
  const buttonStyle = {
    // Your custom styles here
    borderRadius: '8px',
    // ... other styles
  };
  return (
    <div>
      {' '}
      <Button variant="contained" color="secondary" style={buttonStyle}>
        {label}
      </Button>
    </div>
  );
};

export default ButtonComponent;

import React from 'react';
import { useState } from 'react';
import { Checkbox } from '@mui/material';

const index = () => {
  //for Checkbox
  const [checked, setChecked] = React.useState(true);
  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <>
      <Checkbox
        color="view"
        checked={checked}
        onChange={handleCheckboxChange}
        inputProps={{ 'aria-label': 'controlled' }}
      />
    </>
  );
};
export default index;

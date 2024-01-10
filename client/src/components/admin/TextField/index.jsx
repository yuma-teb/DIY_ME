import React from 'react';
import { useState } from 'react';
import { TextField } from '@mui/material';

const index = ({ label, value, width }) => {
  let text = value;
  //for TextField
  const [textFieldVal, setTextFieldVal] = useState(text);
  console.log(textFieldVal);
  return (
    <>
      <TextField
        id="outlined-controlled"
        label={label}
        type="text"
        value={textFieldVal}
        onChange={(event) => {
          setTextFieldVal(event.target.value);
        }}
        sx={{ width: width }}
      ></TextField>
    </>
  );
};

export default index;

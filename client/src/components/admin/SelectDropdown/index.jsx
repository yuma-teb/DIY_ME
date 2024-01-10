import React from 'react';
import { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const index = () => {
  //for Select dropdown
  const [SelectVal, setSelectVal] = useState('');

  const handleSelectChange = (event) => {
    setSelectVal(event.target.value);
  };
  return (
    <>
      <FormControl fullwidth variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={SelectVal}
          onChange={handleSelectChange}
          label="Select"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Option1</MenuItem>
          <MenuItem value={20}>Option2</MenuItem>
          <MenuItem value={30}>Option3</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default index;

import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';

export default function CenteredTabs() {
  const [value, setValue] = useState(0);

  const seclected = {
    backgroundColor: 'red',
  };
  const notSeclected = {
    backgroundColor: 'yellow',
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  function handleClick() {
    console.log(value);
    setValue((prevState) => prevState + 1);
  }

  console.log(value);

  return (

    <>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="My Post" sx={{ width: '50%' }} />
        <Tab variant="filled" label="All Post" sx={{ width: '50%' }} />
      </Tabs>
    </>
  );
}

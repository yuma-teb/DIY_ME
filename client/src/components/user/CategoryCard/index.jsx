import React from 'react';
import { Typography, Grid } from '@mui/material';

const Index = ({ name, img }) => {
  const textSpace = {
    margin: '0 0 8px 0',
    letterSpacing: '0.3px',
  };
  return (
    <>
      <Grid item xs={6}>
        <div className="category-card">
          <img src={img} alt="" className="category-image" />
          <Typography typography={'text'} textAlign={'center'} style={textSpace}>
            {name}
          </Typography>
        </div>
      </Grid>
    </>
  );
};

export default Index;

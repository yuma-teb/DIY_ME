import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const Index = ({link, image, title, description}) => {
  return (
    <>
    <a href={link} style={{ textDecoration: 'none' }}>
      <Card sx={{ height: '300px', padding: '16px' }}>
        <img
          src={image}
          alt=""
          className="idea-card-img"
        />
        <Typography
          typography={'section'}
          sx={{ margin: '12px 0', letterSpacing: '0.3px' }}
        >
          {title}
        </Typography>
        <Typography
          typography={'text'}
          sx={{
            margin: '0 0 8px 0 ',
            letterSpacing: '0.3px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            color: '#808080'
          }}
        >
          {description}
        </Typography>
        <Typography typography={'text'} textAlign={'right'} color={'#18BDA9'}>
        Recommended
            </Typography>
      </Card>
      </a>
    </>
  );
};

export default Index;

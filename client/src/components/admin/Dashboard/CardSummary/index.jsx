import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import '../../../.././index.css';

export default function CardStatistic({ title, value, icon }) {
  const cardStyle = {
    width: 280,
    height: 150,
  };
  return (
    <div className="d-flex j-spacebtw itemcenter">
      <Card style={cardStyle}>
        <CardContent>
          <div className="d-flex flex-col">
            <Typography variant="h2" component="div" className="selfcenter">
              {title}
            </Typography>
            {icon &&
              React.cloneElement(icon, {
                sx: { width: '48px', height: '48px' },
                color: 'primary',
                className: 'selfcenter',
              })}
            <Typography variant="h1" component="div" className="selfcenter">
              {value}
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

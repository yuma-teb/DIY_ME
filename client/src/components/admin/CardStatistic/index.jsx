import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import '../../../index.css';

const Index = (props) => {
  const IconComponent = props.icon;
  const iconStyle = {
    width: '48px',
    height: '48px',
    alignSelf: 'center',
  };
  return (
    <>
      <Card className="d-flex j-spacebtw">
        <CardContent>
          <div className="d-flex flex-col">
            <Typography variant="h2" component="div" className="self-right">
              {props.cardTitle}
            </Typography>
            <IconComponent style={iconStyle} />
            <Typography variant="h1" component="div" className="selfcenter">
              {props.displayData}
            </Typography>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Index;

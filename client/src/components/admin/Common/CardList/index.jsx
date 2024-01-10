import React from 'react';
import { Paper, Typography, ListItem, ListItemIcon, ListItemText } from '@mui/material';

const Index = (props) => {
  return (
    <div>
      {/* <Paper className="d-flex flex-col" sx={{ borderRadius: '0px' }}> */}
      <ListItem>
        <ListItemIcon>
          {/* Cutomize Icons passed to props */}
          {props.icon}
        </ListItemIcon>
        <ListItemText
          style={props.listItemStyle}
          primary={
            <Typography variant="body1" style={props.primaryStyle}>
              {props.primarytext}
            </Typography>
          }
          secondary={
            <Typography variant="body2" style={props.secondaryStyle}>
              {props.secondarytext}
            </Typography>
          }
        />
      </ListItem>
      {/* </Paper> */}
    </div>
  );
};

export default Index;
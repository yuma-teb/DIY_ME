import { Link } from 'react-router-dom';
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import HomeIcon from '@mui/icons-material/Home';

const Header = ({ title, subtitle }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#F7F7F7', marginTop: 3 , boxShadow: 0}}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>

        <IconButton component={Link} to="/admin" color="inherit" aria-label="home">
          <HomeIcon />
        </IconButton>

        <IconButton color="inherit" aria-label="arrow-right">
          <KeyboardArrowRightIcon />
        </IconButton>
        <Typography variant="subtitle1">{subtitle}</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

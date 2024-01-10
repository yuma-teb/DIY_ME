import React from 'react';
import { useState } from 'react';

// component import
import ProductList from './ProductList';
import ProductListByCategory from './ProductListByCategory';
import { Container, Typography, Grid, IconButton, Tabs, Tab, Menu, MenuItem } from '@mui/material';
import '../Homepage/Homepage.css';

// category icon
import BorderAllRoundedIcon from '@mui/icons-material/BorderAllRounded';
import ChairOutlinedIcon from '@mui/icons-material/ChairOutlined';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import KitchenOutlinedIcon from '@mui/icons-material/KitchenOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined';
import YardOutlinedIcon from '@mui/icons-material/YardOutlined';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import CableOutlinedIcon from '@mui/icons-material/CableOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';

const Index = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [sorted, setSorted] = useState('');
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (value) => {
    setSorted(value);
    setAnchorEl(null);
  };

  return (
    <>
      <Typography typography={'section'} sx={{ margin: '88px 0 16px 16px' }}>
        Categories
      </Typography>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
        sx={{ margin: '0 0 0 52px' }}
      >
        <Tab icon={<BorderAllRoundedIcon />} label="All" />
        <Tab icon={<ChairOutlinedIcon />} label="furniture" value={'659ed618577e69c7d04116cb'} />
        <Tab icon={<DiamondOutlinedIcon />} label="jewelry" value={'659ed6bd577e69c7d04116cd'} />
        <Tab icon={<ColorLensOutlinedIcon />} label="Art" value={'659ed733577e69c7d04116cf'} />
        <Tab icon={<KitchenOutlinedIcon />} label="kitchen" value={'659ed77e577e69c7d04116d1'} />
        <Tab icon={<HomeOutlinedIcon />} label="Home Decor" value={'659ed7d8577e69c7d04116d3'} />
        <Tab icon={<BathtubOutlinedIcon />} label="Bathroom" value={'659ed819577e69c7d04116d5'} />
        <Tab icon={<YardOutlinedIcon />} label="gardening" value={'659ed869577e69c7d04116d7'} />
        <Tab
          icon={<DesignServicesOutlinedIcon />}
          label="Stationary"
          value={'659ed8c2577e69c7d04116d9'}
        />
        <Tab icon={<CableOutlinedIcon />} label="electronic" value={'657ab27c0e5d8db499a25de1'} />
        <Tab
          icon={<ExtensionOutlinedIcon />}
          label="Toy and game"
          value={'659ed9bc577e69c7d04116db'}
        />
      </Tabs>

      <Container sx={{ margin: '32px 0 16px 0' }}>
        <Grid container sx={{ margin: '0 0 16px 0' }}>
          <Grid item xs={8} className="selfcenter">
            <Typography typography={'section'}>Products</Typography>
          </Grid>
          <Grid item xs={4}>
            <div className="d-flex button-text">
              <IconButton
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                <FilterListIcon />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem value={'-sold'} onClick={() => handleClose('-sold')}>
                  Popular
                </MenuItem>
                <MenuItem value={'price'} onClick={() => handleClose('price')}>
                  Low to High Price
                </MenuItem>
                <MenuItem value={'-price'} onClick={() => handleClose('-price')}>
                  High to Low Price
                </MenuItem>
              </Menu>
            </div>
          </Grid>
        </Grid>
        {value !== 0 ? (
          <ProductListByCategory categoryId={value} sorted={sorted} />
        ) : (
          <ProductList sorted={sorted} />
        )}
      </Container>
    </>
  );
};

export default Index;

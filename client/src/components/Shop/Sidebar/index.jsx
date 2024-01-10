import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer,
  Divider,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StoreIcon from '@mui/icons-material/Store';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import ReplayIcon from '@mui/icons-material/Replay';
import FlagIcon from '@mui/icons-material/Flag';
import ListIcon from '@mui/icons-material/List';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import BusinessIcon from '@mui/icons-material/Business';
import CategoryIcon from '@mui/icons-material/Category';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const sideBarStyle = { backgroundColor: '#D0B8AC', height: '100vh', width: 300 };
  const hoverStyle = { '&:hover': { backgroundColor: '#F7F7F7' } };
  const subItemStyle = { marginLeft: 7, '&:hover': { backgroundColor: '#F7F7F7' } };

  const handleProductsClick = () => {
    setIsProductsOpen(!isProductsOpen);
  };

  const handleUsersClick = () => {
    setIsUsersOpen(!isUsersOpen);
  };

  return (
    <Drawer anchor="left" open={isSidebarOpen} onClose={toggleSidebar} sx={{ zIndex: 3 }}>
      <div style={sideBarStyle}>
        <List>
          <Typography variant="h6" component="div" sx={{ marginY: 3, textAlign: 'center' }}>
            DIY MATERIAL
          </Typography>
          <Divider />

          <ListItem button sx={hoverStyle} component={Link} to="/shop" onClick={toggleSidebar}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={handleProductsClick} sx={hoverStyle}>
            <ListItemIcon>
              <StoreIcon />
            </ListItemIcon>
            <ListItemText primary="Products" />
            {isProductsOpen ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
          </ListItem>
          <Collapse in={isProductsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                sx={subItemStyle}
                component={Link}
                to="/shop/product"
                onClick={toggleSidebar}
              >
                <ListItemIcon>
                  <ListIcon />
                </ListItemIcon>
                <ListItemText primary="Product Lists" />
              </ListItem>
              <ListItem
                button
                sx={subItemStyle}
                component={Link}
                to="/admin/products/categories"
                onClick={toggleSidebar}
              >
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary="Categories" />
              </ListItem>
              <ListItem
                button
                sx={subItemStyle}
                onClick={toggleSidebar}
                component={Link}
                to="/admin/product-requests"
              >
                <ListItemIcon>
                  <AddBusinessIcon />
                </ListItemIcon>
                <ListItemText primary="Product Requests" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem
            button
            sx={hoverStyle}
            onClick={toggleSidebar}
            component={Link}
            to="/shop/orders"
          >
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>

          <ListItem
            button
            sx={hoverStyle}
            onClick={toggleSidebar}
            component={Link}
            to="/shop/returnrefund"
          >
            <ListItemIcon>
              <ReplayIcon />
            </ListItemIcon>
            <ListItemText primary="Return/Refund" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;

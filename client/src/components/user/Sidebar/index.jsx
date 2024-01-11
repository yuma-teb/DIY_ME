import { Drawer, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import StoreIcon from '@mui/icons-material/Store';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HomeIcon from '@mui/icons-material/Home';
import ForumIcon from '@mui/icons-material/Forum';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import { Logout } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { logOut } from '../../../redux/slices/AuthSlice';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const sideBarStyle = { backgroundColor: '#D0B8AC', height: '100vh', width: 319 };
  const hoverStyle = { '&:hover': { backgroundColor: '#F7F7F7' } };
  const [token, setToken] = useState(localStorage.getItem('token'))
  const dispatch = useDispatch()
  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [localStorage.getItem('token')])
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isSidebarOpen}
      onClose={toggleSidebar}
      sx={{ zIndex: 3 }}
    >
      <div style={sideBarStyle}>
        <CloseIcon
          style={{ position: 'absolute', top: 15, right: 15, cursor: 'pointer' }}
          onClick={toggleSidebar}
        />
        <List sx={{ marginTop: 5 }}>
          <ListItem button sx={hoverStyle} onClick={toggleSidebar} component={Link} to="/">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home Page" />
          </ListItem>

          <ListItem button sx={hoverStyle} onClick={toggleSidebar} component={Link} to="/products">
            <ListItemIcon>
              <StoreIcon />
            </ListItemIcon>
            <ListItemText primary="Product List" />
          </ListItem>

          <Divider variant="middle" />
          <ListItem>
            <ListItemText primary="My Profile" />
          </ListItem>

          <ListItem button sx={hoverStyle} onClick={toggleSidebar} component={Link} to="/user/profile">
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="View Profile" />
          </ListItem>

          <ListItem button sx={hoverStyle} onClick={toggleSidebar}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>

          <Divider variant="middle" />
          <ListItem>
            <ListItemText primary="Community" />
          </ListItem>
          <ListItem button sx={hoverStyle} onClick={toggleSidebar} component={Link} to="/community">
            <ListItemIcon>
              <ForumIcon />
            </ListItemIcon>
            <ListItemText primary="Community" />
          </ListItem>
        </List>
        <Divider variant="middle" />
        {token ?  <ListItem button sx={hoverStyle} onClick={() => dispatch(logOut())}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem> : <ListItem button sx={hoverStyle} onClick={toggleSidebar} component={Link} to="/login">
            <ListItemIcon>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>}

      </div>
    </Drawer>
  );
};

export default Sidebar;

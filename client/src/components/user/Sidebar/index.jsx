import { Drawer, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import StoreIcon from '@mui/icons-material/Store';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HomeIcon from '@mui/icons-material/Home';
import ForumIcon from '@mui/icons-material/Forum';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const sideBarStyle = { backgroundColor: '#D0B8AC', height: '100vh', width: 319 };
  const hoverStyle = { '&:hover': { backgroundColor: '#F7F7F7' } };

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

          <ListItem button sx={hoverStyle} onClick={toggleSidebar}>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="View Profile" />
          </ListItem>

          <ListItem button sx={hoverStyle} onClick={toggleSidebar} component={Link} to="/OrderHistory">
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
      </div>
    </Drawer>
  );
};

export default Sidebar;

import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useDispatch, useSelector } from 'react-redux';
import { logOut, selectCurrentUser } from '../../../../redux/slices/AuthSlice';
import { useNavigate } from 'react-router-dom';
const Navbar = ({
  userName,
  profileMenuAnchor,
  openProfileMenu,
  closeProfileMenu,
  toggleSidebar,
}) => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user')).username;
  console.log('USER', user);
  const navigate = useNavigate();
  const handleLogOut = () => {
    dispatch(logOut());
    navigate('/login');
  };
  // console.log('dfadfasdfladskfjladfksjasdfklajdsfkljasdf');
  return (
    <AppBar position="static" sx={{ background: 'primary' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>
        <Link
          to="/admin"
          style={{
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            DIY MATERIAL
          </Typography>
        </Link>

        <div style={{ flexGrow: 1 }}></div>

        <div className="d-flex itemcenter">
          <Typography variant="body1" sx={{ margin: 1 }}>
            {user}
          </Typography>
          <Avatar alt="User Avatar" src={localStorage.getItem('img')} sx={{ marginRight: 1 }} />
          <IconButton onClick={openProfileMenu}>
            <ArrowDropDownIcon />
          </IconButton>
          <Menu
            anchorEl={profileMenuAnchor}
            open={Boolean(profileMenuAnchor)}
            onClose={closeProfileMenu}
            sx={{ marginTop: 2 }}
          >
            <MenuItem onClick={closeProfileMenu}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              My Profile
            </MenuItem>

            <MenuItem onClick={handleLogOut}>
              <ListItemIcon>
                <ExitToAppIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

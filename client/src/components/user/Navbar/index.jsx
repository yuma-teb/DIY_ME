import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Navbar = ({ toggleSidebar }) => {
  const cartItemCount = 3;
  return (
    <AppBar position="fixed" sx={{ background: 'primary' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>
        <Link
          to="/"
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
          <Link to={'/products/search'}>
            <IconButton>
              <SearchIcon />
            </IconButton>
          </Link>
          <Link to={'/cart'}>
            <IconButton>
              <Badge badgeContent={cartItemCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

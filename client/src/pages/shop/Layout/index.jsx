import { useState } from 'react';
import { Box } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/admin/Common/Navbar';
import Sidebar from '../../../components/Shop/Sidebar';

const ShopLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openProfileMenu = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const closeProfileMenu = () => {
    navigate(`/admin/profile`);
    setProfileMenuAnchor(null);
  };

  const userName = 'Admin'; // Replace with the user's name

  return (
    <Box width="100%" height="100%">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Box>
        <Navbar
          userName={userName}
          profileMenuAnchor={profileMenuAnchor}
          openProfileMenu={openProfileMenu}
          closeProfileMenu={closeProfileMenu}
          toggleSidebar={toggleSidebar}
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default ShopLayout;

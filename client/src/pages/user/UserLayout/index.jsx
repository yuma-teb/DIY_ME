import { useState } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '../../../components/user/Navbar';
import Sidebar from '../../../components/user/Sidebar';

const UserLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box width="100%" height="100%">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Box>
        <Navbar toggleSidebar={toggleSidebar} />
        <Outlet />
      </Box>
    </Box>
  );
};

export default UserLayout;

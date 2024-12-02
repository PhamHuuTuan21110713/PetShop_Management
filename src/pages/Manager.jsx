
import Box from '@mui/material/Box'
// import Appbar from '../components/Appbar/Appbar'
import Sidebar from '../components/Sidebar/Sidebar'
import { Outlet } from 'react-router-dom';
import Appbar from '../components/Appbar/Appbar';
import { Divider } from '@mui/material';

function Manager() {
  return (
    <Box>
      <Sidebar />
      <Box sx={{ display: "flex" }}>
        <Box sx={{ width: (theme) => theme.customSize.sidebarWidth , minWidth: (theme) => theme.customSize.sidebarWidth, height:"100%"}}></Box>
        <Box sx={{ flex: 1, padding: "10px", maxWidth: (theme) => `calc( 100% - ${theme.customSize.sidebarWidth})` }}>
          <Appbar />
      
          <Box sx={{marginTop:(theme) => theme.customSize.headerHeight,
              overflowX:"auto"}}>
            <Outlet />
          </Box>
        </Box>
      </Box>

    </Box>
  )
}

export default Manager

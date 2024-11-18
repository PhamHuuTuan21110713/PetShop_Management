
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
        <Box sx={{ width: (theme) => theme.customSize.sidebarWidth }}></Box>
        <Box sx={{ flex:1, padding:"10px"}}>
          <Appbar />
          <Divider sx={{marginY:"10px"}}/>
          <Outlet />
        </Box>
      </Box>

    </Box>
  )
}

export default Manager

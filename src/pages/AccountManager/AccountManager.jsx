import myStyle from "./AccountManager.module.scss";

import { Box, Typography } from "@mui/material"
import { NavLink, Outlet } from "react-router-dom";
const styleNavlink = ({ isActive }) => {
    return {
        backgroundColor: isActive ? "#346791" : null,
        color: isActive ? "#fff" : null
    } 
}
const AccountManager = () => {
    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1 }}>
                <NavLink style={styleNavlink} to="danh-sach" className={myStyle.tabContainer}>
                    <Typography>Danh sách</Typography>
                </NavLink>
                <NavLink style={styleNavlink} to="them-moi" className={myStyle.tabContainer}>
                    <Typography>Thêm mới</Typography>
                </NavLink>
            </Box>
            <Box sx={{border:"solid 1px #ebebeb", marginTop:"4px", padding:"20px", maxHeight:"557px", overflowY:"auto"}}>
                <Outlet />
            </Box>
        </Box>
    )
}

export default AccountManager
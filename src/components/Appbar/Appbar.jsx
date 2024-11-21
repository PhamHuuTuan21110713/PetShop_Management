import myStyle from "./Appbar.module.scss";
import { useState, useRef } from "react";

import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { Avatar, Typography } from "@mui/material";
import Box from "@mui/material/Box"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChatIcon from '@mui/icons-material/Chat';
import { NavLink } from "react-router-dom/dist";
import ModeSelect from "../ModeSelect/ModeSelect";
const classNameNav = ({ isActive }) => {
    return (isActive ? "active-link" : "inactive-link")
}
const Appbar = () => {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }
    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    return (
        <Box sx={{ height: (theme) => theme.customSize.headerHeight }} className={myStyle.appbarContainer}>
            {/* left part */}
            <Box>
                <Typography variant="h6" sx={{fontWeight:"bold"}}>Trang chủ</Typography>
            </Box>
            {/* right part */}
            <Box sx={{display:"flex", alignItems:"center", gap: 3}}>
                {/* Chat */}
                <Box 
                sx={{display:"flex", justifyContent:"center", alignItems:"center", cursor:"pointer",
                    backgroundColor:"#c0bcc0", borderRadius:"50%", height:"40px", width:"40px"}}
                >
                    <ChatIcon sx={{color:"#fff"}}/>
                </Box>
 
                {/* Avatar */}
                <Box >
                    <Box
                        ref={anchorRef}
                        id="composition-button"
                        aria-controls={open ? 'composition-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                        sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
                    >
                        <Avatar />
                        <Box>
                            <Typography sx={{ fontWeight: "bold", color: "#000" }}>Phạm Hữu Tuấn</Typography>
                        </Box>
                        <KeyboardArrowDownIcon />
                    </Box>
                    <Popper
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        placement="bottom-end"
                        transition
                        disablePortal
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                        placement === 'bottom-start' ? 'left top' : 'left bottom',
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList
                                            autoFocusItem={open}
                                            id="composition-menu"
                                            aria-labelledby="composition-button"
                                            onKeyDown={handleListKeyDown}
                                        >
                                            <MenuItem>
                                                <NavLink style={{ width: "100%", height: "100%", textDecoration: "none", color: "#000", }} onClick={handleClose}>
                                                    Tài khoản
                                                </NavLink>
                                            </MenuItem>
                                            <MenuItem>
                                                <NavLink style={{ width: "100%", height: "100%", textDecoration: "none", color: "#000", }} onClick={handleClose}>
                                                    Đăng xuất
                                                </NavLink>
                                            </MenuItem>
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Box>
                <ModeSelect/>
            </Box>
        </Box>
    )
}

export default Appbar;
import myStyle from "./Appbar.module.scss";
import { useState, useContext, useEffect } from "react";

// import Grow from '@mui/material/Grow';
// import Paper from '@mui/material/Paper';
// import Popper from '@mui/material/Popper';
// import MenuItem from '@mui/material/MenuItem';
// import MenuList from '@mui/material/MenuList';
// import ClickAwayListener from '@mui/material/ClickAwayListener';
import { Avatar, Button, Typography } from "@mui/material";
import Box from "@mui/material/Box"
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChatIcon from '@mui/icons-material/Chat';
import { Link, NavLink } from "react-router-dom/dist";
// import ModeSelect from "../ModeSelect/ModeSelect";
import { useAuth } from "../Authentication/authentication";
import { ChatContext } from "~/pages/ChatProvider/ChatProvider";
import { AuthenFetch, NotifyFetch } from "~/REST_API_Client";
import Notify from "./Notify";
// const classNameNav = ({ isActive }) => {
//     return (isActive ? "active-link" : "inactive-link")
// }
const Appbar = () => {

    console.log("re-render appbar")
    // const [open, setOpen] = useState(false);
    // const anchorRef = useRef(null);
    const auth = useAuth();
    const { unReadNotifications, updateUnreadNotifications } = useContext(ChatContext);
    const [chatCount, setChatCount] = useState(0)
    useEffect(() => {
        const fetchUnreadMessage = () => {
            if (!auth.user) return
            NotifyFetch.getNotify({ receiverId: auth.user._id, isReading: false, type: "message" })
                .then(data => {
                    // console.log("unread message: ", data)
                    if (data.data.length > 0) {
                        setChatCount(data.data.length);
                        updateUnreadNotifications([...unReadNotifications, ...data.data])
                    }

                })
                .catch(err => {
                    console.log("err get unread message: ", err);
                })
        }
        fetchUnreadMessage();
    }, [])

   
    useEffect(() => {
        const unreadNotifications = unReadNotifications.length;
        setChatCount(unreadNotifications);
    }, [unReadNotifications])
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    // function handleListKeyDown(event) {
    //     if (event.key === 'Tab') {
    //         event.preventDefault();
    //         setOpen(false);
    //     } else if (event.key === 'Escape') {
    //         setOpen(false);
    //     }
    // }
    // const handleClose = (event) => {
    //     if (anchorRef.current && anchorRef.current.contains(event.target)) {
    //         return;
    //     }

    //     setOpen(false);
    // };
    const handleCloseLogout = (event) => {
        localStorage.removeItem("access_token");
        AuthenFetch.logout()
            .then(data => {
                console.log(data)
                auth.authenUser(null);
            })
            .catch(err => {
                console.log("err: ", err);
            })
    }
    return (
        <Box
            sx={{
                height: (theme) => theme.customSize.headerHeight,
                width: (theme) => `calc( 100% - ${theme.customSize.sidebarWidth})`,
                padding: "10px"
            }}
            className={myStyle.appbarContainer}
        >
            {/* left part */}
            <Box>
                {/* <Typography variant="h6" sx={{ fontWeight: "bold" }}>Trang chủ</Typography> */}
            </Box>
            {/* right part */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>

                <Link to={"/thong-bao"}>
                    <Notify />
                </Link>
                {/* Chat */}
                <Link to="/chat">
                    <Box
                        sx={{
                            display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer",
                            backgroundColor: "#c0bcc0", borderRadius: "50%", height: "40px", width: "40px", position: "relative"
                        }}
                    >
                        <ChatIcon sx={{ color: "#fff" }} />
                        {
                            chatCount !== 0 ?
                                (
                                    <Box sx={{
                                        width: "20px", height: "20px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center",
                                        backgroundColor: "#de5945", position: "absolute", right: "-6px", top: "-6px"
                                    }}>
                                        <Typography sx={{ color: "#fff", fontSize: "0.6rem" }}>{chatCount}</Typography>
                                    </Box>
                                ) : null
                        }

                    </Box>
                </Link>

                {/* Avatar */}
                <Box >
                    <Box
                        // ref={anchorRef}
                        // id="composition-button"
                        // aria-controls={open ? 'composition-menu' : undefined}
                        // aria-expanded={open ? 'true' : undefined}
                        // aria-haspopup="true"
                        // onClick={handleToggle}
                        sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
                    >
                        {/* <Avatar src={`${auth.user.avatar.preview}`} /> */}
                        <Avatar />
                        <Box>
                            <Typography sx={{ fontWeight: "bold", color: "#000" }}>
                                {auth.user.name}
                            </Typography>
                        </Box>
                        {/* <KeyboardArrowDownIcon /> */}
                    </Box>
                    {/* <Popper
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
                    </Popper> */}
                </Box>

                {/* Logout */}
                <NavLink to={"/dang-nhap"}>
                    <Button onClick={handleCloseLogout} variant="contained" sx={{textTransform:"none"}}>Đăng xuất</Button>
                </NavLink>
                {/* <ModeSelect /> */}
            </Box>
        </Box>
    )
}

export default Appbar;
import myStyle from "./Sidebar.module.scss";
import { NavLink } from "react-router-dom";
import PetsIcon from '@mui/icons-material/Pets';
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HomeIcon from '@mui/icons-material/Home';
import SmsIcon from '@mui/icons-material/Sms';
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import MovingIcon from '@mui/icons-material/Moving';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import CategoryIcon from '@mui/icons-material/Category';

const Sidebar = () => {
    return (
        <Box sx={{width: (theme) => theme.customSize.sidebarWidth}} className={myStyle.sidebarContainer}>
            <Box
                sx={{ paddingBottom: "20px", overflow: "hidden", borderRadius: "8px", width: "100%", height: "100%", backgroundColor: "#f2f2f2", boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;" }}
            >
                {/* Logo part */}
                <Box sx={{ padding: '10px' }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <PetsIcon sx={{ color: "#de5945", fontSize: "2.5rem" }} />
                        <Typography sx={{ fontWeight: "bold", fontSize: "2.2rem" }}>BetShob</Typography>
                    </Box>
                </Box>
                <Divider sx={{ marginY: "10px" }} />
                <Box sx={{ marginTop: '10px', maxHeight: "calc( 100% - 70px)", overflowY: "auto", padding: "10px" }}>
                    <Box >
                        {/* Dasboard */}
                        <Box>
                            <Typography sx={{ fontSize: "1.2rem", textTransform: "uppercase", fontWeight: "bold", color: "#6e6d6d" }}>
                                Tổng quan
                            </Typography>
                            <Box className={myStyle.menuContainer}>
                                <NavLink className={myStyle.menuItem}>
                                    <Typography sx={{ color: "#6e6d6d", fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
                                        <HomeIcon />Trang chủ
                                    </Typography>
                                </NavLink>
                                <NavLink className={myStyle.menuItem}>
                                    <Typography sx={{ color: "#6e6d6d", fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
                                        <CalendarMonthIcon />Lịch đặt
                                    </Typography>
                                </NavLink>
                                <NavLink className={myStyle.menuItem}>
                                    <Typography sx={{ color: "#6e6d6d", fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
                                        <SmsIcon />Thông báo
                                    </Typography>
                                </NavLink>
                            </Box>
                        </Box>
                        <Divider sx={{ marginY: '20px' }} />
                        {/* Managerment */}
                        <Box>
                            <Typography sx={{ fontSize: "1.2rem", textTransform: "uppercase", fontWeight: "bold", color: "#6e6d6d" }}>
                                Quản lý
                            </Typography>
                            <Box className={myStyle.menuContainer}>
                                <NavLink className={myStyle.menuItem}>
                                    <Typography sx={{ color: "#6e6d6d", fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
                                        <PersonIcon />Tài khoản
                                    </Typography>
                                </NavLink>
                                <NavLink className={myStyle.menuItem}>
                                    <Typography sx={{ color: "#6e6d6d", fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
                                        <InventoryIcon />Sản phẩm
                                    </Typography>
                                </NavLink>
                                <NavLink className={myStyle.menuItem}>
                                    <Typography sx={{ color: "#6e6d6d", fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
                                        <ViewQuiltIcon />Đơn hàng
                                    </Typography>
                                </NavLink>
                                <NavLink className={myStyle.menuItem}>
                                    <Typography sx={{ color: "#6e6d6d", fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
                                        <LoyaltyIcon />Khuyến mãi
                                    </Typography>
                                </NavLink>
                                <NavLink className={myStyle.menuItem}>
                                    <Typography sx={{ color: "#6e6d6d", fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
                                        <RoomServiceIcon />Dịch vụ
                                    </Typography>
                                </NavLink>
                                <NavLink className={myStyle.menuItem}>
                                    <Typography sx={{ color: "#6e6d6d", fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
                                        <CategoryIcon />Danh mục
                                    </Typography>
                                </NavLink>
                            </Box>
                        </Box>
                        <Divider sx={{ marginY: '20px' }} />

                        {/* Thống kê */}
                        <Box>
                            <Typography sx={{ fontSize: "1.2rem", textTransform: "uppercase", fontWeight: "bold", color: "#6e6d6d" }}>
                                Thống kê
                            </Typography>
                            <Box className={myStyle.menuContainer}>
                                <NavLink className={myStyle.menuItem}>
                                    <Typography sx={{ color: "#6e6d6d", fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
                                        <MovingIcon />Doanh thu
                                    </Typography>
                                </NavLink>
                                <NavLink className={myStyle.menuItem}>
                                    <Typography sx={{ color: "#6e6d6d", fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
                                        <InventoryIcon />Sản phẩm
                                    </Typography>
                                </NavLink>
                                <NavLink className={myStyle.menuItem}>
                                    <Typography sx={{ color: "#6e6d6d", fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
                                        <PersonIcon />Tài khoản
                                    </Typography>
                                </NavLink>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Sidebar;
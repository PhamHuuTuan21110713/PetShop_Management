import { Box, Divider, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import myStyle from "./CommonNoitice.module.scss";
import { useEffect, useState } from "react";
import { BookingFetch } from "~/REST_API_Client";
const CommonNoitice = () => {
    const [countBooking, setCountBooking] = useState(0);
    useEffect(() => {
        const condition = {
            status: "dang-xac-nhan"
        }
        BookingFetch.getAll(undefined,condition, undefined)
            .then(data => {
                // console.log("list booking", data);
                setCountBooking(data.data.length)
            })
            .catch(err => {
                window.alert(`Lỗi lấy thông tin lịch dịch vụ \n${err}`);
            })
    },[])
    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>Thông báo chung</Typography>
            <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "auto" }}>
                <Box sx={{ display: "flex", gap: 3, padding: "20px" }}>
                    {/* Don dich vu */}
                    <NavLink className={myStyle.noticeItemContainer}>
                        <Box >
                            <Typography sx={{ fontSize: "1.1rem", fontWeight: "bold", textAlign: "center" }}>Lịch hẹn dịch vụ</Typography>
                            <Divider sx={{ marginY: "4px" }} />
                            <Typography>Bạn có <span style={{ color: "#de5945", fontWeight: "600" }}>{countBooking}</span> lịch chờ xác nhận</Typography>
                        </Box>
                    </NavLink>
                    {/* Tin nhắn */}
                    <NavLink className={myStyle.noticeItemContainer}>
                        <Box >
                            <Typography sx={{ fontSize: "1.1rem", fontWeight: "bold", textAlign: "center" }}>Tin nhắn mới</Typography>
                            <Divider sx={{ marginY: "4px" }} />
                            <Typography><span style={{ color: "#de5945", fontWeight: "600" }}>15 </span>tin nhắn chờ phản hồi</Typography>
                        </Box>
                    </NavLink>
                    {/* đơn hàng */}
                    <NavLink className={myStyle.noticeItemContainer}>
                        <Box >
                            <Typography sx={{ fontSize: "1.1rem", fontWeight: "bold", textAlign: "center" }}>Đơn hàng</Typography>
                            <Divider sx={{ marginY: "4px" }} />
                            <Typography><span style={{ color: "#de5945", fontWeight: "600" }}>15 </span>Đơn hàng cần chờ xác nhận</Typography>
                        </Box>
                    </NavLink>
                    {/* Sản phẩm hết hàng */}
                    <NavLink className={myStyle.noticeItemContainer}>
                        <Box >
                            <Typography sx={{ fontSize: "1.1rem", fontWeight: "bold", textAlign: "center" }}>Sản phẩm</Typography>
                            <Divider sx={{ marginY: "4px" }} />
                            <Typography><span style={{ color: "#de5945", fontWeight: "600" }}>15 </span>Sản phẩm sắp hết hàng</Typography>
                        </Box>
                    </NavLink>
                </Box>
            </Box>
        </Box>
    )
}

export default CommonNoitice;
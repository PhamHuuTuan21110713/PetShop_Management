import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "~/components/Authentication/Authentication";
import { NotifyFetch } from "~/REST_API_Client";
import { ChatContext } from "../ChatProvider/ChatProvider";
const Notify = () => {
    const auth = useAuth();
    const [bookingNotifys, setBookingNotifys] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [typeReading, setTypeReading] = useState("false");
    const { unreadBookingNotifies, setUnreadBookingNotifyes } = useContext(ChatContext);
    const fetchNotify = () => {
        if (!auth.user) return
        setIsLoading(true);
        let isReading;
        if (typeReading === "all") {
            isReading = undefined
        } else if (typeReading === "true") {
            isReading = true;
        } else if (typeReading === "false") {
            isReading = false;
        }
        NotifyFetch.getNotify({
            receiverId: auth.user._id,
            type: "booking",
            isReading
        })
            .then(data => {
                console.log("getdata: ", data);
                setBookingNotifys(data.data)
                setIsLoading(false)
            })
            .catch(err => {
                console.log("loi", err)
                setIsLoading(false)
            })
    }
    useEffect(() => {
        fetchNotify()
    }, [auth.user, typeReading])

    const handleChangeFilter = (type) => {
        setTypeReading(type);
    }

    const handleUpdateRead = (notId) => {
        NotifyFetch.updateNotify(notId, {
            isReading: true
        }).then(data => {
            fetchNotify()
            const anotherUnreadBookings = unreadBookingNotifies.filter((noti) => noti._id !== notId);
            setUnreadBookingNotifyes(anotherUnreadBookings);
        }).catch(err => {
            toast.error(`Lỗi cập nhật thông báo \n${err}`)
        })
    }
    const handleDeleteBookingNoti = (notId) => {
        NotifyFetch.deleteNotify(notId).then(data => {
            fetchNotify()
            const anotherUnreadBookings = unreadBookingNotifies.filter((noti) => noti._id !== notId);
            setUnreadBookingNotifyes(anotherUnreadBookings);
        }).catch(err => {
            toast.error(`Lỗi cập nhật thông báo \n${err}`)
        })
    }
    return (
        auth.user &&
        <Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box sx={{ width: "900px" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography sx={{ fontSize: "1.2rem", fontWeight: 'bold', textAlign: "center" }}>Thông báo từ hệ thống</Typography>
                       
                    </Box>

                    <Box sx={{ marginTop: "20px", display: "flex", gap: 2 }}>
                        <Button onClick={() => handleChangeFilter("all")} variant={typeReading === "all" ? "contained" : "text"} sx={{ textTransform: "none" }}>Tất cả</Button>
                        <Button onClick={() => handleChangeFilter("false")} variant={typeReading === "false" ? "contained" : "text"} sx={{ textTransform: "none" }}>Chưa đọc</Button>
                        <Button onClick={() => handleChangeFilter("true")} variant={typeReading === "true" ? "contained" : "text"} sx={{ textTransform: "none" }}>Đã đọc</Button>
                    </Box>

                    {/* Lặp */}
                    {
                        !isLoading ?
                            (
                                bookingNotifys &&
                                (
                                    bookingNotifys.length === 0 ?
                                        (
                                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>Không có thông báo mới</Typography>
                                            </Box>
                                        ) :
                                        (
                                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: "10px" }}>
                                                {
                                                    bookingNotifys.map((not, index) => {
                                                        return (
                                                            <Box key={not._id} sx={{
                                                                padding: "20px", display: "flex", justifyContent: "space-between",
                                                                boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;",
                                                                backgroundColor: not.isReading ? "#fff" : "#f09cb8"
                                                            }}>
                                                                <Box>
                                                                    <Typography>{not.text}</Typography>
                                                                    <Typography>Mã đơn: <Link to={`/lich-dat/${not.targetId}`}>{not.targetId}</Link></Typography>
                                                                    <Typography>Ngày gửi: {new Date(not.createdAt).toLocaleDateString("vi-VN")}</Typography>
                                                                </Box>
                                                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                                                    {
                                                                        !not.isReading && <Typography onClick={() => handleUpdateRead(not._id)} sx={{ textDecoration: "underline", userSelect: "none", cursor: "pointer" }}>Đánh dấu đã đọc</Typography>
                                                                    }
                                                                    <Button onClick={() => handleDeleteBookingNoti(not._id)} variant="contained" sx={{ textTransform: "none", height: "40px" }}>Xóa</Button>
                                                                </Box>

                                                            </Box>
                                                        )
                                                    })
                                                }

                                            </Box>
                                        )
                                )

                            ) :
                            (
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <CircularProgress />
                                </Box>
                            )
                    }

                </Box>
            </Box>
            <ToastContainer />
        </Box>
    )
}

export default Notify;
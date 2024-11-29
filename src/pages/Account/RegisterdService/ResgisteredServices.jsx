import { Box, Typography, Divider, Button, CircularProgress } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import myStyle from '../Account.module.scss';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useEffect, useState, useRef } from "react";
import RegisterdBookingChart from "./Chart";
import { BookingFetch } from "~/REST_API_Client";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const ResgisteredServices = ({ userId }) => {
    const [bookings, setBookings] = useState();
    const [filter, setFilter] = useState("all");
    const [find, setFind] = useState("");
    const [yearList, setYearList] = useState("");
    const [yearTK, setYearTK] = useState("");
    const originalOrders = useRef();
    const fetchData = (myFilter, myFind) => {
        let condition;
        if (yearList !== "") {
            const year = parseInt(yearList); // Hoặc lấy từ đầu vào người dùng
            condition = {
                year: year
            }
        }
        if (myFilter === "all") {
            condition = { ...condition }
        } else if (myFilter === "dang-xac-nhan") {
            condition = { ...condition, status: "dang-xac-nhan" }
        } else if (myFilter === "da-xac-nhan") {
            condition = { ...condition, status: "da-xac-nhan" }
        } else if (myFilter === "hoan-thanh") {
            condition = { ...condition, status: "hoan-thanh" }
        } else if (myFilter === "da-huy") {
            condition = { ...condition, status: "da-huy" }
        } else {
           toast.error("Bộ lọc không hợp lệ hoặc không còn hỗ trợ");
        }

        BookingFetch.getAll(userId, condition, myFind, undefined,undefined,undefined)
            .then(data => {
                if(bookings == null) {
                    originalOrders.current = data.data;
                }
                // console.log("bookings: ", data.data);
                setBookings(data.data);
            })
            .catch(err => {
                toast.error(`Lỗi lấy dữ liệu lịch đặt \n${err}`);

            })
    }
    const handleFindYearList = () => {
        fetchData(filter, find);
        setYearTK(yearList);
    }
    const handleSearch = () => {
        fetchData(filter, find);
    }
    useEffect(() => {
        fetchData(filter, find);
    }, [filter])
    // console.log("original: ", originalOrders.current);
    return (
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {/* Đơn hàng đã mua */}
            <Box className={myStyle.colLeftOrders}>
                <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "10px", borderRadius: "8px" }}>
                    <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem", textAlign: "center" }}>Lịch dịch vụ</Typography>
                    {/* TIM KIEM */}
                    <Box sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                        <Box sx={{
                            display: "flex", alignItems: "center", border: "solid 1px #000", width: "400px",
                            gap: "2px", borderRadius: "20px", overflow: "hidden"
                        }}>
                            <input value={find} onChange={(e) => setFind(e.target.value)} className={myStyle.searchInput} placeholder="Tìm kiếm" type="text" />
                            <button onClick={handleSearch} className={myStyle.searchButton}><SearchIcon /></button>
                        </Box>
                    </Box>
                    {/* lỌC THEO TRẠNG THÁI */}
                    <Box>
                        <Typography sx={{ fontWeight: "bold" }}>Lọc theo trạng thái: </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            <Button variant={filter === "all" ? "contained" : "outlined"} onClick={() => setFilter("all")}>Tất cả</Button>
                            <Button variant={filter === "dang-xac-nhan" ? "contained" : "outlined"} onClick={() => setFilter("dang-xac-nhan")}>Đang xử lý</Button>
                            <Button variant={filter === "da-xac-nhan" ? "contained" : "outlined"} onClick={() => setFilter("da-xac-nhan")}>Đã xác nhận</Button>
                            <Button variant={filter === "hoan-thanh" ? "contained" : "outlined"} onClick={() => setFilter("hoan-thanh")}>Hoàn thành</Button>
                            <Button variant={filter === "da-huy" ? "contained" : "outlined"} onClick={() => setFilter("da-huy")}>Đã hủy</Button>
                        </Box>
                    </Box>
                    {/* NĂM */}
                    <Box sx={{ marginTop: "10px" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                            <Typography sx={{ fontWeight: "bold" }}>Lọc theo năm: </Typography>
                            <input value={yearList} onChange={(e) => setYearList(e.target.value)} type="text" style={{ height: "30px" }} />
                            <Button onClick={handleFindYearList} variant="contained"><FilterListIcon /></Button>
                        </Box>
                    </Box>
                    {/* Danh sacsh don dich vu*/}
                    <Box sx={{ marginTop: "20px", maxHeight: "500px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
                        {/* Dich vu items */}
                        {

                            bookings && bookings.map((booking, index) => {
                                return (
                                    <Box key={index} sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "10px", borderRadius: "4px" }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Box sx={{ display: "flex", gap: 1 }}>
                                                <Typography>#{booking._id}</Typography>
                                                <Divider orientation="vertical" flexItem />
                                                <Typography sx={{ fontWeight: "bold", color: "#48b083" }}>
                                                    {
                                                        booking?.status === "dang-xac-nhan" ? "Cần xác nhận" : (booking?.status === "da-xac-nhan" ? "Đã xác nhận" : (booking?.status === "hoan-thanh" ? "Thành công" : "Đã hủy"))
                                                    }
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography>Ngày lên lịch: {new Date(booking.createdAt).toLocaleDateString("vi-VN")}</Typography>
                                            </Box>
                                        </Box>
                                        {/* dANH Sach san pham */}
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                            <Typography><strong>Dịch vụ:</strong> {booking.serviceDetails.name}</Typography>
                                            <Typography><strong>Ngày thực hiện:</strong> {new Date(booking.bookingDate).toLocaleDateString("vi-VN")}</Typography>
                                            <Typography><strong>Thời gian:</strong> {booking.bookingTime}</Typography>
                                            <Typography><strong>Cân nặng thú cưng:</strong> {booking.petWeight}kg</Typography>
                                            <Typography><strong>Chi tiết thú cưng:</strong> {booking.detailPet}</Typography>
                                            <Typography><strong>Ghi chú:</strong> {booking.note}</Typography>
                                            <Typography><strong>Chi nhánh:</strong> {booking.address}</Typography>
                                        </Box>
                                        {/* Gias tri don hang */}
                                        <Box sx={{ marginTop: "12px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                                            <Typography ><strong>Tổng giá trị:</strong> <span style={{ color: "#de5945" }}>{booking.totalPrice}đ</span></Typography>
                                        </Box>
                                    </Box>
                                )
                            })

                        }
                    </Box>
                </Box>
            </Box>
            {/* Thống kê */}
            {
                originalOrders.current ?
                    (
                        <Box className={myStyle.colRightOrders}>
                            <RegisterdBookingChart orders={originalOrders.current} year={yearTK} />
                        </Box>
                    ) :
                    (
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <CircularProgress />
                        </Box>
                    )
            }
            <ToastContainer />
        </Box>
    )
}

export default ResgisteredServices;
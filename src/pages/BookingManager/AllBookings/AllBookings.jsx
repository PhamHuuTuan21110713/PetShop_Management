import { Box, Button, Pagination, Tooltip, Typography, CircularProgress, Chip, Divider } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import myStyle from './AllBookings.module.scss';
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { BookingFetch } from "~/REST_API_Client";
import FilterListIcon from '@mui/icons-material/FilterList';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { ChatContext } from "~/pages/ChatProvider/ChatProvider";
import { useAuth } from "~/components/Authentication/authentication";
const AllBooking = () => {
    const [sort, setSort] = useState("down");
    const auth = useAuth();
    const [bookings, setBookings] = useState();
    const [filter, setFilter] = useState("dang-xac-nhan");
    const [yearList, setYearList] = useState("");
    const [find, setFind] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const { sendBookingNotify } = useContext(ChatContext);
    const fetchData = (myFilter, myFind, myPage) => {
        let condition;
        let sorting;
        if (yearList !== "") {
            const year = parseInt(yearList); // Hoặc lấy từ đầu vào người dùng
            condition = {
                year: year
            }
        }

        if (sort === "down") {
            sorting = {
                bookingDate: -1
            }
        } else if (sort === "up") {
            sorting = {
                bookingDate: 1
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
        const limit = 8;
        const page = myPage;
        setCurrentPage(myPage);
        setIsLoading(true);
        BookingFetch.getAll(undefined, condition, myFind, sorting, page, limit)
            .then(data => {
                // console.log("bookings: ", data)
                setBookings(data.data);
                setTotalPages(data.totalPages);
                setIsLoading(false)
            })
            .catch(err => {
                toast.error(`Lỗi lấy dữ liệu lịch đặt \n${err}`);
                setIsLoading(false)
            })
    }
    const handleSearch = () => {
        fetchData(filter, find, 1);

    }
    const handleFindYearList = () => {
        fetchData(filter, find, 1);

    }
    const handleChangePage = (event, value) => {
        setCurrentPage(value);
        fetchData(filter, find, value)
    }
    const handleUpdateBooking = (id, type, index, userId) => {
        if (type === "xac-nhan") {
            BookingFetch.upDate(id, { status: "da-xac-nhan" })
                .then(data => {
                    console.log("thanh con: ", data)

                    if (filter === "all") {
                        fetchData(filter, find, currentPage)

                    } else if (filter === "dang-xac-nhan") {
                        let _bookings = [...bookings];
                        _bookings.splice(index, 1)
                        setBookings(_bookings);
                    }
                    sendBookingNotify({
                        senderId: auth.user?._id,
                        receiverId: userId,
                        targetId: id,
                        type: "booking",
                        text: "Đơn hàng dịch vụ của bạn đã được xác nhận"
                    })
                })
                .catch(err => {
                    toast.error(`Lỗi cập nhật: \n${err}`)
                })
        } else if (type === "huy") {
            BookingFetch.upDate(id, { status: "da-huy" })
                .then(data => {

                    if (filter === "all") {
                        fetchData(filter, find, currentPage)

                    } else if (filter === "dang-xac-nhan") {
                        let _bookings = [...bookings];
                        _bookings.splice(index, 1)
                        setBookings(_bookings);
                    }
                    sendBookingNotify({
                        senderId: auth.user?._id,
                        receiverId: userId,
                        targetId: id,
                        type: "booking",
                        text: "Đơn hàng dịch vụ của bạn đã bị hủy"
                    })

                })
                .catch(err => {
                    toast.error(`Lỗi cập nhật: \n${err}`)
                })
        }
    }
    useEffect(() => {
        fetchData(filter, find, 1)
    }, [filter, sort])
    return (
        <Box>
            <Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
                    <Box>
                        {/* Tìm kiếm */}
                        <Box sx={{ display: "flex", alignItems: "center", border: "solid 1px #000", width: "400px", gap: "2px", borderRadius: "20px", overflow: "hidden" }}>
                            <input value={find} onChange={(e) => setFind(e.target.value)} className={myStyle.searchInput} placeholder="Tìm kiếm" type="text" />
                            <button onClick={handleSearch} className={myStyle.searchButton}><SearchIcon /></button>
                        </Box>
                    </Box>
                </Box>
                {/* Sắp xếp */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: "15px" }}>
                    <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>Sắp xếp: </Typography>
                    <Button
                        variant={sort === "down" ? "contained" : "text"}
                        sx={{ textTransform: "none" }}
                        onClick={() => setSort("down")}
                    >
                        Ngày thực hiện(gần nhất)
                    </Button>
                    <Button
                        variant={sort === "up" ? "contained" : "text"}
                        sx={{ textTransform: "none" }}
                        onClick={() => setSort("up")}
                    >
                        Ngày thực hiện (xa nhất)
                    </Button>
                </Box>
                {/* Bộ lọc */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: "15px" }}>
                    <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>Bộ lọc: </Typography>
                    <Button
                        variant={filter === "all" ? "contained" : "text"}
                        sx={{ textTransform: "none" }}
                        onClick={() => setFilter("all")}
                    >
                        Tất cả
                    </Button>
                    <Button
                        variant={filter === "dang-xac-nhan" ? "contained" : "text"}
                        sx={{ textTransform: "none" }}
                        onClick={() => setFilter("dang-xac-nhan")}
                    >
                        Cần xác nhận
                    </Button>
                    <Button
                        variant={filter === "da-xac-nhan" ? "contained" : "text"}
                        onClick={() => setFilter("da-xac-nhan")}
                        sx={{ textTransform: "none" }}
                    >
                        Đã xác nhận
                    </Button>
                    <Button
                        onClick={() => setFilter("hoan-thanh")}
                        variant={filter === "hoan-thanh" ? "contained" : "text"}
                        sx={{ textTransform: "none" }}
                    >
                        Đã hoàn thành
                    </Button>
                    <Button
                        variant={filter === "da-huy" ? "contained" : "text"}
                        onClick={() => setFilter("da-huy")}
                        sx={{ textTransform: "none" }}
                    >
                        Đã hủy
                    </Button>
                </Box>
                {/* Locj theo nam */}
                <Box sx={{ marginTop: "15px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                        <Typography sx={{ fontWeight: "bold" }}>Lọc theo năm: </Typography>
                        <input value={yearList} onChange={(e) => setYearList(e.target.value)} placeholder="Ex: 2024" type="text" style={{ height: "30px" }} />
                        <Button onClick={handleFindYearList} variant="contained"><FilterListIcon /></Button>
                    </Box>
                </Box>

                {/* Danh sach lich dat */}
                {
                    isLoading ? (<Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}><CircularProgress /></Box>)
                        :
                        (
                            <Box sx={{ display: "flex", marginTop: "20px", flexWrap: "wrap" }}>
                                {/* Lap ow day */}
                                {
                                    bookings &&
                                    bookings.map((booking, index) => {
                                        return (
                                            <Box key={index} className={myStyle.colBooking} >
                                                <Box sx={{ height: "100%", boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "20px", display: "flex", flexDirection: "column", gap: 1 }}>
                                                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                                        <Typography>Mã đơn: <Link to={`/lich-dat/${booking._id}`}><strong>{booking._id}</strong></Link></Typography>
                                                        <Divider orientation="vertical" flexItem />
                                                        {
                                                            booking.status === "dang-xac-nhan" ? <Typography sx={{ fontWeight: "bold", color: "#de5945" }}>Cần xác nhận</Typography> :
                                                                (booking.status === "da-xac-nhan" ? <Typography sx={{ fontWeight: "bold", color: "#31a24c" }}>Đã xác nhận</Typography> :
                                                                    (booking.status === "hoan-thanh" ? <Typography sx={{ fontWeight: "bold", color: "#31a24c" }}>Hoàn thành</Typography> :
                                                                        booking.status === "da-huy" ? <Typography sx={{ fontWeight: "bold", color: "#606770" }}>Đã hủy</Typography> : null
                                                                    )
                                                                )
                                                        }

                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                                                        <Typography sx={{ fontWeight: "bold" }}>Dịch vụ:</Typography>
                                                        <Typography>{booking.serviceDetails.name}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                                                        <Typography sx={{ fontWeight: "bold" }}>Khách đặt: </Typography>
                                                        <Link to={`/tai-khoan/${booking.userId}`}>{booking.userId}</Link>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                                                        <Typography sx={{ fontWeight: "bold" }}>Chi nhánh: </Typography>
                                                        <Typography>{booking.address}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                                                        <Typography sx={{ fontWeight: "bold" }}>Ngày thực hiện: </Typography>
                                                        <Typography>{new Date(booking.bookingDate).toLocaleDateString('vi-VN')}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                                                        <Typography sx={{ fontWeight: "bold" }}>Thời gian: </Typography>
                                                        <Typography>{booking.bookingTime}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                                                        <Typography sx={{ fontWeight: "bold" }}>Giá trị đơn: </Typography>
                                                        <Typography>{booking.totalPrice.toLocaleString("vi-VN")}đ</Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                                                        <Typography sx={{ fontWeight: "bold" }}>Cân nặng thú cưng: </Typography>
                                                        <Typography>{booking.petWeight}kg</Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                                                        <Typography sx={{ fontWeight: "bold" }}>Chi tiết thú cưng: </Typography>
                                                        <Typography>{booking.detailPet}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                                                        <Typography sx={{ fontWeight: "bold" }}>Ghi chú: </Typography>
                                                        <Typography>{booking.note}</Typography>
                                                    </Box>
                                                    {
                                                        booking.status === "dang-xac-nhan" ? (<Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3 }}>
                                                            <Button onClick={() => handleUpdateBooking(booking._id, "huy", index, booking.userId)} color="secondary" variant="contained" sx={{ textTransform: "none" }}>Hủy đơn</Button>
                                                            <Button onClick={() => handleUpdateBooking(booking._id, "xac-nhan", index, booking.userId)} color="success" variant="contained" sx={{ textTransform: "none" }}>Xác nhận</Button>
                                                        </Box>) : null
                                                    }

                                                </Box>
                                            </Box>
                                        )
                                    })
                                }


                            </Box>
                        )
                }

                <Box sx={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
                    <Pagination count={totalPages} page={currentPage} onChange={handleChangePage} size="small" />
                </Box>

            </Box>
            <ToastContainer />
        </Box>
    )
}

export default AllBooking;
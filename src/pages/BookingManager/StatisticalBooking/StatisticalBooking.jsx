import { Box, Typography, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { LineChart } from '@mui/x-charts/LineChart';
import FilterListIcon from '@mui/icons-material/FilterList';
import { BookingFetch } from "~/REST_API_Client";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const xLabels = [
    'Jan',
    'Feb',
    'March',
    'Apr',
    'May',
    'Jun',
    'Junly',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];
const StatisticalBooking = () => {
    const [yearInput, setYearInput] = useState("");
    const [bookings, setBookings] = useState();
    const [yearTK, setYearTK] = useState("");
    const handleChangeYear = () => {
        setYearTK(yearInput);
    }
    const sumBooking = (bookings, type) => {
        if (type === "all") {
            return bookings.reduce((acu, curr) => {
                return acu += 1
            }, 0)
        } else {
            return bookings.reduce((acu, curr) => {
                if (curr.status === type) {
                    return acu += 1
                }
                return acu
            }, 0)
        }
    }
    const generateAllTypeDataChart = (bookings) => {
        const monthlyCounts = Array(12).fill(0);

        // Duyệt qua dữ liệu và tăng số lượng theo tháng
        bookings.forEach(booking => {
            const bookingDate = new Date(booking.bookingDate);
            const bookingMonth = bookingDate.getMonth(); // Tháng bắt đầu từ 0 (0 = tháng 1, 11 = tháng 12)       
            monthlyCounts[bookingMonth]++;
        });

        // Trả về kết quả dưới dạng mảng với số lượng từng tháng
        return monthlyCounts.map((count, index) => {
            return count
        });
    }
    const generateTypeBookingData = (bookings, type) => {
        const monthlyCounts = Array(12).fill(0);

        // Duyệt qua dữ liệu và tăng số lượng theo tháng
        bookings.forEach(booking => {
            const bookingDate = new Date(booking.bookingDate);
            const bookingMonth = bookingDate.getMonth(); // Tháng bắt đầu từ 0 (0 = tháng 1, 11 = tháng 12)       
            if (booking.status === type) {
                monthlyCounts[bookingMonth]++;
            }
        });

        // Trả về kết quả dưới dạng mảng với số lượng từng tháng
        return monthlyCounts.map((count, index) => {
            return count
        });
    }
    useEffect(() => {

        const qYear = yearTK === "" ? new Date().getFullYear() : yearTK;
        console.log(qYear);
        const condition = {
            year: qYear
        }
        BookingFetch.getAll(undefined, condition, undefined)
            .then(data => {
                console.log("Booking: ", data);
                setBookings(data.data);
            })
            .catch(err => {
                toast.error(`Lỗi lấy dữ liệu đơn dịch vụ: \n${err}`);
            })
    }, [yearTK])
    return (
        <div>

            <Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 3 }}>

                    <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold" }}>Giám sát hoạt động của lịch:</Typography>

                </Box>
                <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold", marginY: "20px" }}>Năm: {yearTK === "" ? new Date().getFullYear() : yearTK}</Typography>

                <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 2, marginTop: "10px" }}>
                    <Typography>Lọc theo năm: </Typography>
                    <Box>
                        <input value={yearInput} onChange={(e) => setYearInput(e.target.value)} placeholder="Ex: 2024" style={{ width: "300px", height: "40px" }} />
                    </Box>
                    <Button onClick={handleChangeYear} variant="contained"><FilterListIcon /></Button>
                </Box>
                {
                    bookings &&
                    <Box sx={{ display: "flex", marginTop: "20px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-around" }}>
                        <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "20px", borderRadius: "4px" }}>
                            <Typography variant="h6" sx={{ textAlign: "center" }}>Tất cả đơn</Typography>
                            <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem", textAlign: "center" }}><span style={{ color: "#de5945" }}>{sumBooking(bookings, "all")}</span> đơn</Typography>
                        </Box>
                        <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "20px", borderRadius: "4px" }}>
                            <Typography variant="h6" sx={{ textAlign: "center" }}>Đơn thành công</Typography>
                            <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem", textAlign: "center" }}><span style={{ color: "#de5945" }}>{sumBooking(bookings, "hoan-thanh")}</span> đơn</Typography>
                        </Box>
                        <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "20px", borderRadius: "4px" }}>
                            <Typography variant="h6" sx={{ textAlign: "center" }}>Cần xác nhận</Typography>
                            <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem", textAlign: "center" }}><span style={{ color: "#de5945" }}>{sumBooking(bookings, "dang-xac-nhan")}</span> đơn</Typography>
                        </Box>
                        <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "20px", borderRadius: "4px" }}>
                            <Typography variant="h6" sx={{ textAlign: "center" }}>Đã xác nhận</Typography>
                            <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem", textAlign: "center" }}><span style={{ color: "#de5945" }}>{sumBooking(bookings, "da-xac-nhan")}</span> đơn</Typography>
                        </Box>
                        <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "20px", borderRadius: "4px" }}>
                            <Typography variant="h6" sx={{ textAlign: "center" }}>Đơn bị hủy</Typography>
                            <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem", textAlign: "center" }}><span style={{ color: "#de5945" }}>{sumBooking(bookings, "da-huy")}</span> đơn</Typography>
                        </Box>
                    </Box>
                }

                {/* Đơn đặt */}
                {
                    bookings && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: "10px" }}>
                            <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "20px" }}>
                                <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold", textAlign: "center" }}>Đơn đặt</Typography>
                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <LineChart
                                        width={700}
                                        height={450}
                                        series={[
                                            { data: generateAllTypeDataChart(bookings), label: 'Đơn đặt' },
                                        ]}
                                        xAxis={[{ scaleType: 'point', data: xLabels }]}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    )
                }

                {/* Đơn thành công */}
                {
                    bookings && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: "10px" }}>
                            <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "20px" }}>
                                <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold", textAlign: "center" }}>Đơn thành công</Typography>
                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <LineChart
                                        width={700}
                                        height={450}
                                        series={[
                                            { data: generateTypeBookingData(bookings, "hoan-thanh"), label: 'Đơn thành công' },
                                        ]}
                                        xAxis={[{ scaleType: 'point', data: xLabels }]}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    )
                }

                {/* Đơn hủy */}
                {
                    bookings && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: "10px" }}>
                            <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "20px" }}>
                                <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold", textAlign: "center" }}>Đơn bị hủy</Typography>
                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <LineChart
                                        width={700}
                                        height={450}
                                        series={[
                                            { data: generateTypeBookingData(bookings, "da-huy"), label: 'Đơn bị hủy' },
                                        ]}
                                        xAxis={[{ scaleType: 'point', data: xLabels }]}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    )
                }
            </Box>
            <ToastContainer />
        </div>
    )
}

export default StatisticalBooking;
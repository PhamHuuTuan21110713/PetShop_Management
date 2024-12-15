import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';  // Import từ @mui/x-charts
import dayjs from 'dayjs';
import { BookingFetch, OrderFetch } from '~/REST_API_Client';

const RevenueReport = () => {
    const currentYear = dayjs().year(); // Lấy năm hiện tại
    const [timeRange, setTimeRange] = useState('month'); // Lựa chọn theo tháng hoặc quý
    const [selectedPeriod, setSelectedPeriod] = useState([]); // Dữ liệu doanh thu theo mốc thời gian
    const [orders, setOrders] = useState([]); // Dữ liệu đơn hàng từ API
    const [bookingData, setBookingData] = useState([]); // Dữ liệu doanh thu từ booking
    const [selectedYear, setSelectedYear] = useState(currentYear); // Năm hiện tại mặc định là năm hiện tại
    const [filters, setFilters] = useState({
        status: 'tc', // Chỉ lấy các đơn hàng có status là 'tc'
        month: "",
        year: currentYear, // Mặc định là năm hiện tại
        orderId: "",
    });
    const [totalOrderRevenue, setTotalOrderRevenue] = useState(0); // Tổng doanh thu sản phẩm
    const [totalBookingRevenue, setTotalBookingRevenue] = useState(0); // Tổng doanh thu dịch vụ

    const calculateRevenue = (orders, bookingData, timeRange, selectedYear) => {
        let groupedData = [];
        let totalOrder = 0;
        let totalBooking = 0;

        // Tạo các mốc thời gian (tháng hoặc quý)
        if (timeRange === 'month') {
            const allMonths = Array.from({ length: 12 }, (_, index) => dayjs().set('year', selectedYear).set('month', index).format('YYYY-MM'));
            allMonths.forEach(month => {
                groupedData.push({ period: month, orderRevenue: 0, bookingRevenue: 0 });
            });

            // Tính doanh thu từ orders
            orders.forEach(order => {
                const orderDate = dayjs(order.orderDate);
                if (orderDate.year() === selectedYear) {
                    const periodKey = orderDate.format('YYYY-MM');
                    const orderRevenue = order.totalPrice || 0;
                    const existingPeriod = groupedData.find(item => item.period === periodKey);
                    if (existingPeriod) {
                        existingPeriod.orderRevenue += orderRevenue;
                        totalOrder += orderRevenue; // Cộng vào tổng doanh thu sản phẩm
                    }
                }
            });

            // Tính doanh thu từ bookingData
            bookingData.forEach(booking => {
                const bookingDate = dayjs(booking.bookingDate);
                if (bookingDate.year() === selectedYear) {
                    const periodKey = bookingDate.format('YYYY-MM');
                    const bookingRevenue = booking.totalPrice || 0;
                    const existingPeriod = groupedData.find(item => item.period === periodKey);
                    if (existingPeriod) {
                        existingPeriod.bookingRevenue += bookingRevenue;
                        totalBooking += bookingRevenue; // Cộng vào tổng doanh thu dịch vụ
                    }
                }
            });

        } else if (timeRange === 'quarter') {
            const allQuarters = ['Q1', 'Q2', 'Q3', 'Q4'];
            allQuarters.forEach(quarter => {
                groupedData.push({ period: quarter, orderRevenue: 0, bookingRevenue: 0 });
            });

            // Tính doanh thu từ orders theo quý
            orders.forEach(order => {
                const orderDate = dayjs(order.orderDate);
                if (orderDate.year() === selectedYear) {
                    const month = orderDate.month();
                    let periodKey = '';
                    if (month < 3) periodKey = 'Q1';
                    else if (month < 6) periodKey = 'Q2';
                    else if (month < 9) periodKey = 'Q3';
                    else periodKey = 'Q4';

                    const orderRevenue = order.totalPrice || 0;
                    const existingPeriod = groupedData.find(item => item.period === periodKey);
                    if (existingPeriod) {
                        existingPeriod.orderRevenue += orderRevenue;
                        totalOrder += orderRevenue; // Cộng vào tổng doanh thu sản phẩm
                    }
                }
            });

            // Tính doanh thu từ bookingData theo quý
            bookingData.forEach(booking => {
                const bookingDate = dayjs(booking.bookingDate);
                if (bookingDate.year() === selectedYear) {
                    const month = bookingDate.month();
                    let periodKey = '';
                    if (month < 3) periodKey = 'Q1';
                    else if (month < 6) periodKey = 'Q2';
                    else if (month < 9) periodKey = 'Q3';
                    else periodKey = 'Q4';

                    const bookingRevenue = booking.totalPrice || 0;
                    const existingPeriod = groupedData.find(item => item.period === periodKey);
                    if (existingPeriod) {
                        existingPeriod.bookingRevenue += bookingRevenue;
                        totalBooking += bookingRevenue; // Cộng vào tổng doanh thu dịch vụ
                    }
                }
            });
        }

        // Đảm bảo không có NaN trong dữ liệu
        groupedData = groupedData.map(item => ({
            ...item,
            orderRevenue: isNaN(item.orderRevenue) ? 0 : item.orderRevenue,
            bookingRevenue: isNaN(item.bookingRevenue) ? 0 : item.bookingRevenue,
        }));

        return { groupedData, totalOrder, totalBooking };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch orders
                const ordersResponse = await OrderFetch.getAllOrder(1, 1000, filters);
                const fetchedOrders = ordersResponse.data.filter(order => order.status === 'tc');
                setOrders(fetchedOrders);

                // Fetch booking data
                const bookingResponse = await BookingFetch.getAll(undefined, { year: selectedYear }, undefined);
                const completedBookings = bookingResponse.data.filter(booking => booking.status === "hoan-thanh");
                setBookingData(completedBookings);

                // Tính doanh thu sau khi đã lấy đầy đủ dữ liệu
                const { groupedData, totalOrder, totalBooking } = calculateRevenue(fetchedOrders, completedBookings, timeRange, selectedYear);
                setSelectedPeriod(groupedData);
                setTotalOrderRevenue(totalOrder); // Cập nhật tổng doanh thu sản phẩm
                setTotalBookingRevenue(totalBooking); // Cập nhật tổng doanh thu dịch vụ

            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu: ", error);
                window.alert("Lỗi khi lấy dữ liệu: " + error.message);
            }
        };

        fetchData();
    }, [filters, timeRange, selectedYear]); // Chạy lại khi có sự thay đổi về filters, timeRange, hoặc selectedYear

    useEffect(() => {
        setFilters({ ...filters, year: selectedYear });
        setSelectedPeriod([]); // Xóa dữ liệu cũ khi thay đổi thời gian
    }, [selectedYear, timeRange]);


    return (
        <Box sx={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;", padding: "5px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", paddingX: "10px", mb: '10px' }}>
                    Thống Kê Doanh Thu
                </Typography>
            </Box>

            {/* Controls */}
            <Box display="flex" justifyContent="space-between" mb={4} gap={1}>
                <FormControl fullWidth>
                    <InputLabel>Chọn Mốc Thời Gian</InputLabel>
                    <Select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        label="Chọn Mốc Thời Gian"
                    >
                        <MenuItem value="month">Theo Tháng</MenuItem>
                        <MenuItem value="quarter">Theo Quý</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Chọn Năm</InputLabel>
                    <Select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        label="Chọn Năm"
                    >
                        {[currentYear, currentYear - 1, currentYear - 2, currentYear - 3].map((year) => (
                            <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Biểu đồ doanh thu */}
            <Box sx={{ maxHeight: "600px", overflowY: "auto", padding: "5px" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <LineChart
                        sx={{
                            ml: '20px',
                            '.MuiMarkElement-root': {
                                stroke: '#000',
                                scale: '0.6',
                                fill: '#fff',
                                strokeWidth: 2,
                            },
                        }}
                        xAxis={[{ scaleType: 'point', data: selectedPeriod.map(item => item.period) }]}
                        yAxis={[{
                            domain: [0, 'auto'],
                            tickFormatter: (value) => value,
                            tickLabel: {
                                fontSize: 12,
                                padding: 10,
                            }
                        }]}
                        series={[
                            {
                                data: selectedPeriod.map(item => item.orderRevenue),
                                label: "Doanh Thu (Sản phẩm)",
                                color: '#37a693', // Màu đường cho Doanh Thu (Sản phẩm)
                            },
                            {
                                data: selectedPeriod.map(item => item.bookingRevenue),
                                label: "Doanh Thu (Dịch vụ)",
                                color: '#ff5733', // Màu đường cho Doanh Thu (Dịch vụ)
                            }
                        ]}
                        width={1000}
                        height={500}
                        margin={{ left: 70, right: 20, top: 10, bottom: 40 }} // Tăng margin cho trục Y
                    />

                    {/* Hiển thị tổng doanh thu sản phẩm và dịch vụ */}
                    <Box sx={{ display: "flex", justifyContent: 'space-around', mt: 2 }}>
                        <Typography color='#37a693'>
                            Doanh thu sản phẩm: {totalOrderRevenue.toLocaleString()}đ
                        </Typography>

                        <Typography color='#ff5733'>
                            Doanh thu dịch vụ: {totalBookingRevenue.toLocaleString()}đ
                        </Typography>

                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default RevenueReport;

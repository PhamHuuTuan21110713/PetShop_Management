import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';  // Import từ @mui/x-charts
import dayjs from 'dayjs';
import { OrderFetch } from '~/REST_API_Client';

const RevenueReport = () => {
    const currentYear = dayjs().year(); // Lấy năm hiện tại
    const [timeRange, setTimeRange] = useState('month'); // Lựa chọn theo tháng hoặc quý
    const [selectedPeriod, setSelectedPeriod] = useState([]); // Dữ liệu doanh thu theo mốc thời gian
    const [orders, setOrders] = useState([]); // Dữ liệu đơn hàng từ API
    const [selectedYear, setSelectedYear] = useState(currentYear); // Năm hiện tại mặc định là năm hiện tại
    const [filters, setFilters] = useState({
        status: 'tc', // Chỉ lấy các đơn hàng có status là 'tc'
        month: "",
        year: currentYear, // Mặc định là năm hiện tại
        orderId: "",
    });

    const calculateRevenue = (orders, timeRange) => {
        let groupedData = [];

        orders.forEach(order => {
            const orderDate = dayjs(order.orderDate); // Lấy ngày đặt hàng từ chuỗi ISO
            let periodKey;

            switch (timeRange) {
                case 'month':
                    periodKey = orderDate.format('YYYY-MM'); // Nhóm theo tháng (YYYY-MM)
                    break;

                case 'quarter':
                    // Nhóm theo quý trong năm
                    const month = orderDate.month(); // Lấy tháng từ ngày đặt hàng
                    if (month >= 0 && month < 3) {
                        periodKey = 'Q1'; // Quý 1 (tháng 1, 2, 3)
                    } else if (month >= 3 && month < 6) {
                        periodKey = 'Q2'; // Quý 2 (tháng 4, 5, 6)
                    } else if (month >= 6 && month < 9) {
                        periodKey = 'Q3'; // Quý 3 (tháng 7, 8, 9)
                    } else if (month >= 9 && month < 12) {
                        periodKey = 'Q4'; // Quý 4 (tháng 10, 11, 12)
                    }
                    break;

                default:
                    periodKey = orderDate.format('YYYY-MM'); // Mặc định nhóm theo tháng
                    break;
            }

            // Nếu đơn hàng thuộc mốc thời gian hiện tại, nhóm và cộng doanh thu
            if (periodKey) {
                const existingPeriod = groupedData.find(item => item.period === periodKey);
                const orderRevenue = order.totalPrice || 0; // Nếu giá trị doanh thu không hợp lệ (NaN), mặc định là 0
                if (existingPeriod) {
                    existingPeriod.revenue += orderRevenue;
                } else {
                    groupedData.push({ period: periodKey, revenue: orderRevenue });
                }
            }
        });

        // Kiểm tra và thay thế NaN thành 0 trong groupedData
        groupedData = groupedData.map(item => ({
            ...item,
            revenue: isNaN(item.revenue) ? 0 : item.revenue, // Đảm bảo revenue không phải NaN
        }));

        // Sắp xếp lại dữ liệu theo thứ tự thời gian (theo tháng hoặc quý)
        groupedData.sort((a, b) => {
            const orderA = dayjs(a.period, 'YYYY-MM'); // Đảm bảo rằng tháng được sắp xếp theo đúng thứ tự
            const orderB = dayjs(b.period, 'YYYY-MM');
            if (!orderA.isValid()) {
                // Nếu là quý, chúng ta không thể sắp xếp như tháng nữa
                const orderAQuarter = ['Q1', 'Q2', 'Q3', 'Q4'].indexOf(a.period);
                const orderBQuarter = ['Q1', 'Q2', 'Q3', 'Q4'].indexOf(b.period);
                return orderAQuarter - orderBQuarter;
            }
            return orderA.isBefore(orderB) ? -1 : 1;
        });

        return groupedData;
    };

    const fetchOrders = async (page = 1, limit, filters) => {
        try {
            console.log("Sending filters to API:", filters);
            const response = await OrderFetch.getAllOrder(page, limit, filters); // Lấy đơn hàng từ API
            console.log("Dữ liệu về:", response);

            // Lấy danh sách đơn hàng từ API
            const fetchedOrders = response.data;

            // Lọc chỉ lấy các đơn hàng có status là 'tc'
            const tcOrders = fetchedOrders.filter(order => order.status === 'tc');

            // Cập nhật danh sách đơn hàng có trạng thái 'tc'
            setOrders(tcOrders);

            // Tính doanh thu theo mốc thời gian đã chọn
            const revenueData = calculateRevenue(tcOrders, timeRange);
            setSelectedPeriod(revenueData); // Cập nhật dữ liệu cho biểu đồ

        } catch (error) {
            console.error("Lỗi khi lấy đơn hàng: ", error);
            window.alert("Lỗi khi lấy đơn hàng: " + error.message);
        }
    };

    useEffect(() => {
        fetchOrders(1, 1000, filters); // Lấy đơn hàng khi trang hoặc bộ lọc thay đổi
    }, [filters, timeRange]);

    // Cập nhật khi thời gian chọn thay đổi
    useEffect(() => {
        setFilters({ ...filters, year: selectedYear });
        setSelectedPeriod([]); // Xóa dữ liệu cũ khi thay đổi thời gian
    }, [selectedYear, timeRange]);

    return (
        <Box sx={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;", padding: "5px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", paddingX: "10px", mb: '10px'}}>
                    Thống Kê Doanh Thu
                </Typography>
            </Box>

            {/* Controls */}
            <Box display="flex" justifyContent="space-between" mb={4}>
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
                            '.MuiLineElement-root': {
                                stroke: '#37a693',
                                strokeWidth: 4
                            },
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

                        series={[{
                            data: selectedPeriod.map(item => item.revenue),
                            label: "Doanh Thu (VND)"
                        }]}

                        width={1000}
                        height={500}
                        margin={{ left: 70, right: 20, top: 10, bottom: 40 }} // Tăng margin cho trục Y
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default RevenueReport;

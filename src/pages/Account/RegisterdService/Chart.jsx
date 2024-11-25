import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { BarChart } from '@mui/x-charts/BarChart';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Typography, Button } from "@mui/material";
import { useState, memo } from "react";
import { axisClasses } from '@mui/x-charts/ChartsAxis';

import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
function valueFormatter(value) {
    return `${value} đơn`;
}
const chartSetting = {
    yAxis: [
        {
            label: 'Số lượng (đơn)',
        },
    ],
    width: 500,
    height: 400,
    sx: {
        [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translate(-20px, 0)',
        },
    },
};


const size = {
    width: 400,
    height: 200,
};

const StyledText = styled('text')(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 20,
}));

function PieCenterLabel({ children }) {
    const { width, height, left, top } = useDrawingArea();
    return (
        <StyledText x={left + width / 2} y={top + height / 2}>
            {children}
        </StyledText>
    );
}



const RegisterdBookingChart = ({ orders, year }) => {

    const changeToBarData = (orders, year) => {
        if (year === "") {
            year = new Date().getFullYear();
        }
        
        // Tạo object tóm tắt theo tháng và trạng thái
        const summary = {};
        
        // Duyệt qua danh sách đơn hàng và tính toán
        orders.forEach((order) => {
            const date = new Date(order.bookingDate);
            const month = date.getMonth(); // Lấy tháng (0-11)
            const orderYear = date.getFullYear();
            const status = order.status;
        
            // Chỉ xử lý đơn hàng thuộc năm được chọn
            if (orderYear === year) {
                if (!summary[month]) {
                    summary[month] = {};
                }
        
                // Đếm số lượng trạng thái
                if (!summary[month][status]) {
                    summary[month][status] = 0;
                }
                summary[month][status] += 1;
            }
        });
        
        // Khởi tạo dữ liệu kết quả với 12 tháng
        const prevData = [
            { month: 'Jan' }, { month: 'Feb' }, { month: 'Mar' }, { month: 'Apr' },
            { month: 'May' }, { month: 'June' }, { month: 'July' }, { month: 'Aug' },
            { month: 'Sept' }, { month: 'Oct' }, { month: 'Nov' }, { month: 'Dec' }
        ];
        
        // Đưa dữ liệu từ `summary` vào `prevData`
        prevData.forEach((item, index) => {
            const monthSummary = summary[index] || {};
            Object.keys(monthSummary).forEach((status) => {
                item[status] = monthSummary[status];
            });
        
            // Đảm bảo mọi trạng thái đều là số hoặc `null`
            ['hoan-thanh', 'da-huy'].forEach((status) => {
                if (!item[status]) {
                    item[status] = 0; // Gán 0 nếu không có đơn hàng
                }
            });
        });
        
        return prevData;
    }
    const changeToPieData = (datas, year) => {
        if (year === "") {
            year = new Date().getFullYear();
        }
        let totalOrders = 0;

        // Dữ liệu đầu ra ban đầu
        const prevData = [
            { label: "Thành công", count: 0, value: 0 },
            { label: "Đã hủy", count: 0, value: 0 },
        ];

        // Duyệt qua danh sách đơn hàng
        datas.forEach((order) => {
            const date = new Date(order.bookingDate);
            const orderYear = date.getFullYear();
            const status = order.status;

            // Tính tổng đơn hàng hoàn thành và đã hủy
            if (status === "hoan-thanh" || status === "da-huy") {
                totalOrders++;
            }

            // Chỉ tính các đơn hàng trong năm hiện tại
            if (orderYear == year) {
                if (status === "hoan-thanh") {
                    prevData[0].count++;
                } else if (status === "da-huy") {
                    prevData[1].count++;
                }
            }
        });

        // Tính tỷ lệ phần trăm
        prevData.forEach((item) => {
            item.value = totalOrders > 0 ? item.count / totalOrders : 0;
        });
        return prevData;

    }

    const [typeChart, setTypeChart] = useState("bar");
    const [anchorEl, setAnchorEl] = useState(null);
    const openChart = Boolean(anchorEl);
    const handleClickMenuChart = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenuChart = () => {
        setAnchorEl(null);
    };
    return (

        <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "10px", borderRadius: "8px" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem", textAlign: "center" }}>Thống kê đơn dịch vụ</Typography>

                <Box>
                    <Button
                        id="fade-button"
                        aria-controls={openChart ? 'fade-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openChart ? 'true' : undefined}
                        onClick={handleClickMenuChart}
                    >
                        <MoreVertIcon />
                    </Button>
                    <Menu
                        id="fade-menu"
                        MenuListProps={{
                            'aria-labelledby': 'fade-button',
                        }}
                        anchorEl={anchorEl}
                        open={openChart}
                        onClose={handleCloseMenuChart}
                        TransitionComponent={Fade}
                    >
                        <MenuItem onClick={() => {
                            setTypeChart("bar")
                            handleCloseMenuChart()
                        }}>Trực quan</MenuItem>
                        <MenuItem onClick={() => {
                            setTypeChart("pie")
                            handleCloseMenuChart()
                        }}>Tỉ lệ</MenuItem>
                    </Menu>
                </Box>
            </Box>

            {
                year === "" ? <Typography>Năm: <strong>{new Date().getFullYear()}</strong></Typography>
                    : <Typography>Năm: <strong>{year}</strong></Typography>
            }
            {
                orders ?
                    (
                        <Box sx={{ maxHeight: "500px", overflowY: "auto", display: "flex", justifyContent: "center" }}>
                            {
                                typeChart === "bar" ?
                                    (
                                        <BarChart
                                            dataset={year === "" ? changeToBarData(orders, new Date().getFullYear()) : changeToBarData(orders, parseInt(year))}
                                            xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                                            series={[
                                                { dataKey: 'hoan-thanh', label: 'Hoàn thành', valueFormatter },
                                                { dataKey: 'da-huy', label: 'Đã hủy', valueFormatter },
                                            ]}
                                            {...chartSetting}
                                        />
                                    ) :
                                    (
                                        <PieChart series={[{ data: changeToPieData(orders, year), innerRadius: 50 }]} {...size}>
                                            <PieCenterLabel>Lịch đặt</PieCenterLabel>
                                        </PieChart>
                                    )
                            }
                        </Box>
                    ) :
                    (
                        null
                    )
            }

        </Box>
    )
}

export default memo(RegisterdBookingChart);
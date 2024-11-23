import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { BarChart } from '@mui/x-charts/BarChart';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Typography, Button } from "@mui/material";
import { useState, memo } from "react";
import { axisClasses } from '@mui/x-charts/ChartsAxis';


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
import { PieChart } from '@mui/x-charts/PieChart';
const data = [
    { value: 5, label: 'A' },
    { value: 10, label: 'B' },
    { value: 15, label: 'C' },
    { value: 20, label: 'D' },
];

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



const BoughtOrdersChart = ({ orders, year }) => {

    const changeToBarData = (orders, year) => {
        const summary = {};

        // Duyệt qua danh sách đơn hàng
        orders.forEach((order) => {
            // Trích xuất tháng và năm từ orderDate
            const date = new Date(order.orderDate);
            const month = date.getMonth() + 1; // Lấy tháng (thêm 1 vì getMonth() trả về 0-11)
            const year = date.getFullYear();
            const status = order.status;

            // Tạo key duy nhất cho tháng, năm, và status
            const key = `${status}-${month}-${year}`;

            // Đếm số lượng phần tử
            if (!summary[key]) {
                summary[key] = {
                    status,
                    month,
                    year,
                    count: 0,
                };
            }
            summary[key].count += 1;
        });

        // Chuyển đổi kết quả thành mảng nếu cần
        const result = Object.values(summary);
        // console.log(result);
        // const grouporders = orders.map((d,i) => {

        // })
        const prevData = [{ month: 'Jan' }, { month: 'Feb' }, { month: 'Mar' }, { month: 'Apr' }, { month: 'May' }, { month: 'June' }, { month: 'July' }, { month: "Aug" }, { month: "Sept" }, { month: "Oct" }, { month: "Nov" }, { month: "Dec" }];
        const length = prevData.length;
        const length2 = result.length;
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length2; j++) {
                if (result[j].year == year) {
                    if (result[j].month == i + 1) {
                        prevData[i] = {
                            ...prevData[i],
                            [result[j].status]: result[j].count
                        }
                    }
                }
            }
        }
        return prevData;
    }
    const changeToPieData = (datas, year) => {
        if(year==="") {
            year = new Date().getFullYear();
        }
        const summary = {};
        let totalOrders =0;
        // Duyệt qua danh sách đơn hàng
        datas.forEach((order) => {
            // Trích xuất tháng và năm từ orderDate
            const date = new Date(order.orderDate);
            const month = date.getMonth() + 1; // Lấy tháng (thêm 1 vì getMonth() trả về 0-11)
            const year = date.getFullYear();
            const status = order.status;

            // Tạo key duy nhất cho tháng, năm, và status
            const key = `${status}-${year}`;

            // Đếm số lượng phần tử
            if (!summary[key]) {
                summary[key] = {
                    status,
                    month,
                    year,
                    count: 0,
                };
            }
            summary[key].count += 1;
        });
       
        // Chuyển đổi kết quả thành mảng nếu cần
        const result = Object.values(summary);
        for (let d of result) {
            totalOrders += d.count
        }
        console.log("total: ", totalOrders);
        const prevData = [{label:"Thành công"}, {label:"Hủy bởi shop"}, {label: "Hủy bởi khách"}]
        const resLength = result.length;
        for (let i=0;i<resLength;i++) {
            if(result[i].year == year) {
                if(result[i].status === "tc"){
                    prevData[0].value = result[i].count / totalOrders *100 ;
                } else if (result[i].status === "hbs") {
                    prevData[1].value =  result[i].count / totalOrders *100
                } else if(result[i].status === "hbb") {
                    prevData[2].value =  result[i].count / totalOrders *100
                }
            }
        }
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
                <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem", textAlign: "center" }}>Thống kê đơn mua</Typography>

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
            {/* <Box sx={{ marginTop: "10px" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                            <Typography sx={{ fontWeight: "bold" }}>Lọc theo năm: </Typography>
                            <input placeholder="Ex: 2024" type="text" style={{ height: "30px" }} />
                            <Button variant="contained"><FilterListIcon /></Button>
                        </Box>
                    </Box> */}
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
                                                { dataKey: 'tc', label: 'Hoàn thành', valueFormatter },
                                                { dataKey: 'hbs', label: 'Hủy bởi shop', valueFormatter },
                                                { dataKey: 'hbb', label: 'Hủy bởi khách', valueFormatter },
                                            ]}
                                            {...chartSetting}
                                        />
                                    ) :
                                    (
                                        <PieChart series={[{ data: changeToPieData(orders,year), innerRadius: 50 }]} {...size}>
                                            <PieCenterLabel>Đơn mua</PieCenterLabel>
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

export default memo(BoughtOrdersChart);
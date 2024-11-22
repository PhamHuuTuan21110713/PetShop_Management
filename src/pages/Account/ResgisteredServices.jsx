import { Box, Typography, Divider, Button } from "@mui/material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import SearchIcon from '@mui/icons-material/Search';
import myStyle from './Account.module.scss';
import FilterListIcon from '@mui/icons-material/FilterList';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { useState } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
const dataset = [
    {
        tc: 59,
        hbs: 57,
        hbb: 86,

        month: 'Jan',
    },
    {
        tc: 50,
        hbs: 52,
        hbb: 78,

        month: 'Feb',
    },
    {
        tc: 47,
        hbs: 53,
        hbb: 106,

        month: 'Mar',
    },
    {
        tc: 54,
        hbs: 56,
        hbb: 92,

        month: 'Apr',
    },
    {
        tc: 57,
        hbs: 69,
        hbb: 92,

        month: 'May',
    },
    {
        tc: 60,
        hbs: 63,
        hbb: 103,

        month: 'June',
    },
    {
        tc: 59,
        hbs: 60,
        hbb: 105,

        month: 'July',
    },
    {
        tc: 65,
        hbs: 60,
        hbb: 106,

        month: 'Aug',
    },
    {
        tc: 51,
        hbs: 51,
        hbb: 95,

        month: 'Sept',
    },
    {
        tc: 60,
        hbs: 65,
        hbb: 97,

        month: 'Oct',
    },
    {
        tc: 67,
        hbs: 64,
        hbb: 76,

        month: 'Nov',
    },
    {
        tc: 61,
        hbs: 70,
        hbb: 103,

        month: 'Dec',
    },
];
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
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';

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
const ResgisteredServices = () => {
    const [typeChart, setTypeChart] = useState("pie");
    const [anchorEl, setAnchorEl] = useState(null);
    const openChart = Boolean(anchorEl);
    const handleClickMenuChart = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenuChart = () => {
        setAnchorEl(null);
    };
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
                            <input className={myStyle.searchInput} placeholder="Tìm kiếm" type="text" />
                            <button className={myStyle.searchButton}><SearchIcon /></button>
                        </Box>
                    </Box>
                    {/* lỌC THEO TRẠNG THÁI */}
                    <Box>
                        <Typography sx={{ fontWeight: "bold" }}>Lọc theo trạng thái: </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            <Button variant="contained">Tất cả</Button>
                            <Button variant="outlined">Đang xử lý</Button>
                            <Button variant="outlined">Đã xác nhận</Button>
                            <Button variant="outlined">Hoàn thành</Button>
                            <Button variant="outlined">Đã hủy</Button>
                        </Box>
                    </Box>
                    {/* NĂM */}
                    <Box sx={{ marginTop: "10px" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                            <Typography sx={{ fontWeight: "bold" }}>Lọc theo năm: </Typography>
                            <input type="text" style={{ height: "30px" }} />
                            <Button variant="contained"><FilterListIcon /></Button>
                        </Box>
                    </Box>
                    {/* Danh sacsh don dich vu*/}
                    <Box sx={{ marginTop: "20px", maxHeight: "500px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
                        {/* Dich vu items */}
                        <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "10px", borderRadius: "4px" }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <Typography>#12313123123123</Typography>
                                    <Divider orientation="vertical" flexItem />
                                    <Typography sx={{ fontWeight: "bold", color: "#48b083" }}>Hoàn thành</Typography>
                                </Box>
                                <Box>
                                    <Typography>Ngày lên lịch: 24/11/2023</Typography>
                                </Box>
                            </Box>
                            {/* dANH Sach san pham */}
                            <Box sx={{display:"flex", flexWrap:"wrap", gap:2}}>
                                <Typography><strong>Dịch vụ:</strong> Cắt tỉa lông thú cưng</Typography>
                                <Typography><strong>Ngày thực hiện:</strong> 24/11/2023</Typography>
                                <Typography><strong>Thời gian:</strong> 18:30</Typography>
                                <Typography><strong>Cân nặng thú cưng:</strong> 10kg</Typography>
                                <Typography><strong>Chi tiết thú cưng:</strong> Chó sợ người</Typography>
                                <Typography><strong>Ghi chú:</strong> Chó sợ người</Typography>
                            </Box>
                            {/* Gias tri don hang */}
                            <Box sx={{ marginTop: "12px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                                <Typography ><strong>Tổng giá trị:</strong> <span style={{color:"#de5945"}}>12.000đ</span></Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            {/* Thống kê */}
            <Box className={myStyle.colRightOrders}>
                <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "10px", borderRadius: "8px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem", textAlign: "center" }}>Thống kê lịch</Typography>
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
                    <Box sx={{ maxHeight: "500px", overflowY: "auto", display: "flex", justifyContent: "center" }}>
                        {
                            typeChart === "bar" ?
                                (
                                    <BarChart
                                        dataset={dataset}
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
                                    <PieChart series={[{ data, innerRadius: 80 }]} {...size}>
                                        <PieCenterLabel>Center label</PieCenterLabel>
                                    </PieChart>
                                )
                        }

                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ResgisteredServices;
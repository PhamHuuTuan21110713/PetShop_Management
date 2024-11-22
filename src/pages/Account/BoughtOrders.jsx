import { Box, Typography, Divider, Button, CircularProgress } from "@mui/material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import SearchIcon from '@mui/icons-material/Search';
import myStyle from './Account.module.scss';
import FilterListIcon from '@mui/icons-material/FilterList';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { useEffect, useState } from "react";
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
import { OrderFetch } from "~/REST_API_Client";

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
const BoughtOrders = ({ userId }) => {
    const [typeChart, setTypeChart] = useState("bar");
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoading, setIsLoaing] = useState(false);
    const [orders, setOrders] = useState();
    const [filter, setFilter] = useState("all");
    const openChart = Boolean(anchorEl);

    useEffect(() => {
        OrderFetch.getOrderByUserId(userId)
            .then((data) => {
                console.log(`orders: ${userId}`, data);
                setOrders(data.data);
            })
    }, [])
    const changeFilter = (value) => {
        setFilter(value)
    }
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
                    <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem", textAlign: "center" }}>Đơn hàng đã mua</Typography>
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
                            <Button variant={filter === "all" ? "contained" : "outlined"} onClick={() => changeFilter("all")}>Tất cả</Button>
                            <Button variant={filter === "dxl" ? "contained" : "outlined"} onClick={() => changeFilter("dxl")}>Đang xử lý</Button>
                            <Button variant={filter === "dg" ? "contained" : "outlined"} onClick={() => changeFilter("dg")}>Đang giao</Button>
                            <Button variant={filter === "tc" ? "contained" : "outlined"} onClick={() => changeFilter("tc")}>Hoàn thành</Button>
                            <Button variant={filter === "huy" ? "contained" : "outlined"} onClick={() => changeFilter("huy")}>Đã hủy</Button>
                        </Box>
                    </Box>
                    {/* NĂM */}
                    <Box sx={{ marginTop: "10px" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                            <Typography sx={{ fontWeight: "bold" }}>Lọc theo năm: </Typography>
                            <input placeholder="Ex: 2024" type="text" style={{ height: "30px" }} />
                            <Button variant="contained"><FilterListIcon /></Button>
                        </Box>
                    </Box>
                    {/* Danh sacsh ddown hangs */}
                    <Box sx={{ marginTop: "20px", maxHeight: "500px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
                        {/* Đơn hàng items */}
                        {
                            !isLoading ?
                                (
                                    orders?.map((order, index) => {
                                        return (
                                            <Box
                                                key={index}
                                                sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "10px", borderRadius: "4px" }}>
                                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                    <Box sx={{ display: "flex", gap: 1 }}>
                                                        <Typography><strong>#{order?._id}</strong></Typography>
                                                        <Divider orientation="vertical" flexItem />
                                                        <Typography sx={{ fontWeight: "bold", color: "#48b083" }}>
                                                            {order?.status === "dxl" ? "Cần xử lý" : (order?.status === "dg" ? "Đang giao" : (order?.status === "tc" ? "Hoàn thành" : (order?.status === "hbb" ? "Hủy bởi bạn" : "Hủy bởi shop")))}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography>Thời gian: {new Date(order?.orderDate).toLocaleDateString('vi-VN')}</Typography>
                                                    </Box>
                                                </Box>
                                                {/* dANH Sach san pham */}
                                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                                    {
                                                        order?.products.map((prod, index) => {
                                                            return (
                                                                <Box key={index}>
                                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                                                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                                                                            <Box>
                                                                                <Typography>{prod.productId}</Typography>
                                                                                <Typography>Số lượng: x2</Typography>
                                                                            </Box>
                                                                        </Box>
                                                                    </Box>
                                                                </Box>
                                                            )
                                                        })
                                                    }

                                                </Box>
                                                {/* Gias tri don hang */}
                                                <Box sx={{ marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <Typography >Phương thức: COD</Typography>
                                                    <Typography >Tổng giá trị: 12.000đ</Typography>
                                                </Box>
                                            </Box>
                                        )
                                    })

                                ) : (
                                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <CircularProgress />
                                    </Box>
                                )
                        }

                    </Box>
                </Box>
            </Box>
            {/* Thống kê */}
            <Box className={myStyle.colRightOrders}>
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
                                    <PieChart series={[{ data, innerRadius: 50 }]} {...size}>
                                        <PieCenterLabel>Đơn mua</PieCenterLabel>
                                    </PieChart>
                                )
                        }

                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default BoughtOrders;
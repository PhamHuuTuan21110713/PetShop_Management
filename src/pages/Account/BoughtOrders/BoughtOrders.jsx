import { Box, Typography, Divider, Button, CircularProgress } from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';
import myStyle from '../Account.module.scss';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useEffect, useRef, useState } from "react";

import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import { OrderFetch } from "~/REST_API_Client";
import BoughtOrdersChart from "./Chart";

const BoughtOrders = ({ userId }) => {


    const [isLoading, setIsLoaing] = useState(false);
    const [orders, setOrders] = useState(null);
    const originalOrders = useRef(null);
    const [filter, setFilter] = useState("all");
    const [find, setFind] = useState("");
    const [yearList, setYearList] = useState("");
    const [yearTK, setYearTK] = useState("")
    const fetchData = (myFilter, myFind) => {
        setIsLoaing(true);
        let condition;
        if (yearList !== "") {
            const year = parseInt(yearList); // Hoặc lấy từ đầu vào người dùng
            condition = {
                year: year
            }
        }
        if (myFilter === "all") {
            condition = { ...condition }
        } else if (myFilter === "dxl") {
            condition = { ...condition, status: "dxl" }
        } else if (myFilter === "dg") {
            condition = { ...condition, status: "dg" }
        } else if (myFilter === "tc") {
            condition = { ...condition, status: "tc" }
        } else if (myFilter === "huy") {
            condition = { ...condition, $or: [{ status: "hbb" }, { status: "hbs" }] }
        } else {
            toast.error("Bộ lọc không hợp lệ hoặc không còn hỗ trợ");
        }
        OrderFetch.getOrderByUserId(userId, condition, myFind)
            .then((data) => {
                // console.log(`orders: ${userId}`, data);
                if (orders === null) {
                    originalOrders.current = data.data;
                }
                setOrders(data.data);

                setIsLoaing(false);
            })
            .catch(err => {
                toast.error(`Lỗi lấy dữ liệu đơn hàng`);
                console.log(`Lỗi lấy dữ liệu đơn hàng: \n ${err}`)
            })
    }
    useEffect(() => {
        fetchData(filter, find);
    }, [filter])
    const changeFilter = (value) => {
        setFilter(value)
    }

    const handleChangeFind = (e) => {
        setFind(e.target.value);
    }
    const handleSearch = () => {
        fetchData(filter, find);
    }
    const handleFindYearList = () => {
        fetchData(filter, find);
        setYearTK(yearList);
    }
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
                            <input value={find} onChange={handleChangeFind} className={myStyle.searchInput} placeholder="Tìm kiếm" type="text" />
                            <button onClick={handleSearch} className={myStyle.searchButton}><SearchIcon /></button>
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
                            <input value={yearList} onChange={(e) => setYearList(e.target.value)} placeholder="Ex: 2024" type="text" style={{ height: "30px" }} />
                            <Button onClick={handleFindYearList} variant="contained"><FilterListIcon /></Button>
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
                                                                            <Box sx={{ width: "40px", height: "40px" }}>
                                                                                <img src={prod.details.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                                            </Box>
                                                                            <Box>
                                                                                <Typography>{prod.details.name}</Typography>
                                                                                <Typography>Số lượng: x{prod.quantity}</Typography>
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
                                                    <Typography >Phương thức: {order.paymentMethod === "cod" ? "COD" : "MoMo"}</Typography>
                                                    <Typography >Tổng giá trị: {order.totalPrice}</Typography>
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
            {
                originalOrders.current ?
                    (
                        <Box className={myStyle.colRightOrders}>
                            <BoughtOrdersChart orders={originalOrders.current} year={yearTK} />
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

export default BoughtOrders;
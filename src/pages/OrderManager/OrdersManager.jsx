import  { useEffect, useRef, useState } from "react";
import myStyle from "~/pages/AccountManager/AllAccount/AllAccount.module.scss";
import { Box, Button, Pagination, Tooltip, Typography, CircularProgress, Chip } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import DetailsIcon from '@mui/icons-material/Details';

import { OrderFetch } from "~/REST_API_Client"; // Giả sử OrderFetch là API client của bạn để lấy đơn hàng
import OrderModal from "~/components/Modal/Order/OrderModal";
//import ProductModal from "~/components/Modal/Product/ProductModal";  // Nếu vẫn cần modal cho sản phẩm
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const OrdersManager = () => {
    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [limit, setLimit] = useState(10)
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState(""); // State mới để lưu giá trị tìm kiếm
    const [filters, setFilters] = useState({
        status: null,
        month: "",
        year: 0,
        orderId: "",
        name: ""
    });
    

    const indexOrder = useRef(0);


    const fetchOrders = async (page = 1, limit, filters) => {
        try {
            console.log("Sending filters to API:", filters);
            const response = await OrderFetch.getAllOrder(page, limit, filters); // Lấy đơn hàng từ API
            console.log("du lieu ve", response);

            setOrders(response.data);
            setTotalPages(response.pagination.totalPages);
            setIsLoading(false);
        } catch (error) {
            console.error("Lỗi khi lấy đơn hàng: ", error);
            toast.error("Lỗi khi lấy đơn hàng: " + error.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(page, limit, filters); // Lấy đơn hàng khi trang hoặc bộ lọc thay đổi
    }, [page,limit, filters]);

    const handleOpenModal = (index) => {
        indexOrder.current = index;
        setOpenModal(true);
    };

    const handleCloseModal =()=>{
        setOpenModal(false)
        fetchOrders(page, limit, filters);
    }

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
        fetchOrders(newPage, limit,filters);
    };

    const handleSearch = () => {
        const isOrderId = /^[a-fA-F0-9]{24}$/.test(searchTerm);
        setFilters(prevFilters => ({
            ...prevFilters,
            orderId: isOrderId ? searchTerm: "", // Tìm kiếm theo mã đơn hàng
            name: isOrderId ? "" :  searchTerm })); // Tìm kiếm theo mã đơn hàng
    };

    const handleChangeFind = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusChange = (status) => {
        const updatedFilters = { ...filters, status };
        setFilters(updatedFilters);  // Cập nhật filters

        // Nếu status là "all", không truyền vào API
        const statusParam = status === "" ? undefined : status;

        fetchOrders(1, limit,{ ...updatedFilters, status: statusParam });
    };

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {/* Tìm kiếm theo mã đơn hàng */}
                <Box sx={{ display: "flex", alignItems: "center", border: "solid 1px #000", width: "400px", gap: "2px", borderRadius: "20px", overflow: "hidden" }}>
                    <input className={myStyle.searchInput} placeholder="Tìm kiếm theo mã đơn hàng" type="text" value={searchTerm} onChange={handleChangeFind} />
                    <button onClick={handleSearch} className={myStyle.searchButton}><SearchIcon /> </button>
                </Box>


            </Box>

            {/* Bộ lọc trạng thái */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: "20px" }}>
                <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>Trạng thái:</Typography>
                <Button
                    sx={{ textTransform: "none" }}
                    onClick={() => handleStatusChange(null)}
                    variant={filters.status === null ? "contained" : "outlined"}
                >
                    Tất cả
                </Button>
                <Button
                    sx={{ textTransform: "none" }}
                    onClick={() => handleStatusChange("dxl")}
                    variant={filters.status === "dxl" ? "contained" : "outlined"}
                >
                    Đang xử lý
                </Button>
                <Button
                    sx={{ textTransform: "none" }}
                    onClick={() => handleStatusChange("dg")}
                    variant={filters.status === "dg" ? "contained" : "outlined"}
                >
                    Đang vận chuyển
                </Button>
                <Button
                    sx={{ textTransform: "none" }}
                    onClick={() => handleStatusChange("tc")}
                    variant={filters.status === "tc" ? "contained" : "outlined"}
                >
                    Thành công
                </Button>
                <Button
                    sx={{ textTransform: "none" }}
                    onClick={() => handleStatusChange("hbs")}
                    variant={filters.status === "hbs" ? "contained" : "outlined"}
                >
                    Shop hủy
                </Button>
                <Button
                    sx={{ textTransform: "none" }}
                    onClick={() => handleStatusChange("hbb")}
                    variant={filters.status === "hbb" ? "contained" : "outlined"}
                >
                    Khách hủy
                </Button>
            </Box>

            {/* Danh sách đơn hàng */}
            <Box sx={{ marginTop: "20px" }}>
                <Box className={myStyle.tableContainer}>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}>STT</th>
                                <th style={{ width: "22%" }}>Tên khách hàng</th>
                                <th style={{ width: "10%" }}>Số sản phẩm</th>
                                <th style={{ width: "16%" }}>Tổng giá trị</th>
                                <th style={{ width: "17%" }}>Ngày đặt hàng</th>
                                <th style={{ width: "15%" }}>Trạng thái</th>
                                <th style={{ width: "20%" }}>Hành động</th>
                            </tr>
                        </thead>
                        {isLoading ? (
                            <tbody>
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center" }}>
                                        <CircularProgress />
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {orders?.length > 0 &&
                                    orders.map((order, index) => (
                                        <tr key={order._id}>
                                            <td>{index+1}</td>
                                            <td>{order.name}</td>
                                            <td>{order.products.length}</td>
                                            <td>{order.totalPrice.toLocaleString('vi-VN')}đ</td>
                                            <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                            <td style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {
                                                    order.status === "dxl" ? (
                                                        <Chip label="Đang xử lý" color="primary" />
                                                    ) : order.status === "dg" ? (
                                                        <Chip label="Đang vận chuyển" color="info" />
                                                    ) : order.status === "tc" ? (
                                                        <Chip label="Thành công" color="success" />
                                                    ) : order.status === "hbs" ? (
                                                        <Chip label="Hủy bởi shop" color="error" />
                                                    ) : order.status === "hbb" ? (
                                                        <Chip label="Người dùng hủy" color="warning" />
                                                    ) : null
                                                }
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <Tooltip title="Chi tiết">
                                                    <button
                                                        onClick={() => handleOpenModal(index)}
                                                        style={{
                                                            border: "none",
                                                            cursor: "pointer",
                                                            color: "#fff",
                                                            background: "#346791",
                                                            borderRadius: "4px"
                                                        }}
                                                    >
                                                        <DetailsIcon />
                                                    </button>
                                                </Tooltip>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        )}
                    </table>
                </Box>
            </Box>

            {/* Phân trang */}
            {!isLoading && (
                <>
                    <Box sx={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
                        <Pagination
                            page={page}
                            onChange={handlePageChange}
                            count={totalPages}
                            size="small"
                        />
                    </Box>
                    <OrderModal open={openModal} onClose={handleCloseModal} order={orders[indexOrder.current]} />

                </>
            )}
            <ToastContainer />
        </Box>
    );
};

export default OrdersManager;

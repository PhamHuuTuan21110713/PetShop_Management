import React, { useEffect, useState, useRef } from "react";
import myStyle from "~/pages/AccountManager/AllAccount/AllAccount.module.scss";
import { Box, Button, Pagination, Tooltip, Typography, CircularProgress, Chip } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import DetailsIcon from '@mui/icons-material/Details';
import { PromotionFetch } from "~/REST_API_Client"; // Giả sử đây là API client của bạn
import PromotionModal from "~/components/Modal/Promotion/PromotionModal";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const AllPromotion = () => {
    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [promotions, setPromotions] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        outdated: "none",
        promotionId: "",
        type: "none",
        name: ""
    });
    const [searchTerm, setSearchTerm] = useState(""); // State mới để lưu giá trị tìm kiếm

    const indexProduct = useRef(0);

    const fetchPromotions = async (page, filters) => {
        try {
            console.log("Sending filters to API:", filters);
            const response = await PromotionFetch.getAllPromotion(page, filters); // Gọi API lấy dữ liệu khuyến mãi
            console.log("Data response:", response);
            setPromotions(response.data);
            // setTotalPages(response.pagination.totalPages);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching promotions: ", error);
            toast.error("Error fetching promotions: " + error.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions(page, filters); // Lấy dữ liệu khuyến mãi khi page hoặc filters thay đổi và khi tìm kiếm
    }, [page, filters]); // Gọi lại API mỗi khi `filters` hoặc `page` thay đổi

    const handleOpenModal = (index) => {
        indexProduct.current = index;
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleChangeFind = (e) => {
        setSearchTerm(e.target.value); // Cập nhật `searchTerm` khi người dùng nhập tìm kiếm
    };

    const handleSearch = () => {
        // Cập nhật `filters.promotionId` với `searchTerm` và gọi API
        const isPromotionId = /^[a-fA-F0-9]{24}$/.test(searchTerm);
        setFilters(prevFilters => ({
            ...prevFilters,
            promotionId: isPromotionId? searchTerm: "",
            name: isPromotionId ? "" : searchTerm
        }));
    };

    const handlePageChange = (e, newPage) => {
        setPage(newPage); // Thay đổi trang khi người dùng chuyển trang
    };

    const handleOutDatedChange = (outdated) => {
        if (outdated === "none") {
            // Nếu outdated là "none", reset tất cả các filters về giá trị mặc định
            setFilters({
                outdated: "none",
                promotionId: "",
                type: "none",
                name: ""
            });
        } else {
            // Nếu không phải "none", chỉ cập nhật trạng thái outdated
            const updatedFilters = { ...filters, outdated };
            setFilters(updatedFilters);
        }
    };
    

    const handleTypeChange = (type) => {
        const updatedFilters = { ...filters, type };
        setFilters(updatedFilters); // Cập nhật filters khi thay đổi loại khuyến mãi
    };

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                    {/* Thanh tìm kiếm */}
                    <Box sx={{ display: "flex", alignItems: "center", border: "solid 1px #000", width: "400px", gap: "2px", borderRadius: "20px", overflow: "hidden" }}>
                        <input
                            className={myStyle.searchInput}
                            placeholder="Tìm kiếm theo mã khuyến mãi"
                            type="text"
                            value={searchTerm} // Hiển thị giá trị của `searchTerm`
                            onChange={handleChangeFind} // Cập nhật `searchTerm` khi người dùng nhập
                        />
                        <button onClick={handleSearch} className={myStyle.searchButton}><SearchIcon /></button>
                    </Box>
                </Box>

                {/* Các nút lọc */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>Trạng thái: </Typography>
                    <Button
                        sx={{ textTransform: "none" }}
                        onClick={() => {
                            handleOutDatedChange("none");  // Chỉ thay đổi trạng thái 'outdated' về "none"
                        }}
                        variant={filters.outdated === "none" ? "contained" : "outlined"}>
                        Tất cả
                    </Button>

                    <Button
                        sx={{ textTransform: "none" }}
                        onClick={() => handleOutDatedChange("true")}
                        variant={filters.outdated === "true" ? "contained" : "outlined"}>
                        Hết hạn
                    </Button>
                    <Button
                        sx={{ textTransform: "none" }}
                        onClick={() => handleOutDatedChange("false")}
                        variant={filters.outdated === "false" ? "contained" : "outlined"}>
                        Hoạt động
                    </Button>

                    <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>Loại: </Typography>
                    {/* <Button
                        sx={{ textTransform: "none" }}
                        onClick={() => handleTypeChange("")}
                        variant={filters.type === "" ? "contained" : "outlined"}>
                        Tất cả
                    </Button> */}
                    <Button
                        sx={{ textTransform: "none" }}
                        onClick={() => handleTypeChange("percent")}
                        variant={filters.type === "percent" ? "contained" : "outlined"}>
                        Giảm theo %
                    </Button>
                    <Button
                        sx={{ textTransform: "none" }}
                        onClick={() => handleTypeChange("price")}
                        variant={filters.type === "price" ? "contained" : "outlined"}>
                        Giảm theo VND
                    </Button>
                </Box>
            </Box>

            {/* Bảng khuyến mãi */}
            <Box sx={{ marginTop: "20px" }}>
                <Box className={myStyle.tableContainer}>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: "6%" }}>STT</th>
                                <th style={{ width: "25%" }}>Tên chương trình</th>
                                <th style={{ width: "10%" }}>Kiểu giảm</th>
                                <th style={{ width: "10%" }}>Giá trị</th>
                                <th style={{ width: "15%" }}>Ngày hết</th>
                                <th style={{ width: "14%" }}>Trạng thái</th>
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
                                {promotions?.length > 0 &&
                                    promotions.map((promotion, index) => (
                                        <tr key={promotion._id || index}>
                                            <td>{index+1}</td>
                                            <td>{promotion.name}</td>
                                            <td>{promotion.type}</td>
                                            <td>{promotion.value}</td>
                                            <td>{new Date(promotion?.endDate).toLocaleDateString()}</td>
                                            <td style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {promotion?.endDate && new Date(promotion?.endDate).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0) && promotion.state === true ? (
                                                    <Chip label="Hoạt động" color="success" />
                                                ) : (
                                                    <Chip label="Hết hạn" color="warning" />
                                                )}
                                            </td>

                                            <td>
                                                <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                                                    <Tooltip title="Chi tiết">
                                                        <button
                                                            onClick={() => handleOpenModal(index)}
                                                            style={{
                                                                border: "none",
                                                                cursor: "pointer",
                                                                color: "#fff",
                                                                background: "#346791",
                                                                borderRadius: "4px"
                                                            }}>
                                                            <DetailsIcon />
                                                        </button>
                                                    </Tooltip>
                                                </Box>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        )}
                    </table>
                </Box>
            </Box>

            {!isLoading && (
                <Box sx={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
                    <Pagination
                        page={page}
                        onChange={handlePageChange}
                        count={totalPages} // Tổng số trang
                        size="small"
                    />
                    {/* Modal chi tiết */}
                    <PromotionModal open={openModal} onClose={handleCloseModal} promotion={promotions[indexProduct.current]} />
                </Box>
            )}
            <ToastContainer />
        </Box>
    );
};

export default AllPromotion;

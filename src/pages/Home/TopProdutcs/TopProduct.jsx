import React, { useState, useEffect } from "react";
import myStyle from "./TopProduct.module.scss";
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ProductFetch } from "~/REST_API_Client";

const TopProducts = () => {
    const [showSubMenu, setShowSubMenu] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false); // State để mở/đóng modal
    const [selectedProduct, setSelectedProduct] = useState(null); // Lưu sản phẩm đang chọn

    // Xử lý mở/đóng menu con
    const handleExpand = () => {
        setShowSubMenu(!showSubMenu);
    };

    // Hàm gọi API để lấy sản phẩm
    const fetchBestSellingProducts = async (type) => {
        setLoading(true); // Bắt đầu tải dữ liệu
        setError(null); // Reset lỗi khi gọi lại API
        try {
            const response = await ProductFetch.fetchTopSaleProducts(type === "pre" ? 2 : 1, 10);  // Giả sử type "pre" cho tháng trước, "curr" cho tháng này
            setProducts(response.products);  // Lưu danh sách sản phẩm vào state
            console.log("getProducts: ",response.products )
        } catch (err) {
            setError("Error fetching best selling products");  // Xử lý lỗi nếu có
        } finally {
            setLoading(false);  // Kết thúc quá trình tải dữ liệu
        }
    };

    // Hàm xử lý khi chọn một loại trong menu con
    const handleQuery = (type) => {
        fetchBestSellingProducts(type);  // Gọi API với loại dữ liệu được chọn
        setShowSubMenu(false);  // Đóng menu con sau khi chọn
    };

    // Hàm mở modal và set sản phẩm đã chọn
    const handleOpenModal = (product) => {
        console.log("product Top",product);
        
        setSelectedProduct(product); // Lưu thông tin sản phẩm vào state
        setOpenModal(true); // Mở modal
    };

    // Hàm đóng modal
    const handleCloseModal = () => {
        setOpenModal(false); // Đóng modal
        setSelectedProduct(null); // Reset sản phẩm đã chọn
    };

    // Gọi API khi component mount
    useEffect(() => {
        fetchBestSellingProducts("curr");  // Gọi API mặc định cho tháng này
    }, []);

    return (
        <Box sx={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;", padding: "5px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", paddingX: "10px" }}>
                    Top sản phẩm
                </Typography>
                <Box sx={{ cursor: "pointer" }} onClick={handleExpand}>
                    <MoreVertIcon />
                </Box>
                {showSubMenu && (
                    <Box sx={{
                        position: "absolute", backgroundColor: "#fff", boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                        right: "10px", top: "30px", zIndex: "1000"
                    }}>
                        <Box className={myStyle.subMenuContainer} onClick={() => handleQuery("curr")}>
                            <Typography>Tháng này</Typography>
                        </Box>
                        <Box className={myStyle.subMenuContainer} onClick={() => handleQuery("pre")}>
                            <Typography>Tháng trước</Typography>
                        </Box>
                    </Box>
                )}
            </Box>

            {/* Hiển thị thông báo tải dữ liệu hoặc lỗi */}
            {loading && <Typography>Loading...</Typography>}
            {error && <Typography color="error">{error}</Typography>}

            <Box sx={{ maxHeight: "390px", overflowY: "auto", padding: "5px" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {products.length === 0 && !loading && !error && (
                        <Typography>Không có sản phẩm nào.</Typography>
                    )}

                    {/* Hiển thị danh sách sản phẩm */}
                    {products.map((product) => (
                        <Box key={product._id} sx={{ padding: "10px" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}>
                                <Box sx={{ display: 'flex', gap: 4 }}>
                                    <Box sx={{ width: "50px", height: "50px" }}>
                                        <img alt="ảnh" src={product.img} style={{ width: "100%", height: "100%" }} />
                                    </Box>
                                    <Box>
                                        <Typography>{product.name}</Typography>
                                        <Typography>
                                            Đã bán: <span style={{ fontWeight: "bold", color: "#de5945" }}>{product.sold}</span>
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ justifyItems: "flex-end" }}>
                                    <Button variant="contained" onClick={() => handleOpenModal(product)}>
                                        Chi tiết
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Modal chi tiết sản phẩm */}
            {selectedProduct && (
                <Dialog open={openModal} onClose={handleCloseModal}>
                    <DialogTitle variant="h5">Chi tiết sản phẩm</DialogTitle>
                    <DialogContent>
                        <Box>
                            <Typography><strong>Mã sản phẩm:</strong> {selectedProduct?._id}</Typography>
                            <Typography><strong>Tên sản phẩm:</strong> {selectedProduct?.name}</Typography>
                            <Typography><strong>Mô tả:</strong> {selectedProduct ?.desc}</Typography>
                            <Typography><strong>Kiểu sản phẩm:</strong> {selectedProduct ?.type}</Typography>

                            <Typography><strong>Số lượng:</strong> {selectedProduct?.quantity}</Typography>
                            <Typography><strong>Lượt bán:</strong> {selectedProduct?.sold}</Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal} color="primary">Đóng</Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default TopProducts;

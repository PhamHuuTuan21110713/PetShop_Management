import { useEffect, useRef, useState } from 'react';
import { Modal, Box, Typography, Button, Chip, Divider, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { OrderFetch, ProductFetch } from '~/REST_API_Client';  // Import API để lấy order (nếu cần)
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const DetailOrderModal = ({ open, onClose, order }) => {
    const [isUpdate, setIsUpdate] = useState(false);
    const [orderDetails, setOrderDetails] = useState(order);
    const [quantity, setQuantity] = useState(null)
    const [productsDetails, setProductsDetails] = useState([]);
    const [status, setStatus] = useState()
    const [statusChange, setStatusChange] = useState()
    const [paymentStatus, setPaymentStatus] = useState('')

    useEffect(() => {
        if (open === true) {
            setOrderDetails(order);  // Cập nhật thông tin đơn hàng khi modal mở
            setIsUpdate(false);
            setStatus(orderDetails.status)
            // Hàm lấy thông tin chi tiết sản phẩm
            const fetchProductsDetails = async () => {
                // Log order.products để kiểm tra dữ liệu đầu vào
                console.log("Thông tin đơn hàng:", order?.products);

                // Sử dụng Promise.all để đồng thời gọi API cho tất cả các sản phẩm
                const productsData = await Promise.all(
                    order?.products?.map(async (data, index) => {
                        const { productId, quantity } = data;
                        console.log(`Đang xử lý sản phẩm tại index ${index} với productId:`, productId);
                        setQuantity(quantity);  // Cập nhật số lượng sản phẩm

                        // Kiểm tra nếu productId hợp lệ trước khi gọi API
                        if (!productId) {
                            console.log("Sản phẩm không hợp lệ, bỏ qua", data);
                            return null; // Nếu productId không hợp lệ, trả về null
                        }

                        try {
                            // Log dữ liệu trước khi gọi API để kiểm tra xem productId có chính xác không
                            console.log(`Gọi API với productId ${productId}...`);

                            // Gọi API lấy thông tin sản phẩm theo productId
                            const product = await ProductFetch.getById(productId);

                            // Log dữ liệu trả về từ API
                            console.log(`Dữ liệu trả về cho productId ${productId}:`, product);

                            if (!product?.data) {
                                throw new Error(`Không tìm thấy sản phẩm với ID ${productId}`);
                            }

                            // Trả về dữ liệu sản phẩm nếu thành công
                            return product?.data;

                        } catch (err) {
                            // Log lỗi nếu có
                            console.log(`Lỗi khi lấy thông tin sản phẩm với id ${productId}:`, err);
                            return null; // Trả về null nếu có lỗi
                        }
                    })
                );

                // Log toàn bộ dữ liệu sau khi gọi xong API
                console.log("Dữ liệu sản phẩm sau khi gọi API:", productsData);

                // Lọc ra các sản phẩm hợp lệ (không phải null)
                const validProductsData = productsData.filter(product => product !== null);
                console.log("Sản phẩm hợp lệ:", validProductsData);  // Log sản phẩm hợp lệ

                // Cập nhật state với các sản phẩm hợp lệ
                setProductsDetails(validProductsData);
            };

            fetchProductsDetails();  // Gọi hàm lấy chi tiết sản phẩm
        }
    }, [open, order?.products]);  // Lắng nghe sự thay đổi của 'open' và 'order?.products'

    const changeToUpdate = () => {
        setIsUpdate(true);
        console.log("Status", status);
    }

    const changeToUnUpdate = () => {
        setIsUpdate(false);
    }

    // Hàm xử lý thay đổi trạng thái
    const handleStatusChange = (event) => {
        setStatusChange(event.target.value); // Cập nhật trạng thái khi người dùng chọn một RadioButton mới
    };

    const handleConfirm = async () => {
        if(statusChange === 'tc'){
            setPaymentStatus('success')
        }
        const dataUpdate = {
            status: statusChange,
            paymentStatus: paymentStatus
        }


        // Xử lý xác nhận đơn hàng, có thể cập nhật trạng thái order hoặc thực hiện các thao tác khác
        OrderFetch.updateOrder(orderDetails?._id, dataUpdate)
            .then(data => {
                const newOrder = data.data
                //onChange(newOrder);
                // Gọi API cập nhật trạng thái đơn hàng (nếu cần)
                // const data = await OrderFetch.updateOrder(orderDetails._id, updatedData);
                toast.success("Cập nhật thông tin đơn hàng thành công");
                onClose(); // Đóng modal sau khi xử lý
            })
            .catch(err => {
                console.log("Lỗi khi cập nhật đơn hàng:", err);
                toast.error(`Lỗi cập nhật thông tin đơn hàng: ${err.message || err}`);
            })
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="order-details-title"
            aria-describedby="order-details-description"
        >
            <Box sx={modalStyle}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }} id="order-details-title">
                        Thông tin chi tiết đơn hàng
                    </Typography>
                </Box>

                <Box sx={{ marginTop: "10px" }}>
                    <Typography><strong>Mã đơn hàng:</strong> {orderDetails?._id}</Typography>
                    {!isUpdate ?
                        <>
                            <Typography><strong>Tên người đặt:</strong> {orderDetails?.name}</Typography>
                            <Typography><strong>Địa chỉ giao hàng:</strong> {orderDetails?.address}</Typography>
                            <Typography><strong>Số điện thoại:</strong> {orderDetails?.phone}</Typography>
                            {orderDetails.paymentMethod === 'cod' ?
                                <Typography><strong>Phuơng thức thanh toán:</strong> Thanh toán khi nhận hàng</Typography> :
                                <Typography><strong>Phuơng thức thanh toán:</strong> Thanh toán qua VNpay</Typography>

                            }

                            <Divider sx={{ margin: "10px 0" }} />

                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Danh sách sản phẩm:</Typography>
                            <Box sx={{ marginTop: "10px" }}>
                                {productsDetails?.map((product, index) => (

                                    <Box key={index} sx={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                        <Typography>{product?.name} x{quantity}</Typography>
                                        <Typography>{product?.price.toLocaleString('vi-VN')}đ</Typography>
                                    </Box>
                                ))}
                            </Box>

                            <Divider sx={{ margin: "10px 0" }} />

                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                Tổng tiền: {orderDetails?.totalPrice?.toLocaleString('vi-VN')}đ
                            </Typography>

                            <Divider sx={{ margin: "10px 0" }} />

                            <Typography><strong>Trạng thái đơn hàng:</strong></Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
                                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                    {orderDetails.status === "dxl" ? (
                                        <Chip label="Đang xử lý" color="info" />
                                    ) : orderDetails.status === "dg" ? (
                                        <Chip label="Đang vận chuyển" color="primary" />
                                    ) : orderDetails.status === "tc" ? (
                                        <Chip label="Thành công" color="success" />
                                    ) : orderDetails.status === "hbs" ? (
                                        <Chip label="Hủy bỏi shop" color="error" />
                                    ) : orderDetails.status === "hbb" ? (
                                        <Chip label="Người dùng hủy" color="warning" />
                                    ) : null}
                                </Box>
    
                                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                    {orderDetails.paymentMethod !== 'cod' || orderDetails.status === "tc" && orderDetails.
                                        paymentMethod === 'cod' ? (
                                        <Chip label="Đã thanh toán" color="primary" />
                                    ) : (
                                        <Chip label="Chưa thanh toán" color="warning" />
                                    )
                                    }
                                </Box>
                            </Box>
                        </>
                        :
                        <>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Typography><strong>Trạng thái tài khoản:</strong></Typography>

                                {
                                    <RadioGroup value={statusChange || orderDetails.status} onChange={handleStatusChange}>
                                        {/* Hiển thị các RadioButton tương ứng với các trạng thái có thể có */}
                                        <FormControlLabel value="dxl" control={<Radio />} label="Đang xử lý" />
                                        <FormControlLabel value="dg" control={<Radio />} label="Đang vận chuyển" />
                                        <FormControlLabel value="tc" control={<Radio />} label="Thành công" />
                                        <FormControlLabel value="hbs" control={<Radio />} label="Hủy bởi shop" />
                                        <FormControlLabel value="hbb" control={<Radio />} label="Người dùng hủy" />
                                    </RadioGroup>
                                }
                            </Box>
                        </>
                    }
                </Box>

                {!isUpdate ?
                    (<Box sx={{ marginTop: "20px", float: "right" }}>
                        <Button variant='contained' onClick={changeToUpdate}>Cập nhật trạng thái</Button>
                    </Box>) :
                    (
                        <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                            <Button variant='contained' color="primary" onClick={handleConfirm}>Xác nhận</Button>
                            <Button variant='contained' color="secondary" onClick={changeToUnUpdate} sx={{ marginLeft: "10px" }}>
                                Hủy
                            </Button>
                        </Box>)
                }
                 <ToastContainer />
            </Box>
           
        </Modal>
    );
};

// Style cho modal
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    width: 600,
    borderRadius: 2,
};

export default DetailOrderModal;

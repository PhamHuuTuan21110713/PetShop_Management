import { Box, Divider, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import myStyle from "./CommonNoitice.module.scss";
import { useEffect, useState } from "react";
import { OrderFetch, ProductFetch } from "~/REST_API_Client";
import { BookingFetch } from "~/REST_API_Client";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { NotifyFetch } from "~/REST_API_Client";
import { useAuth } from "~/components/Authentication/authentication";
const CommonNoitice = () => {
    const auth = useAuth();
    const [countOrder, setCountOrder] = useState(0)
    const [countBooking, setCountBooking] = useState(0);
    const [countProduct, setCountProduct] = useState(0)
    const [countNotify, setCountNotify] = useState(0);
    const [sort, setSort] = useState()
    const [filters, setFilters] = useState({
        status: null,
        month: "",
        year: 0,
        orderId: "",
    });
    const fetchNotification = () => {
        NotifyFetch.getNotify({receiverId: auth.user._id, isReading: false, type: "booking"})
            .then(data => {
                console.log("notify data: ", data.data);
                if(data.data.length > 0) {
                    setCountNotify(data.data.length)
                }
            })
            .catch(err => {
                console.log("err notify: ", err);
                toast.error("Lỗi lấy dữ liệu thông báo")
            })
    }

    const fetchProducts = async ( page, condition, sorting) => {
        //console.log("Fetching products with categoryId:", cateValue);
        try {
            const data = await ProductFetch.getAllProduct(page, sorting, filters, condition.limit);
            const dataFetch = data.data;
            console.log("data ddem", data.data);
            
            const lowStockProductsCount = dataFetch.products.filter(product => product.quantity < 5).length;
            setCountProduct(lowStockProductsCount); // Cập nhật sản phẩm
          
        } catch (error) {
          window.alert(`Error fetching products: \n${error.message}`);
        }
      };
    
      useEffect(() => {
        //fetchCategories(); // Fetch categories when the component mounts
    
        const condition = { page: 1, limit: 1000 }
        fetchProducts( 1, condition, sort);
    
    
    
      }, [ filters]);


    const fetchOrders = async (page = 1, limit,filters) => {
        try {
            console.log("Sending filters to API:", filters);
            const response = await OrderFetch.getAllOrder(page, limit, filters); // Lấy đơn hàng từ API
            console.log("du lieu ve", response);
            // Lấy danh sách đơn hàng từ API
            const fetchedOrders = response.data;

            // Tăng biến countOrder nếu trạng thái của đơn hàng là 'dxl'
            const dxlCount = fetchedOrders.filter(order => order.status === 'dxl').length;

            // Cập nhật biến countOrder
            setCountOrder(dxlCount);

            // Cập nhật danh sách đơn hàng
            //setOrders(fetchedOrders);
        } catch (error) {
            console.error("Lỗi khi lấy đơn hàng: ", error);
            window.alert("Lỗi khi lấy đơn hàng: " + error.message);
        }
    };
    useEffect(() => {
        fetchNotification();
    }, [])
    useEffect(() => {
        fetchOrders(1, 1000,filters); // Lấy đơn hàng khi trang hoặc bộ lọc thay đổi
    }, [filters]);

    useEffect(() => {
        const condition = {
            status: "dang-xac-nhan"
        }
        BookingFetch.getAll(undefined,condition, undefined)
            .then(data => {
                // console.log("list booking", data);
                if(data.data.length > 0) {

                    setCountBooking(data.data.length)
                }
            })
            .catch(err => {
                toast.error(`Lỗi lấy thông tin lịch dịch vụ \n${err}`);
            })
    },[])
    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>Thông báo chung</Typography>
            <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "auto" }}>
                <Box sx={{ display: "flex", gap: 3, padding: "20px" }}>
                    {/* Don dich vu */}
                    <NavLink className={myStyle.noticeItemContainer}>
                        <Box >
                            <Typography sx={{ fontSize: "1.1rem", fontWeight: "bold", textAlign: "center" }}>Lịch hẹn dịch vụ</Typography>
                            <Divider sx={{ marginY: "4px" }} />
                            <Typography>Bạn có <span style={{ color: "#de5945", fontWeight: "600" }}>{countBooking}</span> lịch chờ xác nhận</Typography>
                        </Box>
                    </NavLink>
                    {/* Tin nhắn */}
                    <NavLink className={myStyle.noticeItemContainer}>
                        <Box >
                            <Typography sx={{ fontSize: "1.1rem", fontWeight: "bold", textAlign: "center" }}>Thông báo mới</Typography>
                            <Divider sx={{ marginY: "4px" }} />
                            <Typography><span style={{ color: "#de5945", fontWeight: "600" }}>{countNotify} </span>Thông báo chờ phản hồi</Typography>
                        </Box>
                    </NavLink>
                    {/* đơn hàng */}
                    <NavLink className={myStyle.noticeItemContainer}>
                        <Box >
                            <Typography sx={{ fontSize: "1.1rem", fontWeight: "bold", textAlign: "center" }}>Đơn hàng</Typography>
                            <Divider sx={{ marginY: "4px" }} />
                            <Typography><span style={{ color: "#de5945", fontWeight: "600" }}>{countOrder} </span>Đơn hàng cần chờ xác nhận</Typography>
                        </Box>
                    </NavLink>
                    {/* Sản phẩm hết hàng */}
                    <NavLink className={myStyle.noticeItemContainer}>
                        <Box >
                            <Typography sx={{ fontSize: "1.1rem", fontWeight: "bold", textAlign: "center" }}>Sản phẩm</Typography>
                            <Divider sx={{ marginY: "4px" }} />
                            <Typography><span style={{ color: "#de5945", fontWeight: "600" }}>{countProduct} </span>Sản phẩm sắp hết hàng</Typography>
                        </Box>
                    </NavLink>
                </Box>
            </Box>
            <ToastContainer />
        </Box>
    )
}

export default CommonNoitice;
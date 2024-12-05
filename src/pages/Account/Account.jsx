import { Avatar, Box, Chip, Divider, Typography, Button, CircularProgress } from "@mui/material";
import myStyle from './Account.module.scss';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate, useParams } from "react-router-dom";
import BoughtOrders from "./BoughtOrders/BoughtOrders";
import ResgisteredServices from "./RegisterdService/ResgisteredServices";
import { useContext, useEffect, useState } from "react";
import { ChatFetch, UserFetch } from "~/REST_API_Client";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { ChatContext } from "../ChatProvider/ChatProvider";
import { useAuth } from "~/components/Authentication/authentication";
const Account = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const auth = useAuth();
    const [isLoading, setIsloading] = useState(false);
    const { createChat, updateCurrentChat, userChats, updateUserChats } = useContext(ChatContext);
    // console.log("create chat: ", createChat);
    const [user, setUser] = useState();
    const fetchData = () => {
        setIsloading(true);
        UserFetch.getById(id)
            .then(data => {
                setUser(data.data);
                // console.log("users: ", data.data);
                setIsloading(false);
            })
            .catch(err => {
                toast.error(`Lỗi lấy thông tin người dùng: \n${err}`);
            })
    }
    const handleChat = () => {

        ChatFetch.createChat(auth?.user._id, id)
            .then(data => {
                // console.log("create chat succesfull: ", data.message);
                // console.log("chat data: ", data.data);
                // console.log("data status: ", data.status);
                const isExistChat = userChats?.some((usc) => usc._id === data.data._id);
                console.log("isExít: ", isExistChat);
                if (isExistChat === false) {
                    updateUserChats([data.data, ...userChats])
                }
                updateCurrentChat(data.data);
                navigate('/chat')
            })
            .catch(err => {
                console.log("err create chat: ", err)
            })

    }
    useEffect(() => {
        fetchData();
    }, [])
    return (
        <Box>
            {
                !isLoading ? (
                    <>
                        {/* Avatar và tên, trạng thái */}
                        <Box sx={{ height: "100px", bgcolor: "#346792", borderRadius: "10px", position: "relative", display: "flex" }}>
                            <Box sx={{ position: "absolute", left: "50px", top: "50%", display: "flex", alignItems: "center", gap: 2 }}>
                                <Box sx={{ width: "100px", height: "100px", border: "solid 5px #fff", borderRadius: "50%" }}>
                                    <Avatar src={user?.avatar.preview} sx={{ width: "100%", height: "100%" }} />
                                </Box>
                                <Box >
                                    <Box sx={{ display: "flex", gap: 2 }}>
                                        <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold", color: "#fff" }}>{user?.name}</Typography>
                                        {
                                            user?.state === 1 ? <Chip size="small" sx={{ backgroundColor: "#81ebad" }} label="Hoạt động" />
                                                : <Chip size="small" sx={{ backgroundColor: "#e8809b" }} label="Bị khóa" />
                                        }
                                    </Box>
                                    <Typography sx={{ fontSize: "1.0rem", fontWeight: "bold", color: "#000" }}>{user?.role === "admin" ? "Quản trị" : "Người dùng"}</Typography>

                                </Box>
                                {
                                    id === auth.user._id ? null : <Box sx={{ transform: "translateY(50%)", marginTop: "10px" }}>
                                        <Button onClick={handleChat} sx={{ textTransform: "none" }} variant="contained" color="warning">Nhắn tin</Button>
                                    </Box>
                                }


                            </Box>
                            <Box sx={{ padding: "5px", display: "flex", gap: 3 }}>
                                <Box>
                                    <button
                                        style={{
                                            width: "30px", height: "30px", fontSize: "0.6rem", padding: 0, display: "flex", justifyContent: "center", alignItems: "center",
                                            border: "none", borderRadius: "50%", cursor: "pointer", backgroundColor: "#fff"
                                        }}
                                        onClick={() => navigate(-1)} >
                                        <ArrowBackIosIcon sx={{ color: "#346792" }} />
                                    </button>

                                </Box>
                            </Box>

                        </Box>

                        <Divider sx={{ marginTop: "60px", marginBottom: "20px" }} />

                        {/* Thôn tin cơ bản + Thoong tin khac */}
                        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                            {/* Co ban */}
                            <Box className={myStyle.colLeft}>
                                <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "10px", borderRadius: "8px" }}>
                                    <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem", textAlign: "center" }}>Thông tin cơ bản</Typography>
                                    <Divider sx={{ marginY: "20px" }} />
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                        <Box className={myStyle.inforItem}>
                                            <Typography className={myStyle.textInfor}>Email: </Typography>
                                            <Typography>{user?.email}</Typography>
                                        </Box>
                                        <Box className={myStyle.inforItem}>
                                            <Typography className={myStyle.textInfor}>Số điện thoại: </Typography>
                                            <Typography>{user?.phone}</Typography>
                                        </Box>
                                        <Box className={myStyle.inforItem}>
                                            <Typography className={myStyle.textInfor}>Địa chỉ: </Typography>
                                            <Typography>{user?.address}</Typography>
                                        </Box>

                                    </Box>
                                </Box>
                            </Box>
                            {/* Khac */}
                            <Box className={myStyle.colRight}>
                                <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "10px", borderRadius: "8px" }}>
                                    <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem", textAlign: "center" }}>Thông tin khác</Typography>
                                    <Divider sx={{ marginY: "20px" }} />
                                    <Box>
                                        {/* Gio hang */}
                                        <Box>
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                                                <Typography className={myStyle.textInfor}>Giỏ hàng: </Typography>
                                            </Box>
                                            <Box sx={{ maxHeight: "500px", overflowY: "auto" }}>
                                                {/* Gioir hang item */}
                                                {
                                                    user?.cart.map((prod, index) => {
                                                        return (
                                                            <Box key={index}
                                                                sx={{
                                                                    display: "flex", alignItems: "center", justifyContent: "flex-start",
                                                                    gap: 3, padding: "10px", boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;"
                                                                }}>
                                                                <Box sx={{ width: "80px", height: "80px", backgroundColor: "red" }}>
                                                                    <img src={prod?.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                                </Box>
                                                                <Box>
                                                                    <Typography>{prod.name}</Typography>
                                                                    <Typography>Giá: {prod.price}</Typography>
                                                                    <Typography>Số lượng: x{prod.quantity}</Typography>
                                                                </Box>
                                                            </Box>
                                                        )
                                                    })
                                                }


                                            </Box>
                                        </Box>
                                        <Divider sx={{ marginY: "10px" }} />
                                        {/* dia chi giao hang */}
                                        <Box>
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                                                <Typography className={myStyle.textInfor}>Địa chỉ giao hàng: </Typography>
                                            </Box>
                                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, maxHeight: "400px", overflowY: "auto" }}>
                                                {/* Item */}
                                                {
                                                    user?.shippingAddress.map((address, index) => {
                                                        return (
                                                            <Box
                                                                key={index}
                                                                sx={{
                                                                    boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;",
                                                                    padding: "20px", borderRadius: "4px", display: "flex", flexDirection: "column", gap: 1.5
                                                                }}>
                                                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "flex-start" }}>
                                                                    <Typography>Tên người nhận: {address.recipientName}</Typography>
                                                                    <Divider orientation="vertical" flexItem />
                                                                    <Typography>Số điện thoại: {address.recipientPhone}</Typography>
                                                                    {
                                                                        address.isDefault === true ? (
                                                                            <Box>
                                                                                <Typography sx={{ fontWeight: "bold", color: "#de5945" }}>Mặc định</Typography>
                                                                            </Box>
                                                                        ) : null
                                                                    }

                                                                </Box>
                                                                <Box>
                                                                    <Typography>Địa chỉ: {address.address}</Typography>
                                                                    <Typography>Ghi chú: {address.note}</Typography>
                                                                </Box>
                                                            </Box>
                                                        )
                                                    })
                                                }

                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </>
                ) :
                    (
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <CircularProgress />
                        </Box>
                    )
            }

            {/*Đơn hàng đã mua  */}
            <Box sx={{ marginTop: "20px" }}>
                <BoughtOrders userId={id} />
            </Box>

            {/*Dịch vụ đã đăng ký  */}
            <Box sx={{ marginTop: "20px" }}>
                <ResgisteredServices userId={id} />
            </Box>
            <ToastContainer />
        </Box>
    )
}

export default Account;
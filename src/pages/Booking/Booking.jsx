import { Box, Button, CircularProgress, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import { BookingFetch } from "~/REST_API_Client";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const Booking = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isUpdate, setIsUpdate] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState()
    const [booking, setBooking] = useState();
    const handleBackPrevPage = () => {
        navigate(-1);
    }
    const fetchData = () => {
        setIsLoading(true);
        BookingFetch.getById(id)
            .then(data => {
                setBooking(data.data);
                setStatus(data.data.status);
                setIsLoading(false);
            })
            .catch(err => {
                toast.error(`Lỗi lấy thông tin:\n${err}`)
                setIsLoading(false);
            })
    }
    useEffect(() => {
        fetchData()
    }, [])
    const handleChangeStatus = (e) => {
        setStatus(e.target.value)
    }
    const handleSubmit = () => {
        BookingFetch.upDate(id, {
            status: status
        })
            .then(data => {
                setIsUpdate(false)
                fetchData()
            })
            .catch(err => {
                toast.error(`Lỗi cập nhật\n${err}`)
            })
    }
    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
            </Box>
        )
    }
    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 0, cursor: "pointer" }} onClick={handleBackPrevPage}>
                <ArrowBackIosIcon />
                <Typography>Quay lại</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2, marginTop: "10px" }}>
                <Typography>Đơn hàng</Typography>

                <Typography><strong>{id}</strong></Typography>
                <Divider orientation="vertical" flexItem />
                {
                    isUpdate ? <FormControl sx={{ width: "500px" }}   >
                        <NativeSelect
                            value={status} onChange={handleChangeStatus}
                        // defaultValue={30}
                        // inputProps={{
                        //     name: 'age',
                        //     id: 'uncontrolled-native',
                        // }}
                        >
                            <option value="dang-xac-nhan" >Đang xác nhận</option>
                            <option value={"da-xac-nhan"}>Đã xác nhận</option>
                            <option value={"hoan-thanh"}>Hoàn thành</option>
                            <option value={"da-huy"}>Hủy</option>
                        </NativeSelect>
                    </FormControl>
                        :
                        <>
                            {
                                status === "dang-xac-nhan" ? <Typography sx={{ fontWeight: "bold", color: "#de5945" }}>Cần xác nhận</Typography> :
                                    (status === "da-xac-nhan" ? <Typography sx={{ fontWeight: "bold", color: "#31a24c" }}>Đã xác nhận</Typography> :
                                        (status === "hoan-thanh" ? <Typography sx={{ fontWeight: "bold", color: "#31a24c" }}>Hoàn thành</Typography> :
                                            status === "da-huy" ? <Typography sx={{ fontWeight: "bold", color: "#606770" }}>Đã hủy</Typography> : null
                                        )
                                    )
                            }
                        </>
                }

            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2, marginTop: "10px" }}>
                <Typography>Khách đặt:</Typography>
                <Typography>{booking.userId}</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2, marginTop: "10px" }}>
                <Typography>Dịch vụ:</Typography>
                <Typography>{booking.serviceId}</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2, marginTop: "10px" }}>
                <Typography>Ngày thực hiện:</Typography>
                <Typography>{new Date(booking.bookingDate).toLocaleDateString("vi-VN")}</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2, marginTop: "10px" }}>
                <Typography>Thời gian thực hiện:</Typography>
                <Typography>{booking.bookingTime}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2, marginTop: "10px" }}>
                <Typography>Cân nặng thú:</Typography>
                <Typography>{booking.petWeight}kg</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2, marginTop: "10px" }}>
                <Typography>Mô tả thú:</Typography>
                <Typography>{booking.detailPet}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2, marginTop: "10px" }}>
                <Typography>Ghi chú:</Typography>
                <Typography>{booking.note}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2, marginTop: "10px" }}>
                <Typography>Giá trị:</Typography>
                <Typography>{booking.totalPrice.toLocaleString("vi-VN")}đ</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2, marginTop: "10px" }}>

                {
                    !isUpdate ?
                        <Button onClick={() => setIsUpdate(true)} variant="contained" sx={{ textTransform: "none" }}>Cập nhật</Button>
                        :
                        <>
                            <Button onClick={() => { setIsUpdate(false) }} variant="contained" color="warning" sx={{ textTransform: "none" }}>Hủy</Button>
                            <Button onClick={() => handleSubmit()} variant="contained" color="success" sx={{ textTransform: "none" }}>Xác nhận</Button>
                        </>

                }
            </Box>
            <ToastContainer />
        </Box>
    )
}

export default Booking;
import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import { ServiceFetch } from "~/REST_API_Client";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const Summary = ({ value,onChange, data }) => {
    const [isLoading, setIsLoading] = useState(false);
    const handlePrev = () => {
        onChange(value - 1, data)
    }
    const handleCreate = () => {
        setIsLoading(true);
        console.log("Data create: ", data)
        ServiceFetch.create(data)
            .then(data => {
                toast.success("Tạo dịch vụ thành công");
                
                setTimeout(() => {
                    setIsLoading(false);
                    onChange(1, {
                        name: "",
                        description: [],
                        price: [],
                        procedures: [],
                        applicableBranches: [],
                    })
                },1500)
               
            })
            .catch(err => {
                console.log("Loi dich vu: ",err)
                toast.error(`Lỗi tạo dịch vụ: \n${err}`);
                setIsLoading(false);
            })
    }
    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }} >Xem lại thông tin</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box >
                    <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>Tên dịch vụ: </Typography>
                    <Box sx={{ paddingLeft: "20px" }}>
                        <Typography>{data.name}</Typography>
                    </Box>
                </Box>
                <Box >
                    <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>Chi nhánh áp dụng:</Typography>
                    <Box sx={{ paddingLeft: "20px" }}>
                        {
                            data.applicableBranches.map((address, index) => {
                                return (
                                    <Typography key={index}>{address}</Typography>
                                )
                            })
                        }

                    </Box>
                </Box>
                <Box >
                    <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>Mô tả:</Typography>
                    {/* lap */}
                    <Box sx={{ paddingLeft: "20px" }}>
                        {
                            data.description.map((desc, index) => {
                                return (
                                    <Box key={index}>
                                        <Typography sx={{ fontWeight: "bold" }}>{desc.heading}</Typography>
                                        {/* lap */}
                                        <Box sx={{ paddingLeft: "20px" }}>
                                            {
                                                desc.content.map((cont, idx) => {
                                                    return (
                                                        <Typography key={idx}>{cont}</Typography>
                                                    )
                                                })
                                            }
                                        </Box>
                                    </Box>

                                )
                            })
                        }


                    </Box>
                </Box>
                <Box >
                    <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>Bảng giá:</Typography>
                    <Box sx={{ paddingLeft: "20px" }}>
                        {/* lap o day */}
                        {
                            data.price.map((pri, idx) => {
                                return (
                                    <Box key={idx} sx={{ display: "flex", gap: 2 }}>

                                        <Typography ><strong>Khối lượng: </strong>{"<"} {pri.maxWeight}kg</Typography>
                                        <Typography ><strong>Giá: </strong>{pri.value.toLocaleString('vi-VN')}đ</Typography>
                                        <Typography ><strong>Đơn vị tính tiền: </strong>{pri.billingUnit}</Typography>

                                    </Box>
                                )
                            })
                        }

                    </Box>
                </Box>
                <Box >
                    <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>Quy trình:</Typography>
                    <Box sx={{ paddingLeft: "20px" }}>
                        {/* lap o day */}
                        {
                            data.procedures.map((proce, idx) => {
                                return (
                                    <Box key={idx} sx={{ display: "flex", gap: 2 }}>
                                        <Typography ><strong>Số thứ tự: </strong>{proce.serial}</Typography>
                                        <Typography ><strong>Tổng quan: </strong>{proce.summary}</Typography>
                                        <Typography ><strong>Chi tiết: </strong>{proce.detail}</Typography>
                                    </Box>
                                )
                            })
                        }

                    </Box>
                </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button onClick={handlePrev} variant="contained">Quay về</Button>
                <Button disabled={isLoading} onClick={handleCreate} variant="contained">Tạo</Button>
            </Box>
            <ToastContainer />
        </Box>
    )
}

export default Summary;
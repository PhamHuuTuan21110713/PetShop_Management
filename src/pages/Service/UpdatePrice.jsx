import { Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { ServiceFetch } from "~/REST_API_Client";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const UpdatePrice = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [prices, setPrices] = useState(location.state.price);
    console.log("re-rendering Update price service")
    const [standPrice, setStandPrice] = useState({
        maxWeight: 0,
        value: 0,
        billingUnit: ""
    })
    const handleBack = () => {
        navigate(-1);
    }
    const handleSubmit = () => {
        if (prices.length > 0) {
            ServiceFetch.update(location.state._id, {
                price: prices
            })
                .then(data => {
                    toast.success("Cập nhật thông tin thành công");
                    navigate(-1)
                })
                .catch(err => {
                    toast.error(`Lỗi cập nhật thông tin dịch vụ: \n${err}`);
                }
                )
        }
    }
    const handleChangeWeight = (e, index) => {
        if (!isNaN(e.target.value)) {
            const newPrices = [...prices];
            newPrices[index].maxWeight = e.target.value;
            setPrices(newPrices);
        }
    }
    const handleChangePrice = (e, index) => {
        if (!isNaN(e.target.value)) {
            const newPrices = [...prices];
            newPrices[index].value = e.target.value;
            setPrices(newPrices);
        }
    }
    const handleChangeUnit = (e, index) => {
        const newPrices = [...prices];
        newPrices[index].billingUnit = e.target.value;
        setPrices(newPrices);
    }
    const handleChangeStandWeight = (e) => {
        if (!isNaN(e.target.value)) {
            const newStandPrice = { ...standPrice };
            newStandPrice.maxWeight = e.target.value;
            setStandPrice(newStandPrice);
        }

    }
    const handleChangeStandValue = (e) => {
        if (!isNaN(e.target.value)) {
            const newStandPrice = { ...standPrice };
            newStandPrice.value = e.target.value;
            setStandPrice(newStandPrice);
        }
    }
    const handleChangeStandUnit = (e) => {
        const newStandPrice = { ...standPrice };
        newStandPrice.billingUnit = e.target.value;
        setStandPrice(newStandPrice);
    }
    const handleRemovePrice = (index) => {
        const newPrices = [...prices];
        newPrices.splice(index, 1);
        setPrices(newPrices);
    }
    const handleAddPrice = () => {
        if (standPrice.maxWeight !== 0 && standPrice.value !== 0 && standPrice.billingUnit !== "") {
            const newPrices = [...prices];
            newPrices.push(standPrice)
            setPrices(newPrices);
            setStandPrice({
                maxWeight: 0,
                value: 0,
                billingUnit: ""
            })
        }
    }
    return (
        <Box>
            <Box>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>Thêm bảng giá</Typography>
                </Box>
                {/* Price Item */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {
                        prices.length > 0 && (
                            prices.map((price, index) => {
                                return (
                                    <Box key={index} sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "20px" }}>
                                        <Box>
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                <Typography>Cân nặng tối đa (kg)</Typography>
                                                <input onChange={(e) => handleChangeWeight(e, index)} value={price.maxWeight} style={{ height: "40px", width: "300px" }} type="text" />
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px" }}>
                                                <Typography>Giá tiền (đ)</Typography>
                                                <input onChange={(e) => handleChangePrice(e, index)} value={price.value} style={{ height: "40px", width: "300px" }} type="text" />
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px" }}>
                                                <Typography>Đơn vị tính tiền</Typography>
                                                <input onChange={(e) => handleChangeUnit(e, index)} value={price.billingUnit} style={{ height: "40px", width: "300px" }} type="text" />
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
                                            <Button onClick={() => handleRemovePrice(index)} variant="contained" color="error" sx={{ textTransform: "none" }}>Xóa</Button>
                                        </Box>
                                    </Box>
                                )
                            })
                        )
                    }

                </Box>
                {/* Thêm mới */}
                <Box sx={{ marginTop: "10px" }}>
                    <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "20px" }}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem", marginBottom: "10px" }}>Thêm giá trị mới</Typography>
                            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                                <Typography>Cân nặng tối đa (kg)</Typography>
                                <input value={standPrice.maxWeight} onChange={handleChangeStandWeight} style={{ height: "40px", width: "300px" }} type="text" />
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", marginTop: "10px" }}>
                                <Typography>Giá tiền (đ)</Typography>
                                <input value={standPrice.value} onChange={handleChangeStandValue} style={{ height: "40px", width: "300px" }} type="text" />
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", marginTop: "10px" }}>
                                <Typography >Đơn vị tính tiền</Typography>
                                <input onChange={handleChangeStandUnit} value={standPrice.billingUnit} style={{ height: "40px", width: "300px" }} type="text" />
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                    <Button onClick={handleAddPrice} variant="contained">Thêm giá</Button>
                </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button color="warning" variant="contained" onClick={handleBack}>Hủy</Button>
                <Button color="success" variant="contained" onClick={handleSubmit}>Cập nhật</Button>

            </Box>
            <ToastContainer />
        </Box>
    )
}

export default UpdatePrice;
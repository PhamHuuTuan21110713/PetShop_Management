import { Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { ServiceFetch } from "~/REST_API_Client";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const UpdateProcedure = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [procedures, setProcedures] = useState(location.state.procedures);
    const [standProcedure, setStandProcedure] = useState({
        summary: "",
        detail: ""
    })
    console.log("re-rendering update procedure services")
    const handleBack = () => {
        navigate(-1);
    }
    const handleNext = () => {
        if (procedures.length > 0) {
            ServiceFetch.update(location.state._id, {
                procedures: procedures
            })
                .then(data => {
                    toast.success("Cập nhật thông tin dịch vụ thành công");
                    navigate(-1);
                })
                .catch(err => {
                    toast.error(`Lỗi cập nhật thông tin dịch vụ: \n${err}`);
                }
                )
        }
    }
    const handleChangeSumary = (e, index) => {
        const newProcedures = [...procedures];
        newProcedures[index].summary = e.target.value;
        setProcedures(newProcedures);
    }
    const handleChangeDetail = (e, index) => {
        const newProcedures = [...procedures];
        newProcedures[index].detail = e.target.value;
        setProcedures(newProcedures);
    }
    const handleRemoveProcedure = (index) => {
        const newProcedures = [...procedures];
        newProcedures.splice(index, 1);
        const length = newProcedures.length;
        for (let i = 0; i < length; i++) {
            newProcedures[i].serial = i + 1;
        }
        setProcedures(newProcedures);
    }
    const handleChangeStandSummary = (e) => {
        const newStand = { ...standProcedure };
        newStand.summary = e.target.value;
        setStandProcedure(newStand);
    }
    const handleChangeStandDetail = (e) => {
        const newStand = { ...standProcedure };
        newStand.detail = e.target.value;
        setStandProcedure(newStand);
    }
    const handleAddProcedure = () => {
        if (standProcedure.summary !== "" && standProcedure.detail !== "") {
            const newStand = { ...standProcedure };
            newStand.serial = procedures.length + 1;
            const newProcedures = [...procedures];
            newProcedures.push(newStand);
            setStandProcedure({
                summary: "",
                detail: ""
            })
            setProcedures(newProcedures);
        }
    }
    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Quy trình thực hiện</Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {
                    procedures.length > 0 && (
                        procedures.map((procedure, index) => {
                            return (
                                <Box key={index} sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "20px" }}>
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <Box>
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                <Typography> Thứ tự: </Typography>
                                                <Typography>{procedure.serial}</Typography>
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px", gap: 2 }}>
                                                <Typography>Tổng quan</Typography>
                                                <input onChange={(e) => handleChangeSumary(e, index)} value={procedure.summary} style={{ height: "40px", width: "300px" }} type="text" />
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px", gap: 2 }}>
                                                <Typography >Chi tiết</Typography>
                                                <input onChange={(e) => handleChangeDetail(e, index)} value={procedure.detail} style={{ height: "40px", width: "300px" }} type="text" />
                                            </Box>
                                        </Box>
                                        <Box sx={{ marginTop: "10px", alignSelf: "flex-end" }}>
                                            <Button onClick={() => handleRemoveProcedure(index)} variant="contained" color="error" sx={{ textTransform: "none" }}>Xóa</Button>
                                        </Box>
                                    </Box>
                                </Box>
                            )
                        })
                    )
                }

            </Box>
            <Box sx={{ marginTop: "10px", boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "20px" }}>
                <Typography sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.2rem", marginBottom: "10px" }}>Thêm bước mới</Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1, justifyContent: "center" }}>
                        <Typography><strong>Số thứ tự:</strong></Typography>
                        <Typography>{procedures.length + 1}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
                        <Typography>Tổng quan</Typography>
                        <input value={standProcedure.summary} onChange={handleChangeStandSummary} type="text" style={{ height: "40px", width: "300px" }} />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
                        <Typography>Chi tiết</Typography>
                        <input value={standProcedure.detail} onChange={handleChangeStandDetail} type="text" style={{ height: "40px", width: "300px" }} />
                    </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button onClick={handleAddProcedure} variant="contained" sx={{ textTransform: "none", marginTop: '10px' }} >Thêm bước </Button>
                </Box>

            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "10px", gap: 2 }}>
                <Button color="warning" variant="contained" sx={{ textTransform: "none" }} onClick={handleBack}>Hủy</Button>
                <Button color="success" variant="contained" sx={{ textTransform: "none" }} onClick={handleNext}>Cập nhật</Button>

            </Box>
            <ToastContainer />
        </Box>
    )
}

export default UpdateProcedure;
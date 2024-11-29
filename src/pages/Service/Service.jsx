import { Box, Button, CircularProgress, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { ServiceFetch } from "~/REST_API_Client";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const Service = () => {
    const { id } = useParams();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [service, setService] = useState();
    const [isUpdateBase, setIsUpdateBase] = useState(false);
    const [isUpdateDesctiptions, setIsUpdateDesctiptions] = useState(false);
    const [isUpdatePrice, setIsUpdatePrice] = useState(false);
    const [isUpdateProcedure, setIsUpdateProcedure] = useState(false);
    const [isMonitoring, setIsMonitoring] = useState(false);
    console.log("rerender service items")
    const navigate = useNavigate();
    const fetchDdata = () => {
        setLoading(true)
        ServiceFetch.getById(id)
            .then(data => {
                setService(data.data);
                setLoading(false)
            })
            .catch(err => {
                toast.error(`Lỗi lấy thông tin dịch vụ: \n${err}`);
                setLoading(false)
            })
    }
    useEffect(() => {
        // console.log("re-render");
        const pathSegments = location.pathname.split("/").filter(Boolean); // Tách các segment và loại bỏ segment rỗng
        const lastSegment = pathSegments[pathSegments.length - 1];
        // console.log("last-eseg: ", lastSegment);
        const isId = lastSegment.length === 24;
        if (isId) {
            // console.log("reftch data");
            setIsUpdateBase(false);
            setIsUpdateDesctiptions(false);
            setIsUpdatePrice(false);
            setIsUpdateProcedure(false);
            setIsMonitoring(false);
            fetchDdata()
        }

    }, [location.pathname])

    const handleBackPrevPage = () => {
        navigate('/quan-ly-dich-vu');
    }

    const handleUpdateBaseInfor = () => {
        setIsUpdateBase(true);
        navigate('co-ban', {
            state: {
                _id: id,
                name: service.name,
                applicableBranches: service.applicableBranches
            }
        });
    }

    const handleUpdateDescriptions = () => {
        setIsUpdateDesctiptions(true);
        navigate('mo-ta', {
            state: {
                _id: id,
                description: service.description
            }
        })
    }

    const updatePrice = () => {
        setIsUpdatePrice(true);
        navigate('bang-gia', {
            state: {
                _id: id,
                price: service.price
            }
        })
    }

    const handleUpdateProcedure = () => {
        setIsUpdateProcedure(true);
        navigate('quy-trinh',{
            state: {
                _id: id,
                procedures: service.procedures
            }
        } );
    }

    const handleMonitoring = () => {
        setIsMonitoring(true);
        navigate("giam-sat",{
            state: {
                _id: id,
                name: service.name
            }
        });
    }

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
            </Box>
        )
    }
    if(isMonitoring) {
        return(
            <Box>
                <Outlet />
            </Box>
        )
    }
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* ID */}
            <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 4 }} >
                <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 0,cursor: "pointer" }} onClick={handleBackPrevPage}>
                    <ArrowBackIosIcon />
                    <Typography>Quay lại</Typography>
                </Box>
                <Typography>ID dịch vụ: <strong>{id}</strong></Typography>
                <Box>
                    <Typography sx={{textDecoration:"underline", cursor:"pointer", color:"red"}} onClick={handleMonitoring}>Giám sát</Typography>
                </Box>
            </Box>
            {/* Thon tin co ban */}
            {
                isUpdateBase ? (
                    <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "20px" }}>
                        <Outlet />
                    </Box>
                ) :
                    (
                        <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "20px", position: "relative" }}>
                            <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>Thông tin cơ bản</Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                <Box>
                                    <Typography sx={{ fontSize: "1.2rem" }}>Tên dịch vụ: <strong>{service.name}</strong></Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: "1.2rem" }}>Chi nhánh áp dụng:</Typography>
                                    <Box sx={{ paddingLeft: '20px' }}>
                                        {
                                            service.applicableBranches.map((address, index) => {
                                                return (
                                                    <Typography key={index}>{address.address}</Typography>
                                                )
                                            })
                                        }

                                    </Box>
                                </Box>
                            </Box>
                            <Box>
                                <Button variant="contained" color="warning"
                                    onClick={handleUpdateBaseInfor}
                                    sx={{ textTransform: "none", position: "absolute", right: 0, top: 0 }}>
                                    Cập nhật
                                </Button>
                            </Box>
                        </Box>
                    )
            }


            {/* Mo ta */}
            {
                isUpdateDesctiptions ? (
                    <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "20px" }}>
                        <Outlet />
                    </Box>
                ) :
                    (
                        <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "20px", position: "relative" }}>
                            <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>Mô tả dịch vụ</Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                {
                                    service.description.map((des, index) => {
                                        return (
                                            <Box key={index} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>

                                                <Box>
                                                    <Typography sx={{ fontSize: "1.2rem" }}>Tiêu đề: <strong>{des.heading}</strong></Typography>
                                                </Box>
                                                <Box sx={{ paddingLeft: "20px" }}>
                                                    <Typography sx={{ fontSize: "1.2rem" }}>Nội dung</Typography>
                                                    {/* Lặp */}
                                                    <Box sx={{ paddingLeft: '20px' }}>
                                                        {
                                                            des.content.map((cont, idx) => {
                                                                return (
                                                                    <Typography key={idx}>{cont}</Typography>
                                                                )
                                                            })
                                                        }
                                                    </Box>
                                                </Box>
                                            </Box>
                                        )
                                    })
                                }
                            </Box>
                            <Box>
                                <Button variant="contained" color="warning"
                                    onClick={handleUpdateDescriptions}
                                    sx={{ textTransform: "none", position: "absolute", right: 0, top: 0 }}>
                                    Cập nhật
                                </Button>
                            </Box>
                        </Box>
                    )
            }


            {/* bang gia */}
            {
                isUpdatePrice ? <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "20px" }}>
                    <Outlet />
                </Box> :
                    (
                        <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "20px", position: "relative" }}>
                            <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>Bảng giá</Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                {/* lawpj */}
                                {
                                    service.price.map((pric, index) => {
                                        return (
                                            <Box key={index} sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                                                <Typography>Cân nặng tối đa: <strong>{pric.maxWeight}</strong>kg</Typography>
                                                <Divider orientation="vertical" flexItem />
                                                <Typography>Giá trị dịch vụ: <strong>{pric.value.toLocaleString('vi-VN')}đ</strong></Typography>
                                                <Divider orientation="vertical" flexItem />
                                                <Typography>Đơn vị tính phí: <strong>/{pric.billingUnit}</strong></Typography>
                                            </Box>
                                        )
                                    })
                                }

                            </Box>

                            <Box>
                                <Button variant="contained" color="warning"
                                    onClick={updatePrice}
                                    sx={{ textTransform: "none", position: "absolute", right: 0, top: 0 }}>
                                    Cập nhật
                                </Button>
                            </Box>
                        </Box>
                    )
            }


            {/* Qui trinh */}
            {
                isUpdateProcedure ? <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "20px" }}>
                    <Outlet />
                </Box> :
                    (
                        <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "20px", position: "relative" }}>
                            <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>Quy trình thực hiện</Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                {/* lawpj */}
                                {
                                    service.procedures.map((proce, index) => {
                                        return (
                                            <Box key={index} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                                <Typography><strong>Số thứ tự:</strong>{proce.serial}</Typography>
                                                <Typography><strong>Tổng quan:</strong> {proce.summary}</Typography>
                                                <Typography><strong>Chi tiết:</strong> {proce.detail}</Typography>
                                            </Box>
                                        )
                                    })
                                }

                            </Box>

                            <Box>
                                <Button variant="contained" color="warning"
                                    onClick={handleUpdateProcedure}
                                    sx={{ textTransform: "none", position: "absolute", right: 0, top: 0 }}>
                                    Cập nhật
                                </Button>
                            </Box>
                        </Box>
                    )
            }
            <ToastContainer />
        </Box>
    )
}

export default Service;
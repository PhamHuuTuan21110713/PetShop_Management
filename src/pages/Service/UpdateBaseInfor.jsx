import { Box, Button, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ServiceFetch, ShopFetch } from "~/REST_API_Client";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const UpdateBaseInfor = () => {
    const location = useLocation();
    const [originData, setOriginData] = useState(location.state);
    const [addresses, setAddresses] = useState([]);
    const navigate = useNavigate();
    const rootData = useRef(location.state);
    console.log("re-rendering Update Base infor service")
    const [applicableBranches, setApplicableBranches] = useState(() => {
        return location.state.applicableBranches.map((add, index) => {
            return add._id
        })
    })
    const fetchAddress = () => {
        ShopFetch.getInfo()
            .then(data => {
                // console.log("shop: ", data);
                setAddresses(data.data.branches);
            })
            .catch(err => {
                // console.log("err: ", err);
                toast.error(`Lỗi lấy thông tin cửa hàng: \n${err}`)
            })
    }
    useEffect(() => {
        fetchAddress();
    }, [])
    const handleChangeAddresses = (event, id) => {
        if (event.target.checked) {

            const news = [...applicableBranches];
            news.push(id);
            setApplicableBranches(news);
        } else {

            const news = applicableBranches.filter(item => item !== id);;
            setApplicableBranches(news);
        }
    };
    // console.log("chi nhanh ap dung: ", applicableBranches);
    const handleChangeName = (e) => {
        const reData = { ...originData };
        reData.name = e.target.value;
        setOriginData(reData);
    }
    const changeToRootData = () => {
        navigate(-1);
    }
    const submitData = () => {
        if (applicableBranches.length > 0 && originData.name !== "") {
            ServiceFetch.update(location.state._id, {
                name: originData.name,
                applicableBranches: applicableBranches
            })
                .then(data => {
                    toast.success("Cập nhật thành công")
                    navigate(-1);
                })
                .catch(err => {
                    toast.error(`Cập nhật thất bại: \n${err}`)
                })
        }

    }
    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                <Typography>Tên dịch vụ: </Typography>
                <input value={originData.name} onChange={(e) => handleChangeName(e)} type='text' style={{ width: "300px", height: "40px" }} />
            </Box>
            <Box>
                <Typography>Chi nhánh áp dụng: </Typography>
                <Box>
                    {
                        addresses.length > 0 && addresses.map((address, index) => {
                            return (
                                <FormControlLabel
                                    key={index}
                                    label={address.address}
                                    control={<Checkbox
                                        checked={applicableBranches.includes(address._id)}
                                        onChange={(e) => handleChangeAddresses(e, address._id)}
                                    />}
                                />
                            )

                        })
                    }
                </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button onClick={changeToRootData} variant='contained' color='warning' sx={{ textTransform: "none" }}>Hủy</Button>
                <Button onClick={submitData} variant='contained' color='success' sx={{ textTransform: "none" }}>Cập nhật</Button>
            </Box>
            <ToastContainer />
        </Box>
    )
}

export default UpdateBaseInfor;
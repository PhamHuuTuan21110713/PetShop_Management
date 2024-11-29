import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ShopFetch } from "~/REST_API_Client";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const AddNamePage = ({ onChange, value, data }) => {
    const [name, SetName] = useState(data.name);
    const [addresses, setAddresses] = useState([]);
    const [applicableBranches, setApplicableBranches] = useState(data.applicableBranches)
    const handleChangeAddresses = (event, id, index) => {
        if(event.target.checked) {
          
            const news = [...applicableBranches];
            news.push(id);
            setApplicableBranches(news);
        } else {
           
            const news = applicableBranches.filter(item => item !== id);;
            setApplicableBranches(news);
        }
    };
    const handleNext = () => {
        if(name !== "" && applicableBranches.length > 0) {
            const reData = {...data};
            reData.applicableBranches = applicableBranches;
            reData.name = name
            onChange(value + 1, reData);
        }
    }
    useEffect(() => {
        fetchAddress();
    }, [])
    const fetchAddress = () => {
        ShopFetch.getInfo()
            .then(data => {
                // console.log("shop: ", data);
                setAddresses(data.data.branches);
            })
            .catch(err => {
                console.log("err: ", err);
                toast.error(`Lỗi lấy thông tin cửa hàng: \n${err}`)
            })
    }
    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>Thêm tên và chi nhánh áp dụng</Typography>
            </Box>
            <Box>
                <Typography sx={{ fontWeight: "bold", fontSize: '1.2rem' }}>Tên dịch vụ</Typography>
                <Box>
                    <input style={{ height: '40px', width: "400px" }} value={name} onChange={(e) => SetName(e.target.value)} />
                </Box>
            </Box>
            <Box>
                <Typography sx={{ fontWeight: "bold", fontSize: '1.2rem' }}>Địa chỉ áp dụng</Typography>
                <Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                        {
                            addresses && addresses.length > 0 &&
                            (
                                addresses.map((address, index) => {
                                    return (
                                        <FormControlLabel
                                            key={index}
                                            label= {address.address}
                                            control={<Checkbox checked={applicableBranches.includes(address._id)} onChange={(e) => handleChangeAddresses(e, address._id, index)} />}
                                        />
                                    )
                                })
                            )
                        }

                    </Box>
                </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                <Button variant="contained" onClick={handleNext}>Tiếp</Button>
            </Box>
            <ToastContainer />
        </Box>
    )
}

export default AddNamePage;
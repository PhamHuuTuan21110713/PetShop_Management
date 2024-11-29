import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { BookingFetch, ServiceFetch } from "~/REST_API_Client";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};
const guestID = "6749e6c187bcce470fc79877";
const AddBooking = () => {
    const [services, setServices] = useState();
    const [applicableBraches, setApplicableBranches] = useState();
    const [selectedBranch, setSelectedBranch] = useState();
    const [selectedService, setSelectedService] = useState();
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [selectedTime, setSeletedTime] = useState(getCurrentTime());
    const [weightPet, setWeightPet] = useState(2);
    const [prices, setPrices] = useState();
    const [openDialog, setOpenDialog] = useState(false);
    const [weightAlert, setWeightAlert] = useState(false);
    // const [addressSelected, setAddressSelected] = useState(addresses[0].address);
    const [detailPet, setDetailPet] = useState("");
    const [note, setNote] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState()
    function getTotalPrice(value,prices) {
        if (prices) {
            const sortedPrices = prices.sort((a, b) => a.maxWeight - b.maxWeight);
            const priceObj = sortedPrices.find(price => value <= price.maxWeight);
            return priceObj ? priceObj.value : null;
        }

    }
    const handleSubmit = () => {
        if (weightPet === "" || parseFloat(weightPet) > prices.slice(-1)[0].maxWeight || weightPet < 0) {
            setWeightAlert(true);
            return;
        }
        const sendData = {
            userId: guestID,
            serviceId: selectedService,
            bookingDate: selectedDate,
            bookingTime: selectedTime,
            address: selectedBranch,
            petWeight: weightPet,
            detailPet: detailPet,
            note: note,
            totalPrice: totalPrice
        }
        BookingFetch.createNew(sendData)
            .then(data => 
                toast.success("Đặt lịch thành công")
            ).catch(err => {
                toast.error(`Lỗi đặt lịch:\n${err}`)
            })
        setWeightPet(2);
        setDetailPet("");
        setNote("");
        setTotalPrice(getTotalPrice(2,prices))
    }
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    const getDetailService = (id) => {
        ServiceFetch.getById(id)
            .then(data => {
                console.log("service detail: ", data);
                setApplicableBranches(data.data.applicableBranches);
                setSelectedBranch(data.data.applicableBranches[0].address)
                setPrices(data.data.price);
                setTotalPrice(getTotalPrice(weightPet,data.data.price))
            })
            .catch(err => {
                console.log("Loi lay thong tin chi tiet:", err);
            })
    }
    useEffect(() => {
        setIsLoading(true)
        ServiceFetch.get(undefined, { state: true }, undefined)
            .then(data => {
                console.log("data service: ", data);
                setServices(data.data);
                setSelectedService(data.data[0]._id);
                getDetailService(data.data[0]._id);
                
                setIsLoading(false);
            })
            .catch(err => {
                toast.error(`Lỗi \n${err}`)
                setIsLoading(false);
            })
    }, []);
    // console.log("selected service: ", selectedService);
    // console.log("Selected branch: ", selectedBranch);
    // console.log("price: ", prices);
    const handleChangeService = (e) => {
        setSelectedService(e.target.value);
        getDetailService(e.target.value)
    }
    const handleChangeSelectBranch = (e) => {
        setSelectedBranch(e.target.value)
    }
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };
    const handleSetTime = (e) => {
        setSeletedTime(e.target.value);
    }
    const handleSetWeightPet = e => {
        if (weightAlert) {
            setWeightAlert(false);
        }
        if (isNaN(Number(e.target.value))) {
            setWeightPet('');
            handleOpenDialog();
            return;
        }
        setWeightPet(e.target.value);
        setTotalPrice(getTotalPrice(parseFloat(e.target.value),prices))
    }
    const handleCloseDialog = (value) => {
        setOpenDialog(false);
    };
    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
            </Box>
        )
    }
    return (

        <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>Thêm lịch đặt mới</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                {/* Dich vu */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                    <Typography sx={{ minWidth: "200px" }}>Dịch vụ: </Typography>
                    <FormControl sx={{ width: "500px" }} value={selectedService} onChange={handleChangeService}>
                        <InputLabel variant="standard" htmlFor="uncontrolled-native">
                            Dịch vụ
                        </InputLabel>
                        <NativeSelect
                            defaultValue={30}
                            inputProps={{
                                name: 'age',
                                id: 'uncontrolled-native',
                            }}
                        >
                            {
                                services.map((service, index) => {
                                    return (
                                        <option key={index} value={service._id}>{service.name}</option>
                                    )
                                })
                            }

                        </NativeSelect>
                    </FormControl>
                </Box>

                {/* Chi nhanh */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                    <Typography sx={{ minWidth: "200px" }}>Chi nhánh: </Typography>
                    <FormControl sx={{ width: "500px" }} value={selectedBranch} onChange={handleChangeSelectBranch}>
                        {/* <InputLabel variant="standard" htmlFor="uncontrolled-native">
                            Chi nhánh
                        </InputLabel> */}
                        <NativeSelect
                            defaultValue={30}
                            inputProps={{
                                name: 'age',
                                id: 'uncontrolled-native',
                            }}
                        >
                            {
                                applicableBraches?.map((branch, index) => {
                                    return (<option key={index} value={branch.address}>{branch.address}</option>)
                                })
                            }
                        </NativeSelect>
                    </FormControl>
                </Box>

                {/* ngày đặt */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                    <Box>
                        <Typography sx={{ minWidth: "200px" }}>Ngày thực hiện: </Typography>
                        <Typography>(Tháng/Ngày/Năm)</Typography>
                    </Box>
                    <TextField id="date" value={selectedDate} onChange={handleDateChange} type="date" sx={{ width: 220 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Box>

                {/* Giờ đặt */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                    <Typography sx={{ minWidth: "200px" }}>Thời gian bắt đầu: </Typography>
                    <TextField id="time" type="time" value={selectedTime}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                        sx={{ width: 220 }}
                        onChange={handleSetTime}
                    />
                </Box>

                {/* Cân anwngj thú cưng */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                    <Typography sx={{ minWidth: "200px" }}>Cân nặng thú cưng: </Typography>
                    <Box>
                        <OutlinedInput sx={{ width: 220 }}
                            id="outlined-adornment-weight"
                            endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                                'aria-label': 'weight',
                            }}
                            value={weightPet}
                            onChange={handleSetWeightPet}
                        />
                        {weightAlert && <Typography sx={{ color: "red", fontWeight: "bold", fontSize: "0.7rem" }}>Xin lỗi, chúng tôi không hỗ trợ cân nặng này</Typography>}
                    </Box>
                </Box>

                {/* Chi tiết thú cưng */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                    <Typography sx={{ minWidth: "200px" }}>Chi tiết thêm về thú cưng: </Typography>
                    <TextField sx={{ width: "400px" }}
                        id="outlined-multiline-flexible"
                        multiline
                        maxRows={5}
                    value={detailPet}
                    onChange={(e) => {
                        setDetailPet(e.target.value)
                    }}
                    />
                </Box>

                {/* Ghi chú */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                    <Typography sx={{ minWidth: "200px" }}>Ghi chú của bạn: </Typography>
                    <TextField sx={{ width: "400px" }}
                        id="outlined-multiline-flexible"
                        multiline
                        maxRows={5}
                    value={note}
                    onChange={(e) => {
                        setNote(e.target.value)
                    }}
                    />
                </Box>

                {/* Nút bấm */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                    <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>Tổng hóa đơn: </Typography>
                    <Typography sx={{ fontSize: "1.2rem", color: "#e77045", fontWeight: "bold" }}>
                        {totalPrice?.toLocaleString('vi-VN')}đ
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3, marginTop: "10px" }}>
                    <Button onClick={() => {
                        setDetailPet("");
                        setNote("");
                        setWeightPet(2);
                        setTotalPrice(getTotalPrice(2,prices))
                    }} variant="contained" color="secondary">
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit} 
                        variant="contained" color="success">
                        Đặt ngay
                    </Button>
                </Box>
                <Dialog onClose={handleCloseDialog} open={openDialog}>
                    <Box sx={{ padding: '10px' }}>
                        <DialogTitle>Cảnh báo</DialogTitle>
                        <Alert severity="error">Bạn cần nhập vào số</Alert>
                        <Button onClick={handleCloseDialog}>Đã hiểu</Button>
                    </Box>

                </Dialog>
            </Box>
            <ToastContainer />
        </Box>
    )
}

export default AddBooking;
import myStyle from "./AddAccount.module.scss";
import { useState } from 'react';
import {
    TextField,
    Box,
    Typography,
    Radio,
    Button,
    Divider,
    CircularProgress
} from '@mui/material';
import { useAuth } from "~/components/Authentication/authentication";
// import { Link, useNavigate } from 'react-router-dom';
// import { registerSchema } from '../../utils/rules'; // Đường dẫn đến file validate
// import { RegisterFetch } from '~/REST-API-client';
const AddAccount = () => {
    const auth = useAuth();
    const [selectedGender, setSelectedGender] = useState('male');
    const [selectedRole, setSelectedRole] = useState("user");
    const [isLoading, setIsLoading] = useState(false)
    const handleChangeRole = (e) => {
        setSelectedRole(e.target.value);
    }
    const handleChangeGender = (event) => {
        setSelectedGender(event.target.value);
    };
    if(isLoading) {
        return(
            <Box sx={{display:'flex', justifyContent:"center", alignItems:"center"}}>
                <CircularProgress />
            </Box>
        )
    }
    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column",position:"relative" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>Thêm tài khoản mới</Typography>
                <Box sx={{ width: "400px", marginTop: "20px" }}>
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Họ và tên: </Typography>
                        <input type="text" className={myStyle.textFeild} />
                    </Box>
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Email: </Typography>
                        <input type="text" className={myStyle.textFeild} />
                    </Box>
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Mật khẩu: </Typography>
                        <input type="text" className={myStyle.textFeild} />
                    </Box>
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Giới tính: </Typography>
                        <Box >
                            <Box>
                                <Radio
                                    size="small"
                                    id="maleRadio"
                                    checked={selectedGender === 'male'}
                                    onChange={handleChangeGender}
                                    value="male"
                                    name="radio-gender"
                                    inputProps={{ 'aria-label': 'A' }}
                                /> <label htmlFor="maleRadio">Nam</label>
                                <Radio
                                    size="small"
                                    id="femaleRadio"
                                    checked={selectedGender === 'female'}
                                    onChange={handleChangeGender}
                                    value="female"
                                    name="radio-gender"
                                    inputProps={{ 'aria-label': 'B' }}
                                /> <label htmlFor="femaleRadio">Nữ</label>
                                <Radio
                                    size="small"
                                    id="otherRadio"
                                    checked={selectedGender === 'other'}
                                    onChange={handleChangeGender}
                                    value="other"
                                    name="radio-gender"
                                    inputProps={{ 'aria-label': 'B' }}
                                /> <label htmlFor="otherRadio">Khác</label>
                            </Box>
                        </Box>
                    </Box>
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Địa chỉ: </Typography>
                        <input type="text" className={myStyle.textFeild} />
                    </Box>
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Số điện thoại: </Typography>
                        <input type="text" className={myStyle.textFeild} />
                    </Box>
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Vai trò: </Typography>
                        <Box >
                            <Box>
                                <Radio
                                    size="small"
                                    id="userRadio"
                                    checked={selectedRole === 'user'}
                                    onChange={handleChangeRole}
                                    value="user"
                                    name="radio-role"
                                    inputProps={{ 'aria-label': 'A' }}
                                /> <label htmlFor="userRadio">Người dùng</label>
                                <Radio
                                    size="small"
                                    id="adminRadio"
                                    checked={selectedRole === 'admin'}
                                    onChange={handleChangeRole}
                                    value="admin"
                                    name="radio-role"
                                    inputProps={{ 'aria-label': 'B' }}
                                /> <label htmlFor="adminRadio">Quản trị</label>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, marginTop: "20px" }}>
                        <Button variant="contained" color="secondary">Hủy</Button>
                        <Button variant="contained" color="success">Xác nhận</Button>
                    </Box>
                </Box>
                <Box sx={{position:"absolute", top:0, right:0}}>
                    <Button variant="contained" color="warning" sx={{textTransform:"none"}}>
                        <label htmlFor="excel-file">Chọn từ excel</label>
                    </Button>
                    <input id="excel-file" type="file" style={{ display: 'none' }}/>
                </Box>
            </Box>
        </>

    );
};

export default AddAccount;

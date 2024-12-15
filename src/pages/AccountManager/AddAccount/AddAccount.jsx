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
import { Phone } from "@mui/icons-material";
import { UserFetch } from "~/REST_API_Client";
import { excel } from "~/utils/xlsx";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { registerSchema } from "~/utils/authenValidation";
// import { Link, useNavigate } from 'react-router-dom';
// import { registerSchema } from '../../utils/rules'; // Đường dẫn đến file validate
// import { RegisterFetch } from '~/REST-API-client';
const AddAccount = () => {
    const auth = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [selectedGender, setSelectedGender] = useState('male');
    const [selectedRole, setSelectedRole] = useState("user");
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState();
    const fetchData = (data) => {
        setIsLoading(true)
        UserFetch.createUsers(data)
            .then(res => {
                toast.success(`Thêm tài khoản thành công\n ${res.data.message}`);
                // console.log("them thanh con: ", res);
                setIsLoading(false);
                handleCancel();
            })
            .catch(err => {
                toast.error(`Tạo tài khoản thất bại: \n ${err}`);
                // console.log("them loi: ", err);
                setIsLoading(false);
            })
    }
    const handleChangeRole = (e) => {
        setSelectedRole(e.target.value);
    }
    const handleChangeGender = (event) => {
        setSelectedGender(event.target.value);
    };
    const handleCancel = () => {
        setName(""); setEmail(""); setPassword(""); setAddress(""); setPhone("");
        setSelectedGender("male"); setSelectedRole("user");
    };

    const validateForm = async () => {
        try {
            await registerSchema.validate(
                {
                    name: name,
                    email: email,
                    password: password,
                    address: address,
                    phone: phone,  
                    gender: selectedGender,
                    role: selectedRole,
                },
                { abortEarly: false }
            );
            return true;
        } catch (error) {
            if (error.inner) {
                // Nhóm lỗi theo path (tên trường) và chỉ hiển thị lỗi đầu tiên
                const uniqueErrors = {};
                error.inner.forEach(err => {
                    if (!uniqueErrors[err.path]) {
                        uniqueErrors[err.path] = err.message;  // Lưu lỗi đầu tiên cho mỗi trường
                    }
                });
    
                // Hiển thị lỗi cho từng trường
                Object.values(uniqueErrors).forEach(errorMessage => {
                    toast.error(errorMessage);
                });
            } else {
                toast.error("Lỗi: " + error.message);  // Hiển thị lỗi chung nếu có
            }
            return false;
        }
    };
    

    const handleConfirm = async () => {
        const isValid = await validateForm();
        if (!isValid) return;
        const data = [{
            name,
            email,
            password,
            address,
            phone,
            gender: selectedGender,
            role: selectedRole
        }]
        fetchData(data);
    };
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const data = await excel.readExcelFile(file);
                // console.log('Dữ liệu từ Excel:', data);
                setUsers(data);
            } catch (error) {
                // console.error('Lỗi đọc file:', error);
                toast.error(`Lỗi đọc file: \n ${error}`);
            } finally {
                e.target.value = null;
            }
        }
        e.target.value = null;
    }
    const hanleConfirmMany = () => {
        fetchData(users);
    }
    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>Thêm tài khoản mới</Typography>
                <Box sx={{ width: "400px", marginTop: "20px" }}>
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Họ và tên: </Typography>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={myStyle.textFeild} />
                    </Box>
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Email: </Typography>
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className={myStyle.textFeild} />
                    </Box>
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Mật khẩu: </Typography>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={myStyle.textFeild} />
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
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={myStyle.textFeild} />
                    </Box>
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Số điện thoại: </Typography>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={myStyle.textFeild} />
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
                        <Button disabled = {isLoading} onClick={handleCancel} variant="contained" color="secondary">Hủy</Button>
                        <Button disabled = {isLoading} onClick={handleConfirm} variant="contained" color="success">Xác nhận</Button>
                    </Box>
                </Box>

            </Box>
            <Divider sx={{ marginY: "20px" }} />
            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>Thêm từ Excel</Typography>
                <Box sx={{}}>
                    <Button variant="contained" color="warning" sx={{ textTransform: "none" }}>
                        <label htmlFor="excel-file">Chọn file</label>
                    </Button>
                    <input
                        onChange={handleFileUpload}
                        id="excel-file" type="file" accept=".xls,.xlsx" style={{ display: 'none' }} />
                </Box>
                {
                    users ?
                        (
                            <>
                                <Box sx={{ marginTop: "20px" }}>
                                    <Typography>Dữ liệu bạn đã nạp</Typography>
                                    <Box className={myStyle.containerTable}>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "14%" }}>Tên</th>
                                                    <th style={{ width: "14%" }}>Email</th>
                                                    <th style={{ width: "14%" }}>Mật khẩu</th>
                                                    <th style={{ width: "14%" }}>Giới tính</th>
                                                    <th style={{ width: "14%" }}>Địa chỉ</th>
                                                    <th style={{ width: "14%" }}>Số điện thoại</th>
                                                    <th style={{ width: "14%" }}>Vai trò</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    users?.map((user, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{user?.name}</td>
                                                                <td>{user?.email}</td>
                                                                <td>{user?.password}</td>
                                                                <td>{user?.gender}</td>
                                                                <td>{user?.address}</td>
                                                                <td>{user?.phone}</td>
                                                                <td>{user?.role}</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </Box>
                                </Box>
                                <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: 2 }}>
                                    <Button disabled={isLoading} onClick={() => setUsers(null)} variant="contained" color="error" sx={{ textTransform: "none" }}>Hủy</Button>
                                    <Button disabled={isLoading} onClick={hanleConfirmMany} variant="contained" color="success" sx={{ textTransform: "none" }}>Xác nhận</Button>
                                </Box>
                            </>

                        ) :
                        (
                            null
                        )
                }

            </Box>
            <ToastContainer />
        </>

    );
};

export default AddAccount;

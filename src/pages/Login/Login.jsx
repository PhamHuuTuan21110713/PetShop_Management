import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Box, Dialog,Alert} from '@mui/material';
import { Link , useNavigate} from 'react-router-dom';
import { loginSchema } from '~/utils/authenValidation';
import { AuthenFetch } from '~/REST_API_Client';
import { useAuth } from '../../components/Authentication/authentication';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const Login = () => {
  console.log("render-dangnhap")
  const auth = useAuth();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [errorMessage, setErrorMassage] = useState("Lỗi rồi, :(")
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputValue((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined })); // Xóa lỗi khi người dùng nhập liệu
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await loginSchema.validate(inputValue, { abortEarly: false });
      // Nếu validation thành công, thực hiện đăng nhập
      // console.log('Email:', inputValue.email);
      // console.log('Password:', inputValue.password);
      try {
        const data = await AuthenFetch.login(inputValue);
        if(data.data.user.role !== "admin") {
          toast.error("Bạn không có quyền truy cập");
          return;
        }
        // console.log(data.data.access_token)
        localStorage.setItem("access_token", data.data.access_token);
        auth.authenUser(data.data.user);
        
        setIsSuccess(true);
        setOpenDialog(true);
        setInputValue({
          email: '',
          password: '',
        });
        setTimeout(() => {
          setOpenDialog(false);
          navigate("/");
        }, 1500)
      } catch(err) {
        // console.log("error login: ", err)
        setErrorMassage(err.toString());
        setIsSuccess(false)
        setOpenDialog(true);
      }
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
      // console.log("error: ",validationErrors);
      setErrors(validationErrors);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#4b6584',
        position: 'relative',
      }}
    >
      <Paper elevation={3} sx={{ padding: '20px', width: '100%', maxWidth: 400, bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#ffffff'), boxShadow: '0 5px 5px #2c3e50' }}>
        <Typography component="h1" variant="h5" align="center" color={(theme) => (theme.palette.mode === 'dark' ? '#ffffff' : '#333333')}>
          Đăng Nhập
        </Typography>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={inputValue.email}
            onChange={handleChange}
            error={!!errors.email} // Kiểm tra lỗi
            helperText={errors.email} // Hiển thị thông báo lỗi
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Mật Khẩu"
            type="password"
            name="password"
            autoComplete="current-password"
            value={inputValue.password}
            onChange={handleChange}
            error={!!errors.password} // Kiểm tra lỗi
            helperText={errors.password} // Hiển thị thông báo lỗi
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ marginTop: 2 }}>
            Đăng Nhập
          </Button>
        </form>
        <Typography variant="body2" align="center" sx={{ marginTop: 2 }} color={(theme) => (theme.palette.mode === 'dark' ? '#ffffff' : '#666666')}>
          <Link to="#" variant="body2" style={{ color: "#2d98da" }}>
            Quên mật khẩu?
          </Link>
        </Typography>
        <Typography variant="body2" align="center" sx={{ marginTop: 2 }} color={(theme) => (theme.palette.mode === 'dark' ? '#ffffff' : '#666666')}>
          Chưa có tài khoản?{' '}
          <Link to="/dang-ky" variant="body2" style={{ color: "#2d98da" }}>
            Đăng ký
          </Link>
        </Typography>
      </Paper>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        {
          isSuccess === true ? <Alert severity='success'>Đăng nhập thành công</Alert>
            : <Alert severity='error'>{errorMessage}</Alert>
        }
      </Dialog>
      <ToastContainer />
    </Box>
  );
};

export default Login;


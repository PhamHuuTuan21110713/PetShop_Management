import { useEffect, useRef, useState } from 'react';
import { Modal, Box, Typography, Button, Avatar, Chip, TextField, Divider } from '@mui/material';
import Radio from '@mui/material/Radio';
import { UserFetch } from '~/REST_API_Client';

const DetailAccountModal = ({ open, onClose, user, onChange }) => {
  // if (!user) return null; // Nếu không có user thì không render modal;
  const defaultInfor = useRef({ ...user });
  const [isUpdate, setIsUpdate] = useState(false);
  const [gender, setgender] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [address, setAddress] = useState();
  const [state, setState] = useState();
  useEffect(() => {
    if (open === true) {
      setIsUpdate(false); setgender(user?.gender); setName(user?.name); setEmail(user?.email);
      setPhone(user?.phone); setAddress(user?.address); setState(user?.state);
      defaultInfor.current = { ...user };
    }
  }, [open])
  const handleChangeGender = (event) => {
    setgender(event.target.value);
  };
  const changeToUnUpdate = () => {
    setIsUpdate(false);
    setgender(defaultInfor.current?.gender); setName(defaultInfor.current?.name); setEmail(defaultInfor.current?.email);
    setPhone(defaultInfor.current?.phone); setAddress(defaultInfor.current?.address); setState(defaultInfor.current?.state);
  }
  const changeToUpdate = () => {
    setIsUpdate(true);
  }
  const handleChangeName = (e) => {
    setName(e.target.value);
  }
  const handleChangeAddress = (e) => {
    setAddress(e.target.value);
  }
  const hanleChangePhone = (e) => {
    setPhone(e.target.value);
  }
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  }
  const handleConfirm = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("gender", gender);
    formData.append("address", address);
    formData.append("state", state);
    UserFetch.updateInfo(user._id, formData)
      .then(data => {
        // console.log("cap nhat thanh con: ", data);
        window.alert("Cập nhật thông tin người dùng thành công");
        const newUser = data.data;
        // setgender(newUser?.gender); setName(newUser?.name); setEmail(newUser?.email);
        // setPhone(newUser?.phone); setAddress(newUser?.address); setState(newUser?.state);
        // defaultInfor.current = { ...newUser };
        onChange(newUser);
        onClose();
      })
      .catch(err => {
        console.log("loi cap nhat thong tin nguoi dung: ", err);
        window.alert(`Lỗi cập nhật thông tin người dùng \n ${err}`);
      })
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="user-details-title"
      aria-describedby="user-details-description"
    >
      <Box sx={modalStyle}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }} id="user-details-title">Thông tin cơ bản</Typography>
        </Box>
        {/* Detail */}
        <Box sx={{ display: "flex", marginTop: "10px", width: "100%" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
            <Typography id="user-details-description"><strong>Mã tài khoản: </strong>{user?._id}</Typography>
            {
              !isUpdate ? <>
                <Typography><strong>Tên:</strong> {name}</Typography>
                <Typography><strong>Giới tính:</strong> {gender === "male" ? "Nam" : gender === "female" ? "Nữ" : "Khác"}</Typography>
                <Typography><strong>Email:</strong>{email}</Typography>
                <Typography><strong>Số điện thoại:</strong>{phone}</Typography>
                <Typography><strong>Địa chỉ:</strong>{address}</Typography>
                <Typography><strong>Ngày tạo:</strong>{new Date(user?.createdAt).toLocaleDateString()}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography><strong>Trạng thái tài khoản:</strong></Typography>
                  {
                    state === 1 ? <Chip label="Đang hoạt động" color="success" /> : <Chip label="Đã khóa" color="error" />
                  }

                </Box>
              </> :
                <>
                  {/* Name */}
                  <Box style={inputContainer}>
                    <strong>Tên:</strong>
                    <input style={textFieldStyle} value={name} onChange={handleChangeName} />
                  </Box>
                  {/* Gender */}
                  <Box style={inputContainer}>
                    <strong>Giới tính:</strong>
                    <Box>
                      <Radio
                        checked={gender === 'male'}
                        onChange={handleChangeGender}
                        value="male"
                        name="radio-buttons"
                        inputProps={{ 'aria-label': 'A' }}
                      /> Nam
                      <Radio
                        checked={gender === 'female'}
                        onChange={handleChangeGender}
                        value="female"
                        name="radio-buttons"
                        inputProps={{ 'aria-label': 'B' }}
                      /> Nữ
                      <Radio
                        checked={gender === 'other'}
                        onChange={handleChangeGender}
                        value="other"
                        name="radio-buttons"
                        inputProps={{ 'aria-label': 'B' }}
                      /> Khác
                    </Box>
                  </Box>
                  {/* Email */}
                  <Box style={inputContainer}>
                    <strong>Email:</strong>
                    <input style={textFieldStyle} value={email} onChange={handleChangeEmail} />
                  </Box>
                  {/* Phone */}
                  <Box style={inputContainer}>
                    <strong>Số điện thoại:</strong>
                    <input style={textFieldStyle} value={phone} onChange={hanleChangePhone} />
                  </Box>
                  {/* Address */}
                  <Box style={inputContainer}>
                    <strong>Địa chỉ: </strong>
                    <input style={textFieldStyle} value={address} onChange={handleChangeAddress} />
                  </Box>
                  {/* Create date */}
                  <Typography sx={{ display: "flex", justifyContent: "space-between" }}><strong>Ngày tạo:</strong> 22/11/2023</Typography>
                  {/* State */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography><strong>Trạng thái tài khoản:</strong></Typography>

                    {
                      state === 1 ?
                        <>
                          <Chip label="Đang hoạt động" color="success" />
                          <Button onClick={() => {
                            setState(0);
                          }}
                            variant='contained' color='error' sx={{ textTransform: "none" }}>Ngưng kích hoạt</Button>
                        </>
                        :
                        <>
                          <Chip label="Đã khóa" color="error" />
                          <Button onClick={() => {
                            setState(1);
                          }}
                            variant='contained' color='success' sx={{ textTransform: "none" }}>Tái kích hoạt</Button>
                        </>
                    }
                  </Box>

                </>
            }
          </Box>
        </Box>

        {!isUpdate ?
          (<Box sx={{ marginTop: "20px", float: "right" }}>
            <Button variant='contained' onClick={changeToUpdate}>Cập nhật</Button>
          </Box>) :
          (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: "20px", float: "right" }}>
              <Button onClick={changeToUnUpdate} color='warning' variant='contained'>Hủy</Button>
              <Button color="success" variant='contained' onClick={handleConfirm} >Xác nhận</Button>
            </Box>
          )
        }
      </Box>

    </Modal>
  );
};

// Style cho modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  width: 600,
  borderRadius: 2,

};
const inputContainer = {
  display: "flex",
  gap: 4,
  alignItems: "center",
  justifyContent: "space-between"
}
const textFieldStyle = {
  height: "40px",
  width: "200px"
}
export default DetailAccountModal;

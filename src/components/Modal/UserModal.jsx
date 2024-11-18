import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const UserModal = ({ open, onClose, user, onLockAccount }) => {
  if (!user) return null; // Nếu không có user thì không render modal

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="user-details-title"
      aria-describedby="user-details-description"
    >
      <Box sx={modalStyle}>
        <Typography variant="h6" id="user-details-title">Thông tin chi tiết người dùng</Typography>
        <Typography id="user-details-description"><strong>ID:</strong> {user.id}</Typography>
        <Typography><strong>Tên:</strong> {user.name}</Typography>
        <Typography><strong>Giới tính:</strong> {user.gender}</Typography>
        <Typography><strong>Email:</strong> {user.email}</Typography>
        <Typography><strong>Số điện thoại:</strong> {user.phone}</Typography>
        <Typography><strong>Địa chỉ:</strong> {user.address}</Typography>
        <Box sx={{ marginTop: 2 }}>
          {user.locked ? (
            <Button variant="contained" disabled sx={{ backgroundColor: '#d32f2f' }}>
              Đã khóa
            </Button>
          ) : (
            <Button
              variant="contained"
              color="error"
              onClick={() => onLockAccount(user.id)}
            >
              Khóa tài khoản
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ marginLeft: 2 }}
          >
            Đóng
          </Button>
        </Box>
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
  width: 400,
  borderRadius: 2,
};

export default UserModal;

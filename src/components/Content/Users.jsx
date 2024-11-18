import React, { useState } from 'react';
import { Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from '@mui/material';
import UserModal from '../Modal/UserModal'; // Import modal mới

const Users = () => {
  // Danh sách người dùng giả định
  const [users, setUsers] = useState([
    { id: 'agadgas456g4a6s4g6a4g6a4gsag', name: 'Nguyễn Văn A', email: 'a@example.com', phone: '0123456789', address: 'Hà Nội', locked: false, gender: 'Male' },
    { id: 'bgadgas456g4a6s4g6a4g6a4gsag', name: 'Trần Thị B', email: 'b@example.com', phone: '0987654321', address: 'TP.HCM', locked: false, gender: 'Female' },
    { id: 'cgadgas456g4a6s4g6a4g6a4gsag', name: 'Lê Quang C', email: 'c@example.com', phone: '0912345678', address: 'Đà Nẵng', locked: false, gender: 'Male' },
    { id: 'dgadgas456g4a6s4g6a4g6a4gsag', name: 'Phạm Minh D', email: 'd@example.com', phone: '0934567890', address: 'Hải Phòng', locked: false, gender: 'Male' },
    { id: 'egadgas456g4a6s4g6a4g6a4gsag', name: 'Nguyễn Hoàng E', email: 'e@example.com', phone: '0912345679', address: 'Hà Nội', locked: false, gender: 'Male' },
    { id: 'fgadgas456g4a6s4g6a4g6a4gsag', name: 'Trần Quốc F', email: 'f@example.com', phone: '0987654331', address: 'TP.HCM', locked: false, gender: 'Male' },
    { id: 'ggadgas456g4a6s4g6a4g6a4gsag', name: 'Lê Thị G', email: 'g@example.com', phone: '0912345690', address: 'Đà Nẵng', locked: false, gender: 'Female' },
    { id: 'hgadgas456g4a6s4g6a4g6a4gsag', name: 'Phạm Thanh H', email: 'h@example.com', phone: '0934567801', address: 'Hải Phòng', locked: false, gender: 'Male' },
    { id: 'igadgas456g4a6s4g6a4g6a4gsag', name: 'Nguyễn Minh I', email: 'i@example.com', phone: '0123456798', address: 'Hà Nội', locked: false , gender: 'Male'},
  ]);

  // State cho giá trị tìm kiếm và modal
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Hàm khóa tài khoản
  const lockAccount = (id) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, locked: true } : user
    ));
    setOpenModal(false); // Đóng modal khi tài khoản bị khóa
  };

  // Hàm mở modal và chọn người dùng
  const openUserDetails = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };

  // Hàm xử lý tìm kiếm người dùng theo tên
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) || // Lọc theo tên
    user.id.toLowerCase().includes(search.toLowerCase()) || // Lọc theo ID
    user.email.toLowerCase().includes(search.toLowerCase()) // Lọc theo email
  );

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header và thanh tìm kiếm */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
        <h3>Quản lý người dùng</h3>
        <TextField
          label="Tìm kiếm người dùng"
          variant="outlined"
          size="small"
          value={search}
          onChange={handleSearchChange}
          sx={{ width: '300px' }}
        />
      </Box>

      {/* Table danh sách người dùng */}
      <TableContainer component={Paper}>
        <Table sx={{ tableLayout: 'fixed' }}>
          {/* TableHead giữ cố định */}
          <TableHead>
            <TableRow>
              <TableCell sx={cellStyle}>ID</TableCell>
              <TableCell sx={cellStyle}>Tên</TableCell>
              <TableCell sx={cellStyle}>Email</TableCell>
              <TableCell sx={cellStyle}>Số điện thoại</TableCell>
              <TableCell sx={cellStyle}>Địa chỉ</TableCell>
              <TableCell sx={cellStyle}>Hành động</TableCell>
            </TableRow>
          </TableHead>
        </Table>

        {/* TableBody cuộn khi quá nhiều hàng */}
        <div style={{ maxHeight: 480, overflowY: 'auto' }}>
          <Table>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell sx={cellStyle}>{user.id}</TableCell>
                  <TableCell sx={cellStyle}>{user.name}</TableCell>
                  <TableCell sx={cellStyle}>{user.email}</TableCell>
                  <TableCell sx={cellStyle}>{user.phone}</TableCell>
                  <TableCell sx={cellStyle}>{user.address}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => openUserDetails(user)}
                    >
                      Xem chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TableContainer>

      {/* Sử dụng modal mới */}
      <UserModal
        open={openModal}
        onClose={closeModal}
        user={selectedUser}
        onLockAccount={lockAccount}
      />
    </Box>
  );
};

// Style cho các ô của bảng
const cellStyle = {
  width: 188,
  maxWidth: 188,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  wordBreak: 'break-word',
};

export default Users;

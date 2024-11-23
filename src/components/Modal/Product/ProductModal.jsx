import React from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';

const ProductModal = ({ open, onClose, product }) => {
  if (!product) return null; // Nếu không có sản phẩm thì không render modal

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="product-details-title"
      aria-describedby="product-details-description"
    >
      <Box sx={modalStyle}>
        <Typography variant="h6" id="product-details-title">Thông tin chi tiết sản phẩm</Typography>
        <Typography id="product-details-description"><strong>ID:</strong> {product._id}</Typography>
        <Typography><strong>Tên:</strong> {product.name}</Typography>
        <Typography><strong>Danh mục:</strong> {product.type}</Typography>
        <Typography><strong>Số lượng:</strong> {product.quantity}</Typography>
        <Typography><strong>Đã bán:</strong> {product.sold}</Typography>
        <Typography><strong>Giá:</strong> {product.price ? `${product.price.toLocaleString('vi-VN')} VND` : 'Chưa có giá'}</Typography>
        <Typography><strong>Mô tả:</strong> {product.desc}</Typography>
        
        {/* Nút cập nhật thông tin sản phẩm */}
        <Box sx={{ marginTop: 2 }}>
          <Button variant="contained" onClick={() => alert('Cập nhật sản phẩm!')} color="primary">
            Cập nhật
          </Button>
          <Button variant="outlined" onClick={onClose} sx={{ marginLeft: 2 }}>
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
  boxShadow: '4px 4px 4px gray',
  p: 4,
  width: 400,
  borderRadius: 2,
};

export default ProductModal;

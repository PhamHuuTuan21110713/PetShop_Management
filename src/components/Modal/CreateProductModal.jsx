import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, MenuItem, Select, FormControl } from '@mui/material';
import validationSchema from '../../utils/validation';
import axios from 'axios';

const CreateProductModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    type: '',
    price: '',
    quantity: '',
    categoryId: '',  // Thêm trường categoryId
  });

  const [errors, setErrors] = useState({});
//   const [categories, setCategories] = useState([]);

  // Lấy danh sách categories từ API
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get('/api/categories'); // API để lấy danh sách Category
//         setCategories(response.data); // Giả sử response trả về danh sách category
//       } catch (error) {
//         console.error("Lỗi khi lấy danh mục:", error);
//       }
//     };

//     fetchCategories();
//   }, []);
    const categories = [
        {id: 1, name: "Thức ăn cho chó"},
        {id: 2, name: "Thức ăn cho mèo"},
        {id: 3, name: "Thức ăn cho vẹt"},
    ]
    
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Xác thực với Yup
      await validationSchema.validate(formData, { abortEarly: false });

      // Nếu xác thực thành công, gọi onSubmit để gửi dữ liệu
      onSubmit(formData);
      onClose(); // Đóng modal
    } catch (error) {
      // Nếu có lỗi validation, set lại state errors
      const validationErrors = error.inner.reduce((acc, currError) => {
        acc[currError.path] = currError.message;
        return acc;
      }, {});
      setErrors(validationErrors);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          bgcolor: 'background.paper',
          borderRadius: '8px',
          padding: 3,
          boxShadow: '4px 4px 4px gray'
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Thêm sản phẩm mới
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Tên sản phẩm"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
          />
          <TextField
            fullWidth
            label="Mô tả sản phẩm"
            name="desc"
            value={formData.desc}
            onChange={handleInputChange}
            error={Boolean(errors.desc)}
            helperText={errors.desc}
          />
          <TextField
            fullWidth
            label="Loại sản phẩm"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            error={Boolean(errors.type)}
            helperText={errors.type}
          />
          <TextField
            fullWidth
            label="Giá sản phẩm"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            error={Boolean(errors.price)}
            helperText={errors.price}
          />
          <TextField
            fullWidth
            label="Số lượng"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            error={Boolean(errors.quantity)}
            helperText={errors.quantity}
          />
          
          {/* Dropdown cho Category */}
          <FormControl fullWidth>
            <Typography>Danh mục</Typography>
            <Select
              labelId="category-label"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              error={Boolean(errors.categoryId)}
            >
              {categories.map(category => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {errors.categoryId && <Typography color="error">{errors.categoryId}</Typography>}
          </FormControl>
        </Box>

        <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose}>Hủy</Button>
          <Button onClick={handleSubmit} color="primary">
            Thêm sản phẩm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateProductModal;

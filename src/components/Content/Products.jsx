import React, { useState } from 'react';
import { Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from '@mui/material';
import ProductModal from '../Modal/ProductModal';
import CreateProductModal from '../Modal/CreateProductModal';

const Products = () => {
  // Danh sách sản phẩm giả định
  const [products, setProducts] = useState([
    { id: 'p1', name: 'Sản phẩm 1', type: 'Loại A', quantity: 100, sold: 50, price: 50000, desc: 'Sản phẩm không có chỗ nào để chê mà' },
    { id: 'p2', name: 'Sản phẩm 2', type: 'Loại B', quantity: 150, sold: 30, price: 30000 },
    { id: 'p3', name: 'Sản phẩm 3', type: 'Loại A', quantity: 80, sold: 60, price: 70000 },
  ]);

  // State cho giá trị tìm kiếm và modal
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Hàm mở modal và chọn sản phẩm
  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
  };

  const openCreateProductForm = () => {
    setOpenCreateModal(true);
  };

  const closeCreateProductForm = () => {
    setOpenCreateModal(false);
  };

  // Hàm xử lý tìm kiếm sản phẩm
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleAddProduct = (newProduct) => {
    setProducts([...products, { ...newProduct, id: `p${products.length + 1}` }]);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) || // Lọc theo tên
    product.id.toLowerCase().includes(search.toLowerCase()) || // Lọc theo ID
    product.type.toLowerCase().includes(search.toLowerCase()) // Lọc theo loại
  );

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header và thanh tìm kiếm */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <h3>Quản lý sản phẩm</h3>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 3}}>
          <TextField
            label="Tìm kiếm sản phẩm"
            variant="outlined"
            size="small"
            value={search}
            onChange={handleSearchChange}
            sx={{ width: '300px' }}
          />
          <Button
            variant="contained"
            onClick={openCreateProductForm}
          >
            Thêm sản phẩm
          </Button>
        </Box>
      </Box>

      {/* Table danh sách sản phẩm */}
      <TableContainer component={Paper}>
        <Table sx={{ tableLayout: 'fixed' }}>
          {/* TableHead giữ cố định */}
          <TableHead>
            <TableRow>
              <TableCell sx={cellStyle}>ID</TableCell>
              <TableCell sx={cellStyle}>Tên</TableCell>
              <TableCell sx={cellStyle}>Danh mục</TableCell>
              <TableCell sx={cellStyle}>Số lượng</TableCell>
              <TableCell sx={cellStyle}>Đã bán</TableCell>
              <TableCell sx={cellStyle}>Hành động</TableCell>
            </TableRow>
          </TableHead>
        </Table>

        {/* TableBody cuộn khi quá nhiều hàng */}
        <div style={{ maxHeight: 480, overflowY: 'auto' }}>
          <Table>
            <TableBody>
              {filteredProducts.map(product => (
                <TableRow key={product.id}>
                  <TableCell sx={cellStyle}>{product.id}</TableCell>
                  <TableCell sx={cellStyle}>{product.name}</TableCell>
                  <TableCell sx={cellStyle}>{product.type}</TableCell>
                  <TableCell sx={cellStyle}>{product.quantity}</TableCell>
                  <TableCell sx={cellStyle}>{product.sold}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => openProductDetails(product)}
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
      <ProductModal
        open={openModal}
        onClose={closeModal}
        product={selectedProduct}
      />
      {/* Modal Thêm sản phẩm */}
      <CreateProductModal
        open={openCreateModal}
        onClose={closeCreateProductForm}
        onSubmit={handleAddProduct}
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

export default Products;

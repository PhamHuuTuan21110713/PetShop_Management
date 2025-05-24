import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CategoryFetch } from '~/REST_API_Client'; // Gọi API từ client
import dayjs from 'dayjs';

const ProductReport = () => {
  const [filters, setFilters] = useState({
    month: '',
    quarter: '',
    year: dayjs().year(),
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategorySales = async () => {
    setLoading(true);
    try {
      const res = await CategoryFetch.getCategoriesSale(filters);
      setData(res.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategorySales();
  }, [filters]);
  console.log("data revenue: ", data);
  

  const handleFilterChange = (type) => (event) => {
    const value = event.target.value;
    setFilters((prev) => ({
      ...prev,
      [type]: value === "all" ? "" : value,
    }));
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Báo cáo bán hàng theo danh mục sản phẩm
      </Typography>

      {/* Bộ lọc thời gian */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Tháng</InputLabel>
          <Select value={filters.month} onChange={handleFilterChange('month')} label="Tháng">
            <MenuItem value="all">Tất cả</MenuItem>
            {[...Array(12)].map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Quý</InputLabel>
          <Select value={filters.quarter} onChange={handleFilterChange('quarter')} label="Quý">
            <MenuItem value="all">Tất cả</MenuItem>
            {[1, 2, 3, 4].map((q) => (
              <MenuItem key={q} value={q}>
                Quý {q}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Năm</InputLabel>
          <Select value={filters.year} onChange={handleFilterChange('year')} label="Năm">
            {[2022, 2023, 2024, 2025].map((y) => (
              <MenuItem key={y} value={y}>
                Năm {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Biểu đồ số lượng bán */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Số lượng bán theo danh mục
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantitySold" name="Số lượng bán" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Biểu đồ doanh thu */}
      <Typography variant="h6" sx={{ mt: 5, mb: 2 }}>
        Doanh thu theo danh mục
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip
              formatter={(value) =>
                new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(value)
              }
            />
            <Legend />
            <Bar dataKey="revenue" name="Doanh thu (VNĐ)" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default ProductReport;

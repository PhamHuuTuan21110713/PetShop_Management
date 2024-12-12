import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CategoryFetch, OrderFetch, ProductFetch } from '~/REST_API_Client';
import dayjs from 'dayjs';

const ProductReport = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
        status: 'tc',
        month: "",
        year: 2024,
        quarter: "",
    });

    // Fetch danh sách categories khi component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await CategoryFetch.get();
                setCategories(data.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await ProductFetch.getAllProduct(1, '', filters, 1000);
                
                
                setProducts(data.data.products);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, [filters]);
    console.log("data", products);

    // Fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await OrderFetch.getAllOrder(1, 1000, filters);  // Lấy đơn hàng từ API
                const fetchedOrders = response.data;
                const filteredOrders = fetchedOrders.filter(order => {
                    const orderDate = dayjs(order.orderDate);
                    return (
                        (!filters.month || orderDate.month() + 1 === filters.month) &&
                        (!filters.quarter || Math.ceil((orderDate.month() + 1) / 3) === filters.quarter) &&
                        (!filters.year || orderDate.year() === filters.year)
                    );
                });
                setOrders(filteredOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, [filters]);

    // Tính toán doanh thu/số lượng bán theo subCategory
    const calculateSales = () => {
        const sales = categories.flatMap(category =>
            category.subCategory.map(subCategory => ({
                subCategory: subCategory.name, // Lấy tên subCategory
                quantitySold: 0, // Số lượng bán ban đầu
            }))
        );

        orders.forEach(order => {
            order.products.forEach(orderProduct => {
                const product = products.find(p => p._id === orderProduct.productId);
                if (product) {
                    const category = categories.find(c =>
                        c.subCategory.some(subCat => subCat._id === product.categoryId)
                    );
                    if (category) {
                        const subCategory = category.subCategory.find(subCat => subCat._id === product.categoryId);
                        const subCategorySales = sales.find(s => s.subCategory === subCategory.name);
                        if (subCategorySales) {
                            subCategorySales.quantitySold += orderProduct.quantity;
                        }
                    }
                }
            });
        });

        setSalesData(sales); // Lưu dữ liệu vào state salesData
    };

    useEffect(() => {
        calculateSales();
    }, [orders, products, categories, filters]);

    // Xử lý sự kiện thay đổi giá trị các select
    const handleSelectChange = (event, type) => {
        const value = event.target.value;
        setFilters(prevFilters => ({
            ...prevFilters,
            [type]: value === "all" ? "" : value, // Nếu chọn "Tất cả", sẽ xóa giá trị filter tương ứng
        }));
    };

    return (
        <Box sx={{ padding: "20px" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Thống Kê Số Lượng Đã Bán Theo Các Loại Sản Phẩm
            </Typography>

            {/* Các ô Select cho Tháng, Quý, Năm */}
            <Box sx={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                {/* Chọn Tháng */}
                <FormControl fullWidth>
                    <InputLabel>Chọn Tháng</InputLabel>
                    <Select
                        value={filters.month}
                        onChange={(e) => handleSelectChange(e, 'month')}
                        label="Chọn Tháng"
                    >
                        <MenuItem value="all">Tất cả</MenuItem>
                        {[...Array(12)].map((_, index) => (
                            <MenuItem key={index} value={index + 1}>
                                Tháng {index + 1}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Chọn Quý */}
                <FormControl fullWidth>
                    <InputLabel>Chọn Quý</InputLabel>
                    <Select
                        value={filters.quarter}
                        onChange={(e) => handleSelectChange(e, 'quarter')}
                        label="Chọn Quý"
                    >
                        <MenuItem value="all">Tất cả</MenuItem>
                        {[1, 2, 3, 4].map((quarter) => (
                            <MenuItem key={quarter} value={quarter}>
                                Quý {quarter}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Chọn Năm */}
                <FormControl fullWidth>
                    <InputLabel>Chọn Năm</InputLabel>
                    <Select
                        value={filters.year}
                        onChange={(e) => handleSelectChange(e, 'year')}
                        label="Chọn Năm"
                    >
                        {/* <MenuItem value="all">Tất cả</MenuItem> */}
                        {[2024, 2023, 2022].map((year) => (
                            <MenuItem key={year} value={year}>
                                Năm {year}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Biểu đồ Cột */}
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subCategory" /> {/* Trục X là subCategory */}
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantitySold" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default ProductReport;

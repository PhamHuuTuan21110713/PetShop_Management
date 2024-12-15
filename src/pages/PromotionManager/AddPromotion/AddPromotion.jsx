import myStyle from "../../AccountManager/AddAccount/AddAccount.module.scss";
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {
    Box,
    Typography,
    Button,
    Divider,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Select,
    MenuItem,
    ListItemText
} from '@mui/material';
import { ProductFetch, PromotionFetch } from "~/REST_API_Client";
import { excel } from "~/utils/xlsx";
import { createPromotionValidation } from "~/utils/validation";
import { CheckBox } from "@mui/icons-material";

const AddPromotion = () => {

    // State Variables
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [type, setType] = useState("percent");
    const [value, setValue] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [products, setProducts] = useState([]);
    const [applicableProducts, setApplicableProducts] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [promotions, setPromotions] = useState();
    const [filters, setFilters] = useState({
        status: 'tc',
        month: "",
        year: 2024,
        quarter: "",
    });

    const handleNameChange = (e) => setName(e.target.value);

    const handleDescChange = (e) => setDesc(e.target.value);

    const handleTypeChange = (e) => setType(e.target.value);

    const handleValueChange = (e) => setValue(e.target.value);

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);

    };

    // Phương thức xử lý ngày kết thúc
    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    // // Phương thức xử lý các sản phẩm áp dụng
    // const handleApplicableProductsChange = (e) => {
    //     const value = e.target.value;
    //     const productIds = value.split(',').map(id => id.trim()); // Tách ID từ chuỗi
    //     setApplicableProducts(productIds);
    // };

    // Phương thức kiểm tra và gửi dữ liệu
    const fetchData = (data) => {
        setIsLoading(true);
        PromotionFetch.createPromotion(data)
            .then(res => {
                toast.success(`Thêm tài khoản thành công\n ${res.data.message}`);
                // console.log("them thanh con: ", res);
                setIsLoading(false);
                handleCancel();
            })
            .catch(err => {
                toast.error(`Tạo người dùng thất bại: \n ${err}`);
                // console.log("them loi: ", err);
                setIsLoading(false);
            })
    };

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await ProductFetch.getAllProduct(1, '', filters, 1000);
                // Lọc các sản phẩm có `hasPromotion` == true
                const filteredProducts = data.data.products.filter(product => product.hasPromotion === false);

                // Cập nhật state với sản phẩm đã lọc
                setProducts(filteredProducts);
                console.log("products sau add", filteredProducts);

            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, [filters]);

    // Phương thức hủy nhập liệu
    const handleCancel = () => {
        setName(""); setDesc(""); setType(""); setValue(""); setStartDate(""); setEndDate(""); setApplicableProducts([]);
    };

    const validateForm = async () => {
        // Chuyển đổi price và quantity thành số nguyên
        const priceValue = Number(value)

        // Kiểm tra tính hợp lệ của các trường bằng Yup
        try {
            await createPromotionValidation.validate({
                name: name,
                desc: desc,
                type: type,
                value: priceValue,
                startDate: startDate,
                endDate: endDate,
                applicableProducts: applicableProducts
            }, { abortEarly: false });

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

        const dataForm = {
            name: name,
            desc: desc,
            type: type,
            value: value,
            startDate: startDate,
            endDate: endDate,
            applicableProducts: applicableProducts
        };

        console.log("LLLLLLLLLLLLLLLLLL", dataForm);

        // Bắt đầu gửi yêu cầu tạo sản phẩm
        setIsLoading(true);  // Kích hoạt trạng thái loading

        try {
            // Gửi yêu cầu tạo sản phẩm qua PromotionFetch
            const result = await PromotionFetch.createPromotion(dataForm);

            if (result.status === "OK") {
                toast.success("Thêm khuyến mãi thành công!");

                // Reset form sau khi thêm sản phẩm thành công
                setName("");
                setDesc("");
                setType("");
                setValue("");
                setStartDate("");
                setEndDate("");
                setApplicableProducts([]);
            } else {
                toast.error("Lỗi từ API khi tạo sản phẩm: " + result.message); // Hiển thị lỗi nếu API trả về lỗi
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra: " + error.message);  // Hiển thị lỗi khi có sự cố trong quá trình gửi yêu cầu
        } finally {
            setIsLoading(false); // Tắt trạng thái loading sau khi hoàn tất
        }
    };

    // Phương thức xử lý tải file Excel
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const data = await excel.readExcelFile(file);
                setPromotions(data);
            } catch (error) {
                toast.error(`Lỗi đọc file: \n ${error}`);
            } finally {
                e.target.value = null;
            }
        }
        e.target.value = null;
    };

    // Phương thức xử lý xác nhận thêm nhiều sản phẩm từ Excel
    const hanleConfirmMany = () => {
        fetchData(promotions);
    };

    const handleApplicableProductsChange = (event) => {
        const selectedProductIds = event.target.value;
        console.log("Updated applicableProducts: ", selectedProductIds);  // Kiểm tra mảng ID đã chọn
        setApplicableProducts(selectedProductIds);
    };


    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>Thêm khuyến mãi mới</Typography>
                <Box sx={{ width: "400px", marginTop: "20px" }}>
                    {/* Các input thông tin sản phẩm */}
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Tên chương trình: </Typography>
                        <input type="text" value={name} onChange={handleNameChange} className={myStyle.textFeild} />
                    </Box>
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Mô tả: </Typography>
                        <input type="text" value={desc} onChange={handleDescChange} className={myStyle.textFeild} />
                    </Box>
                    {/* Thay thế input Kiểu khuyến mãi bằng RadioButton */}
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Kiểu khuyến mãi: </Typography>
                        <FormControl component="fieldset">
                            <RadioGroup row value={type} onChange={handleTypeChange}>
                                <FormControlLabel value="percent" control={<Radio />} label="Phần trăm" />
                                <FormControlLabel value="price" control={<Radio />} label="Giá cố định" />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Giá: </Typography>
                        <input type="text" value={value} onChange={handleValueChange} className={myStyle.textFeild} />
                    </Box>
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Ngày bắt đầu: </Typography>
                        <input
                            type="text"
                            value={startDate}
                            onChange={handleStartDateChange}
                            className={myStyle.textFeild}
                            placeholder="mm/dd/yyyy"
                        />
                    </Box>
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Ngày kết thúc: </Typography>
                        <input
                            type="text"
                            value={endDate}
                            onChange={handleEndDateChange}
                            className={myStyle.textFeild}
                            placeholder="mm/dd/yyyy"
                        />
                    </Box>


                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Áp dụng với: </Typography>

                        <Select
                            className={myStyle.textFeild}
                            multiple
                            value={applicableProducts} // Truyền mảng các sản phẩm đã chọn vào value
                            onChange={handleApplicableProductsChange} // Cập nhật giá trị khi chọn sản phẩm
                            renderValue={(selected) => {
                                // Nếu bạn muốn chỉ hiển thị số lượng sản phẩm đã chọn
                                return `${selected.length} sản phẩm đã chọn`;
                            }}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 200, // Giới hạn chiều cao của dropdown
                                        overflowY: 'auto', // Bật cuộn nếu chiều cao vượt quá 200px
                                        width: 250,
                                    },
                                },
                            }}
                        >
                            {products.map((product) => (
                                <MenuItem key={product._id} value={product._id}>
                                    {console.log('Checking if product is selected:', applicableProducts.includes(product._id))}
                                    {/* <CheckBox checked={applicableProducts.includes(product._id)} /> */}
                                    <ListItemText primary={product.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, marginTop: "20px" }}>
                        <Button disabled={isLoading} onClick={handleCancel} variant="contained" color="secondary">Hủy</Button>
                        <Button disabled={isLoading} onClick={handleConfirm} variant="contained" color="success">Xác nhận</Button>
                    </Box>
                </Box>
            </Box>
            {/* <Divider sx={{ marginY: "20px" }} /> */}

            {/* <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>Thêm từ Excel</Typography>
                <Box sx={{}}>
                    <Button variant="contained" color="warning" sx={{ textTransform: "none" }}>
                        <label htmlFor="excel-file">Chọn file</label>
                    </Button>
                    <input
                        onChange={handleFileUpload}
                        id="excel-file" type="file" accept=".xls,.xlsx" style={{ display: 'none' }} />
                </Box>
                {promotions && (
                    <>
                        <Box sx={{ marginTop: "20px" }}>
                            <Typography>Dữ liệu bạn đã nạp</Typography>
                            <Box className={myStyle.containerTable}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th style={{ width: "16%" }}>Tên chương trình</th>
                                            <th style={{ width: "16%" }}>Mô tả</th>
                                            <th style={{ width: "16%" }}>kiểu khuyến mãi</th>
                                            <th style={{ width: "16%" }}>Giá</th>
                                            <th style={{ width: "16%" }}>Ngày bắt đầu</th>
                                            <th style={{ width: "16%" }}>Ngày kết thúc</th>
                                            <th style={{ width: "16%" }}>Áp dụng với</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            promotions?.map((promotion, index) => (
                                                <tr key={index}>
                                                    <td>{promotion?.name}</td>
                                                    <td>{promotion?.desc}</td>
                                                    <td>{promotion?.type}</td>
                                                    <td>{promotion?.value}</td>
                                                    <td>{promotion?.startDate}</td>
                                                    <td>{promotion?.endDate}</td>
                                                    <td>{promotion?.applicableProducts}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </Box>
                        </Box>
                        <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: 2 }}>
                            <Button onClick={() => setPromotions(null)} variant="contained" color="error" sx={{ textTransform: "none" }}>Hủy</Button>
                            <Button onClick={hanleConfirmMany} variant="contained" color="success" sx={{ textTransform: "none" }}>Xác nhận</Button>
                        </Box>
                    </>
                )}
            </Box> */}
            <ToastContainer />
        </>
    );
};

export default AddPromotion;
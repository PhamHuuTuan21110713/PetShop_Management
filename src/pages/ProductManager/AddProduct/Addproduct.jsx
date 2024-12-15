import myStyle from "../../AccountManager/AddAccount/AddAccount.module.scss";
import { useState } from 'react';
import { useOutletContext } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {
    //TextField,
    Box,
    Typography,
    Button,
    Divider,
    //CircularProgress
} from '@mui/material';
// import { useAuth } from "~/components/Authentication/authentication";
import { ProductFetch } from "~/REST_API_Client";
import { excel } from "~/utils/xlsx";
import { createProductValidation } from "~/utils/validation";

const AddProduct = () => {
    // const auth = useAuth();
    const { categories } = useOutletContext();

    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [image, setImage] = useState(null); // State để lưu ảnh
    const [imageThumnail, setImageThumbnail] = useState(null); // State để lưu ảnh
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState();
    const [selectedSubCategory, setSelectedSubCategory] = useState("");

    const fetchData = (data) => {
        setIsLoading(true);
        return ProductFetch.createProduct(data)
            .then(res => {
                if (res.status === "OK") {
                    return res;  // Trả về kết quả nếu tạo sản phẩm thành công
                } else {
                    throw new Error(res.message);  // Ném lỗi nếu phản hồi không thành công
                }
            })
            .catch(err => {
                setIsLoading(false);
                toast.error(`Tạo sản phẩm thất bại: \n ${err.message}`);
                throw err;  // Đảm bảo lỗi được ném ra để catch phía ngoài
            });
    }


    const handleCancel = () => {
        setName(""); setDesc(""); setType(""); setPrice(""); setQuantity(""); setImage(null); // Reset ảnh
        setSelectedSubCategory("");
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file); // Lưu ảnh vào state
        }
    }

    const handleImageThumbnailUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageThumbnail(file); // Lưu ảnh vào state
        }
    }

    const validateForm = async () => {
        // Chuyển đổi price và quantity thành số nguyên
        // Chuyển đổi price và quantity thành số nguyên
        const priceValue = Number(price)
        const quantityValue = Number(quantity)
    
        // Kiểm tra tính hợp lệ của các trường bằng Yup
        try {
            await createProductValidation.validate({
                name: name,
                desc: desc,
                type: type,
                price: priceValue,  // Sử dụng giá trị đã chuyển đổi thành số nguyên
                quantity: quantityValue,  // Sử dụng giá trị đã chuyển đổi thành số nguyên
                categoryId: selectedSubCategory
            }, { abortEarly: false });
    
            return true;
        } catch (error) {
            if (error.inner) {
                error.inner.forEach(err => {
                    toast.error(err.message);  // Hiển thị tất cả các lỗi cho từng trường
                });
            } else {
                toast.error("Lỗi: " + error.message);  // Hiển thị lỗi chung nếu có
            }
            return false;
        }
    };
    
    
    const handleConfirm = async () => {
      
        // Kiểm tra tính hợp lệ của các trường
        const isValid = await validateForm();
        if (!isValid) return;  // Nếu validation thất bại thì không tiếp tục gửi dữ liệu
    
        // Tiến hành gửi dữ liệu API nếu validation thành công
        const formData = new FormData();
        formData.append("name", name);
        formData.append("desc", desc);
        formData.append("type", type);
        formData.append("price", price);  // Sử dụng giá trị đã chuyển đổi
        formData.append("quantity", quantity);  // Sử dụng giá trị đã chuyển đổi
        formData.append("categoryId", selectedSubCategory);
    
        if (image) {
            formData.append("image", image);
        }
    
        setIsLoading(true);  // Bắt đầu trạng thái loading
        try {
            const result = await fetchData(formData);
    
            if (result.status === "OK") {
                toast.success("Thêm sản phẩm thành công!");
    
                // Reset form sau khi tạo sản phẩm thành công
                setName("");
                setDesc("");
                setType("");
                setPrice("");
                setQuantity("");
                setSelectedSubCategory("");
                setImage(null);
    
                // Xử lý ảnh thumbnail nếu có
                if (imageThumnail) {
                    const productId = result.data._id;
                    const formThumbnail = new FormData();
                    formThumbnail.append("image", imageThumnail);
    
                    try {
                        await ProductFetch.addThumbnail(productId, formThumbnail);
                        console.log("Thêm ảnh thumbnail thành công");
                        setImageThumbnail(null);
                    } catch (err) {
                        console.log("Lỗi khi cập nhật ảnh thumbnail:", err);
                        toast.error(`Lỗi khi cập nhật ảnh thumbnail: ${err.message || err}`);
                    }
                }
            } else {
                toast.error("Lỗi từ API khi tạo sản phẩm: " + result.message);
            }
        } catch (err) {
            toast.error("Lỗi khi gửi dữ liệu: " + err.message || err);
        } finally {
            setIsLoading(false);  // Tắt trạng thái loading
        }
    };
    

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const data = await excel.readExcelFile(file);
                console.log('Dữ liệu từ Excel:', data);
                setUsers(data);
            } catch (error) {
                // console.error('Lỗi đọc file:', error);
                toast.error(`Lỗi đọc file: \n ${error}`);
            } finally {
                e.target.value = null;
            }
        }
        e.target.value = null;
    }

    const hanleConfirmMany = () => {
        setIsLoading(true);
        ProductFetch.createProducts(users)
            .then(data => {
                console.log(data);
                toast.success(`Thêm sản phẩm thành công\n ${data.data.message}`)
                setIsLoading(false);
            })
            .catch(err => {
                // console.log(err);
                toast.error(`Tạo sản phẩm thất bại: \n ${err}`);
                setIsLoading(false);
            })
    }

    const handleSubCategoryChange = (e) => {
        setSelectedSubCategory(e.target.value);
    };

    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>Thêm sản phẩm mới</Typography>
                <Box sx={{ width: "400px", marginTop: "20px" }}>
                    {/* Các input thông tin sản phẩm */}
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Tên sản phẩm </Typography>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={myStyle.textFeild} />
                    </Box>
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Mô tả: </Typography>
                        <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} className={myStyle.textFeild} />
                    </Box>
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Kiểu: </Typography>
                        <input type="text" value={type} onChange={(e) => setType(e.target.value)} className={myStyle.textFeild} />
                    </Box>
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Giá: </Typography>
                        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className={myStyle.textFeild} />
                    </Box>
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Số lượng: </Typography>
                        <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} className={myStyle.textFeild} />
                    </Box>

                    {/* Dropdown cho SubCategory */}
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Danh mục: </Typography>
                        <select
                            value={selectedSubCategory}
                            onChange={handleSubCategoryChange}
                            className={myStyle.textFeild}
                        >
                            <option value="">Chọn danh mục sản phẩm</option>
                            {categories?.map((category) =>
                                category.subCategory.map((subCateItem) => (
                                    <option key={subCateItem._id} value={subCateItem._id}>
                                        {subCateItem.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </Box>

                    {/* Chọn ảnh sản phẩm */}
                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Chọn ảnh sản phẩm: </Typography>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className={myStyle.textFeild}
                        />
                        {/* {image && <Typography>Ảnh đã chọn: {image.name}</Typography>} */}
                    </Box>

                    <Box className={myStyle.inputContainer}>
                        <Typography className={myStyle.inputLabel}>Chọn ảnh thumbnail: </Typography>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageThumbnailUpload}
                            className={myStyle.textFeild}
                        />
                        {/* {image && <Typography>Ảnh đã chọn: {image.name}</Typography>} */}
                    </Box>
                
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, marginTop: "20px" }}>
                        <Button disabled={isLoading} onClick={handleCancel} variant="contained" color="secondary">Hủy</Button>
                        <Button disabled={isLoading} onClick={handleConfirm} variant="contained" color="success">Xác nhận</Button>
                    </Box>
                </Box>
            </Box>
            <Divider sx={{ marginY: "20px" }} />

            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>Thêm từ Excel</Typography>
                <Box sx={{}}>
                    <Button variant="contained" color="warning" sx={{ textTransform: "none" }}>
                        <label htmlFor="excel-file">Chọn file</label>
                    </Button>
                    <input
                        onChange={handleFileUpload}
                        id="excel-file" type="file" accept=".xls,.xlsx" style={{ display: 'none' }} />
                </Box>
                {users && (
                    <>
                        <Box sx={{ marginTop: "20px" }}>
                            <Typography>Dữ liệu bạn đã nạp</Typography>
                            <Box className={myStyle.containerTable}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th style={{ width: "16%" }}>Tên sản phẩm</th>
                                            <th style={{ width: "16%" }}>Mô tả</th>
                                            <th style={{ width: "16%" }}>kiểu sản phẩm</th>
                                            <th style={{ width: "16%" }}>Giá</th>
                                            <th style={{ width: "16%" }}>Số lượng</th>
                                            <th style={{ width: "16%" }}>Mã danh mục</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            users?.map((user, index) => (
                                                <tr key={index}>
                                                    <td>{user?.name}</td>
                                                    <td>{user?.desc}</td>
                                                    <td>{user?.type}</td>
                                                    <td>{user?.price}</td>
                                                    <td>{user?.quantity}</td>
                                                    <td>{user?.categoryId}</td>
                                                  
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </Box>
                        </Box>
                        <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: 2 }}>
                            <Button disabled={isLoading} onClick={() => setUsers(null)} variant="contained" color="error" sx={{ textTransform: "none" }}>Hủy</Button>
                            <Button disabled={isLoading} onClick={hanleConfirmMany} variant="contained" color="success" sx={{ textTransform: "none" }}>Xác nhận</Button>
                        </Box>
                    </>
                )}
            </Box>
            <ToastContainer />
        </>
    );
};

export default AddProduct;

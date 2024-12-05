import { useEffect, useRef, useState } from 'react';
import { Modal, Box, Typography, Button, Avatar, Chip, TextField, Divider } from '@mui/material';
import Radio from '@mui/material/Radio';
import { ProductFetch, UserFetch } from '~/REST_API_Client';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { updateProductValidation } from '~/utils/validation';
const DetailAccountModal = ({ open, onClose, product, onChange }) => {
  // if (!product) return null; // Nếu không có product thì không render modal;
  const defaultInfor = useRef({ ...product });
  const [isUpdate, setIsUpdate] = useState(false);
  const [name, setName] = useState();
  const [desc, setDesc] = useState();
  const [type, setType] = useState();
  const [price, setPrice] = useState();
  const [quantity, setQuantity] = useState();
  const [image, setImage] = useState(null)
  const [state, setState] = useState();
  useEffect(() => {
    if (open === true) {
      setIsUpdate(false); setDesc(product?.desc); setName(product?.name); setType(product?.type);
      setPrice(product?.price); setQuantity(product?.quantity); setState(product?.state);
      defaultInfor.current = { ...product };
    }
  }, [open])
  const handleChangeDesc = (event) => {
    setDesc(event.target.value);
  };
  const changeToUnUpdate = () => {
    setIsUpdate(false);
    setDesc(defaultInfor.current?.desc); setName(defaultInfor.current?.name); setType(defaultInfor.current?.type);
    setPrice(defaultInfor.current?.price); setQuantity(defaultInfor.current?.quantity); setState(defaultInfor.current?.state);
  }
  const changeToUpdate = () => {
    setIsUpdate(true);
  }
  const handleChangeName = (e) => {
    setName(e.target.value);
  }
  const handleChangeQuantity = (e) => {
    setQuantity(e.target.value);
  }
  const hanleChangePrice = (e) => {
    setPrice(e.target.value);
  }
  const handleChangeType = (e) => {
    setType(e.target.value);
  }
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
        setImage(file); // Lưu ảnh vào state
    }
}

const validateForm = async () => {
  // Chuyển đổi price và quantity thành số nguyên
  const priceValue = Number(price)
        const quantityValue = Number(quantity)

  // Kiểm tra tính hợp lệ của các trường bằng Yup
  try {
      await updateProductValidation.validate({
          name: name,
          desc: desc,
          type: type,
          price: priceValue,
          quantity: quantityValue,  
      }, { abortEarly: false });

      return true;
  } catch (error) {
      if (error.inner) {
          error.inner.forEach(err => {
              toast.error(err.message);  
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
    const formData = new FormData();
    formData.append("name", name);
    formData.append("desc", desc);
    formData.append("type", type);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("state", JSON.parse(state));
  
    try {
      // Cập nhật thông tin sản phẩm
      const data = await ProductFetch.updateProduct(product._id, formData);
      //window.alert("Cập nhật thông tin sản phẩm thành công");
      const newProduct = data.data;
  
      // Nếu có ảnh (image) mới, gọi API để cập nhật ảnh
      if (image) {
        const imageFormData = new FormData();
        imageFormData.append("image", image);
  
        try {
          await ProductFetch.addThumbnail(product._id, imageFormData);
        } catch (err) {
          console.log("Lỗi khi cập nhật ảnh thumbnail:", err);
          toast.error(`Lỗi khi cập nhật ảnh thumbnail: ${err.message || err}`);
        }
      }
  
      // Cập nhật lại sản phẩm sau khi cập nhật thông tin và ảnh
      onChange(newProduct);
      onClose();
    } catch (err) {
      console.log("Lỗi cập nhật thông tin sản phẩm:", err);
      toast.error(`Lỗi cập nhật thông tin sản phẩm: \n ${err}`);
    }
  };
  

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="product-details-title"
      aria-describedby="product-details-description"
    >
      <Box sx={modalStyle}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }} id="product-details-title">Thông tin cơ bản</Typography>
          {/* <Link to={`/tai-khoan/${product?._id}`}>Xem chi tiết ➡️</Link> */}
        </Box>
        {/* Detail */}
        <Box sx={{ display: "flex", marginTop: "10px", width: "100%" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
            <Typography id="product-details-description"><strong>Mã sản phẩm: </strong>{product?._id}</Typography>
            {
              !isUpdate ? <>
                <Typography><strong>Tên sản phẩm:</strong> {name}</Typography>
                <Typography><strong>Mô tả:</strong> {desc}</Typography>
                <Typography><strong>Loại sản phẩm:</strong>{type}</Typography>
                <Typography><strong>Giá :</strong>{price ? price.toLocaleString('vi-VN') : ''}đ</Typography>
                <Typography><strong>Số lượng:</strong>{quantity}</Typography>
                <Typography><strong>Ngày tạo:</strong>{new Date(product?.createdAt).toLocaleDateString()}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography><strong>Trạng thái tài khoản:</strong></Typography>
                  {state === true ? (
                    quantity > 0 ? (
                      <Chip label="Kinh doanh" color="success" />
                    ) : (
                      <Chip label="Hết hàng" color="warning" />
                    )
                  ) : (
                    <Chip label="Dừng kinh doanh" color="error" />
                  )}

                </Box>
              </> :
                <>
                  {/* Name */}
                  <Box style={inputContainer}>
                    <strong>Tên sản phẩm:</strong>
                    <input style={textFieldStyle} value={name} onChange={handleChangeName} />
                  </Box>
                  {/* Desc */}
                  <Box style={inputContainer}>
                    <strong>Mô tả:</strong>
                    <input style={textFieldStyle} value={type} onChange={handleChangeDesc} />

                  </Box>
                  {/* Type */}
                  <Box style={inputContainer}>
                    <strong>Loại sản phẩm:</strong>
                    <input style={textFieldStyle} value={type} onChange={handleChangeType} />
                  </Box>
                  {/* Price */}
                  <Box style={inputContainer}>
                    <strong>Giá:</strong>
                    <input style={textFieldStyle} value={price} onChange={hanleChangePrice} />
                  </Box>
                  {/* Quantity */}
                  <Box style={inputContainer}>
                    <strong>Số lượng: </strong>
                    <input style={textFieldStyle} value={quantity} onChange={handleChangeQuantity} />
                  </Box>
                  {/* Create date */}
                  <Typography sx={{ display: "flex", justifyContent: "space-between" }}><strong>Ngày tạo:</strong> 22/11/2023</Typography>
                  {/* State */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography><strong>Trạng thái tài khoản:</strong></Typography>

                    {
                      state === true ?
                        <>
                          <Chip label="Đang kinh doanh" color="success" />
                          <Button onClick={() => {
                            setState(false);
                          }}
                            variant='contained' color='error' sx={{ textTransform: "none" }}>Dừng kinh doanh</Button>
                        </>
                        :
                        <>
                          <Chip label="Dừng kinh doanh" color="error" />
                          <Button onClick={() => {
                            setState(true);
                          }}
                            variant='contained' color='success' sx={{ textTransform: "none" }}>Tái kích hoạt</Button>
                        </>
                    }
                  </Box>

                  <Box style={inputContainer}>
                    <strong>Thêm ảnh thumbnail:</strong>
                    <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            //className={myStyle.textFeild}
                        />
                    {/* <input type="file" onChange={handleImageChange} /> */}
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
        <ToastContainer />
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

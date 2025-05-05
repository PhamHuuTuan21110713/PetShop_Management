import { Box, Button, Typography } from '@mui/material';
import myStyle from "../../AccountManager/AddAccount/AddAccount.module.scss";
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { BlogFetch } from '~/REST_API_Client';



const AddBlog = () => {
  const [title, setTitle] = useState();
  const [content, setContent] = useState('');
  const [image, setImage] = useState()
  const handleTabKey = (e) => {
    if (e.key === "Tab") {
      e.preventDefault(); // Ngăn trình duyệt chuyển sang ô nhập khác

      // Lấy vị trí con trỏ trong textarea
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;

      // Thêm một tab vào vị trí con trỏ
      const updatedText = content.substring(0, start) + "  " + content.substring(end);
      setContent(updatedText);

      // Đặt lại vị trí con trỏ sau tab
      setTimeout(() => e.target.selectionStart = e.target.selectionEnd = start + 2, 0);
    }
  };

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  }
  const handleChangeContent = (e) => {
    setContent(e.target.value);
  }

  const parseTextToJSON = (text) => {
    const lines = text.split("\n").filter(line => line.trim() !== ""); // Tách từng dòng, loại bỏ dòng trống
    let contents = []; // Khởi tạo mảng chứa các đối tượng dữ liệu
    let currentTitle = ""; // Biến lưu tiêu đề nội dung hiện tại
    let currentItems = []; // Mảng lưu các mục liên quan đến tiêu đề

    lines.forEach(line => {
      if (!line.startsWith("  ")) { // Kiểm tra nếu là tiêu đề
        if (currentTitle) { // Nếu đã có tiêu đề, lưu lại dữ liệu trước đó
          contents.push({ titleContent: currentTitle, contentItem: currentItems });
          currentItems = []; // Reset danh sách nội dung
        }
        currentTitle = line.trim(); // Cập nhật tiêu đề mới
      } else { // Nếu dòng bắt đầu bằng khoảng trắng => nội dung thuộc tiêu đề trước đó
        currentItems.push(line.trim());
      }
    });

    // Lưu lại phần cuối cùng vào danh sách
    if (currentTitle) {
      contents.push({ titleContent: currentTitle, contentItem: currentItems });
    }

    return { contents }; // Trả về object JSON chứa danh sách nội dung
  };

  const handleSubmit = async () => {
    const parseData = parseTextToJSON(content)

    const formData = new FormData();
    formData.append("title", title);
    formData.append("contents", JSON.stringify(parseData.contents));


    if (image) {
      formData.append("image", image);

    }

    console.log("data create blog: ", formData);


    try {
      const result = await BlogFetch.createBlog(formData)
      console.log("result: ", result);
      if (result.status == "OK") {

        toast.success("Thêm bài viết thành công")
        setTitle("")
        setContent("")
        setImage(null)
      }
    }
    catch (error) {
      toast.error(`Lỗi khi tạo bài viết: \n ${error}`);
    }
  }

  const handleUnSubmit = () => {
    setTitle('')
    setContent('')
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Lưu ảnh vào state
    }
  }
  return (
    <div>
      {/* Change Title */}
      <Box style={inputContainer}>
        <strong>Tên tiêu đề:</strong>
        <input style={textFieldStyle} value={title} onChange={handleChangeTitle} />
      </Box>

      {/* Change Content */}
      <Box sx={{ height: 200 }} style={inputContainer}>
        <strong>Nội dung:</strong>
        {/* <input style={textFieldStyle} value={content} onChange={handleChangeContent} /> */}
        <textarea
          style={{ height: "100%", width: "80%" }}
          onKeyDown={handleTabKey}
          value={content} onChange={handleChangeContent} placeholder="Nhập nội dung..."></textarea>
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

      <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
        <Button variant='contained' color="primary" onClick={handleSubmit}>Xác nhận</Button>
        <Button variant='contained' color="secondary" onClick={handleUnSubmit} sx={{ marginLeft: "10px" }}>
          Hủy
        </Button>
      </Box>
      <ToastContainer />
    </div>
  )
}

const inputContainer = {
  display: "flex",
  gap: 4,
  marginTop: 8,
  alignItems: "center",
  justifyContent: "space-between"
};

const textFieldStyle = {
  height: "40px",
  width: "80%"
}

export default AddBlog

import { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, Chip, Divider, TextField } from '@mui/material';
import { BlogFetch, PromotionFetch } from '~/REST_API_Client';  // Import API to handle the update if needed
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
const BlogModal = ({ open, onClose, blog }) => {
    const [isUpdate, setIsUpdate] = useState(false);
    const [blogDetails, setBlogDetails] = useState(blog);
    const [title, setTitle] = useState();
    const [content, setContent] = useState('');
    // const [type, setType] = useState('');
    // const [value, setValue] = useState('');
    // const [startDate, setStartDate] = useState('');
    // const [endDate, setEndDate] = useState('');
    const [state, setState] = useState(); // Default active state
    // const [statusChange, setStatusChange] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        if (open) {
            setBlogDetails(blog);
            setIsUpdate(false);
            // setState(promotion?.state);
            setTitle(blog?.title || '');
            // Ghép tiêu đề và nội dung với xuống dòng
            const formattedContent = blog?.contents.map(
                (section) => `${section.titleContent}\n${section.contentItem.map(item => `  ${item}`).join("\n")}`
            ).join("\n\n"); // Cách nhau 2 dòng giữa các phần

            setContent(formattedContent);
            setState(blog?.state)
        }
    }, [open, blog]);

    const changeToUpdate = () => {
        setIsUpdate(true);
    };

    const changeToUnUpdate = () => {
        setIsUpdate(false);
    };

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
    }
    const handleChangeContent = (e) => {
        setContent(e.target.value);
    }

    console.log("detail: ", blogDetails);

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


    //const handleUpdateBlog = async (blogDetails, newState) => {
    const handleUpdateBlog = async () => {
        try {
            const parsedData = parseTextToJSON(content);
            const formData = {
                title: title,
                contents: parsedData.contents,
                state: state
            };

            console.log("Thông tin update: ", formData);

            // Gọi API để cập nhật
            const data = await BlogFetch.updateBlog(blogDetails?._id, formData);

            // Cập nhật thông tin blog mới
            setBlogDetails(data.data);

            // Đóng modal nếu có (onClose là hàm bạn gọi để đóng modal)
            //onChange(data?.data)
            onClose();

            // Điều hướng về trang allBlogs sau khi cập nhật
            //navigate("/quan-ly-bai-viet/danh-sach-bai-viet");
        } catch (err) {
            console.error("Lỗi khi cập nhật bài viết:", err);
            toast.error(`Lỗi cập nhật bài viết: ${err.message}`);
        }
    };

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

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="blog-details-title"
            aria-describedby="blog-details-description"
        >
            <Box sx={modalStyle}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }} id="blog-details-title">
                        Thông tin chi tiết của bài viết
                    </Typography>
                </Box>

                <Box sx={{ marginTop: "10px" }}>
                    <Typography><strong>Mã bài viết:</strong> {blogDetails?._id}</Typography>
                    {
                        !isUpdate ? <>
                            <Typography><strong>Tiêu đề bài viết: </strong> {blogDetails?.title}</Typography>
                            {/* <Typography><strong>Nội dung:</strong></Typography>
                            {blogDetails?.contents.map((content, index) => (
                                <Box key={index}>
                                    <Typography key={index}><strong>*</strong> {content?.titleContent}</Typography>

                                    {content?.contentItem.map((item, index) => (
                                        <Typography key={index}> {item}</Typography>

                                    ))}
                                </Box>


                            ))} */}
                            <Typography><strong>Nội dung:</strong></Typography>
                            <Box sx={{ maxHeight: 500, overflowY: "auto", paddingRight: 1 }}>
                                {blogDetails?.contents.map((content, index) => (
                                    <Box key={index} sx={{ marginBottom: 2 }}>
                                        <Typography><strong>*</strong> {content?.titleContent}</Typography>
                                        {content?.contentItem.map((item, idx) => (
                                            <Typography key={idx} sx={{ pl: 2 }}>- {item}</Typography>
                                        ))}
                                    </Box>
                                ))}
                            </Box>

                        </>
                            :
                            <>
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
                            </>

                    }
                    {/* 
                    <Divider sx={{ margin: "10px 0" }} />

                    <Typography><strong>Trạng thái:</strong></Typography>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        {blogDetails?.data?.state === true ? (
                            <Chip label="Đang hoạt động" color="success" />
                        ) : (
                            <Chip label="Đã kết thúc" color="error" />
                        )}
                        {
                            blogDetails?.data?.state === true ? (
                                <button
                                    onClick={() => handleUpdateBlog(blogDetails, false)}
                                    style={{
                                        border: "none",
                                        cursor: "pointer",
                                        padding: '8px 4px',
                                        color: "#fff",
                                        background: "#b55050",
                                        borderRadius: "4px"
                                    }}
                                >
                                    Dừng chương trình
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleUpdateBlog(blogDetails, true)}
                                    style={{
                                        border: "none",
                                        padding: '8px 4px',
                                        cursor: "pointer",
                                        color: "#fff",
                                        background: "#50c77f",
                                        borderRadius: "4px"
                                    }}
                                >

                                    Khởi động
                                </button>
                            )
                        }

                    </Box> */}

                </Box>

                {!isUpdate ? (
                    <Box sx={{ marginTop: "20px", float: "right" }}>
                        <Button variant='contained' onClick={changeToUpdate}>Chỉnh sửa bài viết</Button>
                    </Box>
                ) : (
                    <Box>

                        <Divider sx={{ margin: "10px 0" }} />

                        <Typography><strong>Trạng thái:</strong></Typography>
                        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                            {state === true ? (
                                <Chip label="Đang hoạt động" color="success" />
                            ) : (
                                <Chip label="Đã kết thúc" color="error" />
                            )}
                            {
                                state === true ? (
                                    <button
                                        onClick={() => setState(false)}
                                        style={{
                                            border: "none",
                                            cursor: "pointer",
                                            padding: '8px 4px',
                                            color: "#fff",
                                            background: "#b55050",
                                            borderRadius: "4px"
                                        }}
                                    >
                                        Dừng chương trình
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setState(true)}
                                        style={{
                                            border: "none",
                                            padding: '8px 4px',
                                            cursor: "pointer",
                                            color: "#fff",
                                            background: "#50c77f",
                                            borderRadius: "4px"
                                        }}
                                    >

                                        Khởi động
                                    </button>
                                )
                            }

                        </Box>

                        <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                            <Button variant='contained' color="primary" onClick={handleUpdateBlog}>Xác nhận</Button>
                            <Button variant='contained' color="secondary" onClick={changeToUnUpdate} sx={{ marginLeft: "10px" }}>
                                Hủy
                            </Button>
                        </Box>
                    </Box>
                )}
                <ToastContainer />
            </Box>

        </Modal>
    );
};

// Style for modal
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
    marginTop: 8,
    alignItems: "center",
    justifyContent: "space-between"
};

const textFieldStyle = {
    height: "40px",
    width: "80%"
}
export default BlogModal;

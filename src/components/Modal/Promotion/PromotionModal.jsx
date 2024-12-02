import { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, Chip, Divider, TextField } from '@mui/material';
import { PromotionFetch } from '~/REST_API_Client';  // Import API to handle the update if needed
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const PromotionModal = ({ open, onClose, promotion }) => {
    const [isUpdate, setIsUpdate] = useState(false);
    const [promotionDetails, setPromotionDetails] = useState(promotion);
    // const [name, setName] = useState('');
    // const [description, setDescription] = useState('');
    // const [type, setType] = useState('');
    // const [value, setValue] = useState('');
    // const [startDate, setStartDate] = useState('');
    // const [endDate, setEndDate] = useState('');
    // const [state, setState] = useState(true); // Default active state
    // const [statusChange, setStatusChange] = useState('');

    useEffect(() => {
        if (open) {
            setPromotionDetails(promotion);
            setIsUpdate(false);
            // setState(promotion?.state);
            // setName(promotion?.name || '');
            // setDescription(promotion?.description || '');
            // setType(promotion?.type || '');
            // setValue(promotion?.value || '');
            // setStartDate(promotion?.startDate || '');
            // setEndDate(promotion?.endDate || '');
        }
    }, [open, promotion]);

    // const changeToUpdate = () => {
    //     setIsUpdate(true);
    // };

    // const changeToUnUpdate = () => {
    //     setIsUpdate(false);
    // };


    const updateStatePromotion = async (promotionDetails, newState) => {
        const formData = {
            state: newState
        };

        // Gọi API để cập nhật
        PromotionFetch.updatePromotion(promotionDetails?._id, formData)
            .then(data => {
                // Cập nhật thông tin khuyến mãi mới
                const updatedPromotion = data.data;
                setPromotionDetails(updatedPromotion);  // Cập nhật lại chi tiết khuyến mãi
            })
            .catch(err => {
                toast.error(`Lỗi cập nhật trạng thái khuyến mãi: \n ${err}`);
            });
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="promotion-details-title"
            aria-describedby="promotion-details-description"
        >
            <Box sx={modalStyle}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }} id="promotion-details-title">
                        Thông tin chi tiết của khuyến mãi
                    </Typography>
                </Box>

                <Box sx={{ marginTop: "10px" }}>
                    <Typography><strong>Mã Chương trinh:</strong> {promotionDetails?._id}</Typography>
                    <Typography><strong>Tên chương trình:</strong> {promotionDetails?.name}</Typography>
                    <Typography><strong>Mô tả:</strong> {promotionDetails?.description}</Typography>
                    <Typography><strong>Kiểu khuyến mãi:</strong> {promotionDetails?.type}</Typography>
                    <Typography><strong>Trị giá:</strong> {promotionDetails?.value}</Typography>
                    <Typography><strong>Ngày bắt đầu:</strong> {new Date(promotionDetails?.startDate).toLocaleDateString()}</Typography>
                    <Typography><strong>Ngày kết thúc:</strong> {new Date(promotionDetails?.endDate).toLocaleDateString()}</Typography>

                    <Divider sx={{ margin: "10px 0" }} />

                    <Typography><strong>Trạng thái:</strong></Typography>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        {promotionDetails?.state === true ? (
                            <Chip label="Đang hoạt động" color="success" />
                        ) : (
                            <Chip label="Đã kết thúc" color="error" />
                        )}
                        {
                            promotionDetails?.state === true ? (
                                <button
                                    onClick={() => updateStatePromotion(promotionDetails, false)}
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
                                    onClick={() => updateStatePromotion(promotionDetails, true)}
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

                </Box>

                {/* {!isUpdate ? (
                    <Box sx={{ marginTop: "20px", float: "right" }}>
                        <Button variant='contained' onClick={changeToUpdate}>Cập nhật trạng thái</Button>
                    </Box>
                ) : (
                    <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                        <Button variant='contained' color="primary" onClick={handleConfirm}>Xác nhận</Button>
                        <Button variant='contained' color="secondary" onClick={changeToUnUpdate} sx={{ marginLeft: "10px" }}>
                            Hủy
                        </Button>
                    </Box>
                )} */}
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
    alignItems: "center",
    justifyContent: "space-between"
};

const textFieldStyle = {
    height: "40px",
    width: "200px"
}
export default PromotionModal;

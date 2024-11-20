import { useEffect, useRef, useState } from "react";
import myStyle from "./AllAccount.module.scss";
import { Box, Button, Pagination, Tooltip, Typography, CircularProgress, Chip } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DetailsIcon from '@mui/icons-material/Details';
import DetailAccountModal from "../../../components/Modal/Account/DetailAccountModal";
import { UserFetch } from "~/REST_API_Client";
const AllAccount = () => {
    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState();

    const indexUser = useRef(0);
    useEffect(() => {
        UserFetch.get()
            .then(data => {
                // console.log("data: ", data);
                setUsers(data.data);
                setIsLoading(false)
            })
            .catch(err => {
                // console.log("ërr: ", err);
                window.alert(`Lỗi lấy dữ liệu người dùng: \n ${err}`)
            })
    }, []);
    const onChangeUsers = (data) => {
        const newUsers = [...users];
        newUsers[indexUser.current] = data;
        setUsers(newUsers);
    }
    const handleCloseModal = () => {
        setOpenModal(false);
    }
    const handleOpenModal = (index) => {
        indexUser.current = index;
        setOpenModal(true);
    }
    const updateStateUser = async (user, newState,index) => {
        const formData = new FormData();
        formData.append("name", user?.name);
        formData.append("email", user?.email);
        formData.append("phone", user?.phone);
        formData.append("gender", user?.gender);
        formData.append("address", user?.address);
        formData.append("state", newState);
        UserFetch.updateInfo(user?._id, formData)
            .then(data => {
                // console.log("cap nhat thanh con: ", data);
                // window.alert("Cập nhật thông tin người dùng thành công");
                const userData = data.data;
                // setgender(newUser?.gender); setName(newUser?.name); setEmail(newUser?.email);
                // setPhone(newUser?.phone); setAddress(newUser?.address); setState(newUser?.state);
                // defaultInfor.current = { ...newUser };
                const newUsers = [...users];
                newUsers[index] = userData;
                setUsers(newUsers);
            })
            .catch(err => {
                window.alert(`Lỗi cập nhật dữ liệu người dùng: \n ${err}`)
            })
    }
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
            </Box>
        )
    }
    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                    {/* Tìm kiếm */}
                    <Box sx={{ display: "flex", alignItems: "center", border: "solid 1px #000", width: "400px", gap: "2px", borderRadius: "20px", overflow: "hidden" }}>
                        <input className={myStyle.searchInput} placeholder="Tìm kiếm" type="text" />
                        <button className={myStyle.searchButton}><SearchIcon /></button>
                    </Box>
                </Box>
                {/* Sắp xếp */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>Sắp xếp: </Typography>
                    <Button sx={{ textTransform: "none" }} variant="contained">Mặc định</Button>
                    <Button sx={{ textTransform: "none" }} variant="outlined">Theo tên</Button>
                </Box>

            </Box>
            {/* Bộ lọc */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: "20px" }}>
                <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>Bộ lọc: </Typography>
                <Button sx={{ textTransform: "none" }} variant="contained">Đang hoạt động</Button>
                <Button sx={{ textTransform: "none" }} variant="outlined">Hủy kích hoạt</Button>
            </Box>
            {/* Table */}
            <Box sx={{ marginTop: "20px" }}>
                <Box className={myStyle.tableContainer}>
                    <table>
                        <thead>
                            <tr>

                                <th style={{ width: "15%" }}>ID</th>
                                <th style={{ width: "20%" }}>Tên</th>
                                <th style={{ width: "20%" }}>Email</th>
                                <th style={{ width: "15%" }}>Số điện thoại</th>
                                <th style={{ width: "10%" }}>Trạng thái</th>
                                <th style={{ width: "20%" }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users?.map((user, index) => {
                                    return (
                                        <tr key={index}>

                                            <td>{user?._id}</td>
                                            <td>{user?.name}</td>
                                            <td>{user?.email}</td>
                                            <td>{user?.phone}</td>
                                            <td>
                                                {
                                                    user?.state === 1 ? <Chip label="hoạt động" color="success" /> :
                                                        <Chip label="đã khóa" color="error" />
                                                }

                                            </td>
                                            <td >
                                                <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                                                    <Tooltip title="Chi tiết">
                                                        <button
                                                            onClick={() => {
                                                                handleOpenModal(index)
                                                            }}
                                                            style={{ border: "none", cursor: "pointer", color: "#fff", background: "#346791", borderRadius: "4px" }}>
                                                            <DetailsIcon />
                                                        </button>
                                                    </Tooltip>
                                                    {
                                                        user?.state === 1 ?
                                                            (
                                                                <Tooltip title="khóa tài khoản">
                                                                    <button
                                                                        onClick={() => updateStateUser(user, 0,index)}
                                                                        style={{ border: "none", cursor: "pointer", color: "#fff", background: "#b55050", borderRadius: "4px" }}>
                                                                        <LockIcon />
                                                                    </button>
                                                                </Tooltip>
                                                            ) :
                                                            (
                                                                <Tooltip title="mở khóa tài khoản">
                                                                    <button
                                                                        onClick={() => updateStateUser(user, 1,index)}
                                                                        style={{ border: "none", cursor: "pointer", color: "#fff", background: "#50c77f", borderRadius: "4px" }}>
                                                                        <LockOpenIcon />
                                                                    </button>
                                                                </Tooltip>
                                                            )
                                                    }

                                                </Box>
                                            </td>
                                        </tr>
                                    )
                                })
                            }

                        </tbody>
                    </table>

                </Box>
            </Box>

            <Box sx={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
                <Pagination />
            </Box>
            <DetailAccountModal open={openModal} onClose={handleCloseModal} user={users[indexUser.current]} onChange={onChangeUsers} />
        </Box>
    )
}

export default AllAccount;
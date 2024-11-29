import { useEffect, useRef, useState } from "react";
import myStyle from "./AllAccount.module.scss";
import { Box, Button, Pagination, Tooltip, Typography, CircularProgress, Chip } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DetailsIcon from '@mui/icons-material/Details';
import DetailAccountModal from "../../../components/Modal/Account/DetailAccountModal";
import { UserFetch } from "~/REST_API_Client";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const AllAccount = () => {
    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState();
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("default");
    const [find, setFind] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const indexUser = useRef(0);
    const fetchUser = (paged, sorted, filtered, finded) => {
        let sorting; let filtering; let finding;
        let paging = paged; let limiting = 7;
        if (sorted === "default") {
            sorting = { createdAt: -1 }
        } else {
            sorting = { name: 1 }
        }
        if (finded !== "") finding = finded;
        if (filtered === "active") {
            filtering = { state: 1 }
        } else if (filtered === "lock") {
            filtering = { state: 0 }
        }
        setIsLoading(true);
        UserFetch.get({ paging, limiting }, sorting, finding, filtering)
            .then(data => {
                // console.log("data: ", data);
                setUsers(data.data);
                setTotalPages(data.totalPages)
                setIsLoading(false)
            })
            .catch(err => {
                // console.log("ërr: ", err);
                toast.error(`Lỗi lấy dữ liệu người dùng: \n ${err}`)
            })
    }
    useEffect(() => {
        // console.log("filter: ", filter);
        fetchUser(page, sort, filter, find);
    }, [page, sort, filter]);
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
    const updateStateUser = async (user, newState, index) => {
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
                console.log("users: ",)
                const newUsers = [...users];
                newUsers[index] = userData;
                setUsers(newUsers);
            })
            .catch(err => {
                toast.error(`Lỗi cập nhật dữ liệu người dùng: \n ${err}`)
            })
    }
    const handleSort = (type) => {
        setSort(type);
    }
    const handleFilter = (type) => {
        setFilter(type)
    }
    const handleChangeFind = (e) => {
        setFind(e.target.value);
    }
    const handleSearch = () => {
        fetchUser(page, sort, filter, find);
    }
    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                    {/* Tìm kiếm */}
                    <Box sx={{ display: "flex", alignItems: "center", border: "solid 1px #000", width: "400px", gap: "2px", borderRadius: "20px", overflow: "hidden" }}>
                        <input className={myStyle.searchInput} placeholder="Tìm kiếm" type="text" value={find} onChange={handleChangeFind} />
                        <button onClick={handleSearch} className={myStyle.searchButton}><SearchIcon /></button>
                    </Box>
                </Box>
                {/* Sắp xếp */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>Sắp xếp: </Typography>
                    <Button
                        onClick={() => handleSort("default")}
                        sx={{ textTransform: "none" }}
                        variant={sort === "default" ? "contained" : "outlined"}>
                        Mặc định
                    </Button>
                    <Button
                        onClick={() => handleSort("name")}
                        sx={{ textTransform: "none" }}
                        variant={sort === "name" ? "contained" : "outlined"}>
                        Theo tên
                    </Button>
                </Box>

            </Box>
            {/* Bộ lọc */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: "20px" }}>
                <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>Bộ lọc: </Typography>
                <Button
                    onClick={() => handleFilter("all")}
                    sx={{ textTransform: "none" }}
                    variant={filter === "all" ? "contained" : "outlined"}>
                    Tất cả
                </Button>
                <Button
                    onClick={() => handleFilter("active")}
                    sx={{ textTransform: "none" }}
                    variant={filter === "active" ? "contained" : "outlined"}>
                    Đang hoạt động
                </Button>
                <Button
                    onClick={() => handleFilter("lock")}
                    sx={{ textTransform: "none" }}
                    variant={filter === "lock" ? "contained" : "outlined"}>
                    Đã khóa
                </Button>
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
                                isLoading ?
                                    (
                                        <tr>
                                            <td colSpan={6} style={{ textAlign: "center" }}>
                                                <CircularProgress />
                                            </td>
                                        </tr>
                                    ) :
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
                                                                    user?.role === "admin" ? null :
                                                                    <Tooltip title="khóa tài khoản">
                                                                        <button
                                                                            onClick={() => updateStateUser(user, 0, index)}
                                                                            style={{ border: "none", cursor: "pointer", color: "#fff", background: "#b55050", borderRadius: "4px" }}>
                                                                            <LockIcon />
                                                                        </button>
                                                                    </Tooltip>
                                                                ) :
                                                                (
                                                                    <Tooltip title="mở khóa tài khoản">
                                                                        <button
                                                                            onClick={() => updateStateUser(user, 1, index)}
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

            {
                isLoading ? null :
                    <>
                        <Box sx={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
                            <Pagination page={page} onChange={(e, value) => setPage(value)} count={totalPages} size="small" />
                        </Box>
                        <DetailAccountModal open={openModal} onClose={handleCloseModal} user={users[indexUser.current]} onChange={onChangeUsers} />
                    </>
            }
            <ToastContainer />
        </Box>
    )
}

export default AllAccount;
import { useEffect, useRef, useState } from "react";
import myStyle from "./AllServices.module.scss";
import { Box, Button, Pagination, Tooltip, Typography, CircularProgress, Chip } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import LockIcon from '@mui/icons-material/Lock';
import DeleteIcon from '@mui/icons-material/Delete';
import DetailsIcon from '@mui/icons-material/Details';
import { ServiceFetch } from "~/REST_API_Client";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const AllServices = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState();
    const [sort, setSort] = useState("default");
    const [find, setFind] = useState("");

    const fetchData = (sorted, finded) => {
        let finding;
        let sorting;
        if (finded !== "") finding = finded;
        if (sorted === "default") {
            sorting = { createdAt: -1 }
        } else {
            sorting = { name: 1 }
        }
        setIsLoading(true);
        ServiceFetch.get(sorting, { state: true }, finding)
            .then(data => {
                // console.log("Service", data)
                setData(data);
                setIsLoading(false)
            })
            .catch(err => {
                toast.error(`Lỗi lấy thông tin dịch vụ: \n${err}`);
            })
    }

    const handleSort = (type) => {
        setSort(type);
    }
    const handleFind = () => {
        fetchData(sort, find)
    }
    useEffect(() => {
        fetchData(sort, find);
    }, [sort]);
    const navToDetail = (id) => {
        navigate(`/dich-vu/${id}`);
    }
    const handleDelete = (id) => {
        ServiceFetch.deleteById(id)
            .then(data => {
                fetchData(sort,find);
            })
            .catch(err => {
                toast.error(`Xóa dịch vụ thất bại: \n${err}`);
            })
    }
    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
                <Box>
                    {/* Tìm kiếm */}
                    <Box sx={{ display: "flex", alignItems: "center", border: "solid 1px #000", width: "400px", gap: "2px", borderRadius: "20px", overflow: "hidden" }}>
                        <input className={myStyle.searchInput} value={find} onChange={(e) => setFind(e.target.value)} placeholder="Tìm kiếm" type="text" />
                        <button onClick={handleFind} className={myStyle.searchButton}><SearchIcon /></button>
                    </Box>
                </Box>
                {/* Sắp xếp */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: "4px" }}>
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
            {/* <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: "20px" }}>
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
            </Box> */}
            {/* Table */}
            <Box sx={{ marginTop: "20px" }}>
                <Box className={myStyle.tableContainer}>
                    <table>
                        <thead>
                            <tr>

                                <th style={{ width: "20%" }}>STT</th>
                                <th style={{ width: "40%" }}>Tên</th>
                                <th style={{ width: "20%" }}>Chi tiết</th>
                                <th style={{ width: "20%" }}>Xóa</th>
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
                                    data.data.map((item, index) => {
                                        return (
                                            <tr key={index}>

                                                <td>{index+1}</td>
                                                <td>{item.name}</td>
                                                <td>
                                                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>

                                                        <button
                                                            onClick={() => navToDetail(item._id)}
                                                            style={{ border: "none", cursor: "pointer", color: "#fff", background: "#346791", borderRadius: "4px" }}>
                                                            <DetailsIcon />
                                                        </button>

                                                    </Box>
                                                </td>
                                                <td>
                                                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                                                        <button
                                                            onClick={() => handleDelete(item._id)}
                                                            style={{ border: "none", cursor: "pointer", color: "#fff", background: "#b55050", borderRadius: "4px" }}>
                                                            <DeleteIcon />
                                                        </button>
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
            <ToastContainer />
        </Box>
    )
}

export default AllServices;
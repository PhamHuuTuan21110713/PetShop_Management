import React from 'react'
import { useEffect, useRef, useState } from "react";
import myStyle from "~/pages/AccountManager/AllAccount/AllAccount.module.scss";
import { Box, Button, Pagination, Tooltip, Typography, CircularProgress } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import DetailsIcon from '@mui/icons-material/Details';
import { BlogFetch } from "~/REST_API_Client";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import BlogModal from '~/components/Modal/Blog/BlogModal';
const AllBlog = () => {
    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    //const [totalPage, setTotalPage] = useState(1);
    const limit = 8;
    const [sort, setSort] = useState("default");
    const [find, setFind] = useState("");
    const indexProduct = useRef(0);

    const fetchData = async (page, limit, sort) => {
        setIsLoading(true);
        try {
            const data = await BlogFetch.getAllBlog(page, limit, sort)
            console.log("data blog response: ", data);

            setData(data.data);
            setIsLoading(false)

        } catch (err) {
            toast.error(`Lỗi lấy thông tin dịch vụ: \n${err}`);
            setIsLoading(false)
        }

    }
    useEffect(() => {
        fetchData(currentPage, limit, sort); // Lấy dữ liệu khuyến mãi khi page hoặc filters thay đổi và khi tìm kiếm
    }, [currentPage, sort]);
    useEffect(() => {
        fetchData(currentPage, limit, sort); // Lấy dữ liệu khuyến mãi khi page hoặc filters thay đổi và khi tìm kiếm
    }, [openModal === false]);

    console.log("data: ", data);


    const handleOpenModal = (index) => {
        indexProduct.current = index;
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleSort = (type) => {
        setSort(type);
    }
    const handleFind = () => {
        fetchData(sort, find)
    }
    const handlePageChange = (e, newPage) => {
        console.log("newpage", newPage);

        setCurrentPage(newPage); // Cập nhật giá trị page
        fetchData(currentPage, limit, sort);
    };

    const handleDelete = async (id) => {
        try {
            await BlogFetch.deleteById(id)
            fetchData(currentPage, limit, sort);
        }
        catch (err) {
            toast.error(`Xóa dịch vụ thất bại: \n${err}`);
        }
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
                    <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>Lọc: </Typography>
                    <Button
                        onClick={() => handleSort("all")}
                        sx={{ textTransform: "none" }}
                        variant={sort === "all" ? "contained" : "outlined"}>
                        Tất cả
                    </Button>
                    <Button
                        onClick={() => handleSort("true")}
                        sx={{ textTransform: "none" }}
                        variant={sort === "true" ? "contained" : "outlined"}>
                        Hoạt động
                    </Button>
                    <Button
                        onClick={() => handleSort("false")}
                        sx={{ textTransform: "none" }}
                        variant={sort === "false" ? "contained" : "outlined"}>
                        Đã ẩn
                    </Button>
                </Box>

            </Box>

            {/* Table */}
            <Box sx={{ marginTop: "20px" }}>
                <Box className={myStyle.tableContainer}>
                    <table>
                        <thead>
                            <tr>

                                <th style={{ width: "20%" }}>STT</th>
                                <th style={{ width: "40%" }}>Tiêu đề</th>
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
                                    data?.blogs.map((item, index) => {
                                        return (
                                            <tr key={index}>

                                                <td>{index + 1}</td>
                                                <td>{item.title}</td>
                                                <td>
                                                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>

                                                        <Tooltip title="Chi tiết">
                                                            <button
                                                                onClick={() => handleOpenModal(index)}
                                                                style={{
                                                                    border: "none",
                                                                    cursor: "pointer",
                                                                    color: "#fff",
                                                                    background: "#346791",
                                                                    borderRadius: "4px"
                                                                }}>
                                                                <DetailsIcon />
                                                            </button>
                                                        </Tooltip>

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
                    <Box sx={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
                        <Pagination
                            page={currentPage}
                            onChange={handlePageChange}
                            count={data?.blogs.totalPage} // Tính số trang dựa trên tổng số sản phẩm
                            size="small"
                        />
                    </Box>
                    <BlogModal open={openModal} onClose={handleCloseModal} blog={data?.blogs[indexProduct.current]}
                    //onChange={onChangeBlogs}
                    />

                </Box>
            </Box>
            <ToastContainer />
        </Box>
    )
}

export default AllBlog

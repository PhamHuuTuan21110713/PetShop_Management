import myStyle from "../AccountManager/AccountManager.module.css";

import { Box, Typography } from "@mui/material"
import { NavLink, Outlet } from "react-router-dom";
import { CategoryFetch } from "~/REST_API_Client"; // Assuming this is your API client for categories
import React, { useEffect, useState } from "react";

const styleNavlink = ({ isActive }) => {
    return {
        backgroundColor: isActive ? "#346791" : null,
        color: isActive ? "#fff" : null
    }
}



const Products = () => {
    const [categories, setCategories] = useState([]);

    // Fetch danh sách categories khi component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await CategoryFetch.get();
                setCategories(data.data); // Lưu danh sách categories vào state
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);
    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1 }}>
                <NavLink style={styleNavlink} to="danh-sach-san-pham" className={myStyle.tabContainer}>
                    <Typography>Danh sách</Typography>
                </NavLink>
                <NavLink style={styleNavlink} to="them-san-pham" className={myStyle.tabContainer}>
                    <Typography>Thêm mới</Typography>
                </NavLink>
            </Box>
            <Box sx={{ border: "solid 1px #ebebeb", marginTop: "4px", padding: "20px", maxHeight: "610px", overflowY: "auto" }}>
                <Outlet context={{ categories }} />
            </Box>
        </Box>
    )
}

export default Products
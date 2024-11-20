import myStyle from "./TopProduct.module.scss";
import { Box, Typography, Button } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from "react";
const TopProducts = () => {
    const [showSubMenu, setShowSubMenu] = useState(false);
    const handleExpand = () => {
        setShowSubMenu(!showSubMenu);
    }
    const handleQuery = async (type) => {
        // Xử lý với type:

        setShowSubMenu(false)
    }
    return (
        <Box sx={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;", padding: "5px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", position: "relative" }}>

                <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", paddingX: "10px" }}>Top sản phẩm</Typography>
                <Box sx={{ cursor: "pointer" }} onClick={handleExpand}>
                    <MoreVertIcon />
                </Box>
                {
                    showSubMenu ? (
                        <Box sx={{ position: "absolute", backgroundColor: "#fff", boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", right: "10px", top: "30px", zIndex: "1000" }}>
                            <Box className={myStyle.subMenuContainer} onClick={() => {
                                handleQuery("pre")
                            }}>
                                <Typography>Tháng này</Typography>
                            </Box>
                            <Box className={myStyle.subMenuContainer} onClick={() => handleQuery("curr")}>
                                <Typography>Tháng trước</Typography>
                            </Box>
                        </Box>
                    ) : null
                }

            </Box>
            <Box sx={{ maxHeight: "390px", overflowY: "auto", padding: "5px" }} >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {/* Snar pham item */}
                    <Box sx={{ padding: "10px" }}>
                        {/* Item */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}>
                            <Box sx={{ width: "50px", height: "50px", backgroundColor: "red" }}>
                                <img />
                            </Box>
                            <Box>
                                <Typography>Thức ăn cho chó fimora</Typography>
                                <Typography>
                                    Đã bán: <span style={{ fontWeight: "bold", color: "#de5945" }}>100</span>
                                </Typography>
                            </Box>
                            <Box sx={{ justifyItems: "flex-end" }}>
                                <Button variant="contained">Chi tiết</Button>
                            </Box>
                        </Box>
                    </Box>
                    {/* Snar pham item */}
                    <Box sx={{ padding: "10px" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}>
                            <Box sx={{ width: "50px", height: "50px", backgroundColor: "red" }}>
                                <img />
                            </Box>
                            <Box>
                                <Typography>Thức ăn cho chó fimora</Typography>
                                <Typography>
                                    Đã bán: <span style={{ fontWeight: "bold", color: "#de5945" }}>100</span>
                                </Typography>
                            </Box>
                            <Box sx={{ justifyItems: "flex-end" }}>
                                <Button variant="contained">Chi tiết</Button>
                            </Box>
                        </Box>
                    </Box>
                    {/* Snar pham item */}
                    <Box sx={{ padding: "10px" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}>
                            <Box sx={{ width: "50px", height: "50px", backgroundColor: "red" }}>
                                <img />
                            </Box>
                            <Box>
                                <Typography>Thức ăn cho chó fimora</Typography>
                                <Typography>
                                    Đã bán: <span style={{ fontWeight: "bold", color: "#de5945" }}>100</span>
                                </Typography>
                            </Box>
                            <Box sx={{ justifyItems: "flex-end" }}>
                                <Button variant="contained">Chi tiết</Button>
                            </Box>
                        </Box>
                    </Box>
                    {/* Snar pham item */}
                    <Box sx={{ padding: "10px" }}>
                        {/* Item */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}>
                            <Box sx={{ width: "50px", height: "50px", backgroundColor: "red" }}>
                                <img />
                            </Box>
                            <Box>
                                <Typography>Thức ăn cho chó fimora</Typography>
                                <Typography>
                                    Đã bán: <span style={{ fontWeight: "bold", color: "#de5945" }}>100</span>
                                </Typography>
                            </Box>
                            <Box sx={{ justifyItems: "flex-end" }}>
                                <Button variant="contained">Chi tiết</Button>
                            </Box>
                        </Box>
                    </Box>
                    {/* Snar pham item */}
                    <Box sx={{ padding: "10px" }}>
                        {/* Item */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}>
                            <Box sx={{ width: "50px", height: "50px", backgroundColor: "red" }}>
                                <img />
                            </Box>
                            <Box>
                                <Typography>Thức ăn cho chó fimora</Typography>
                                <Typography>
                                    Đã bán: <span style={{ fontWeight: "bold", color: "#de5945" }}>100</span>
                                </Typography>
                            </Box>
                            <Box sx={{ justifyItems: "flex-end" }}>
                                <Button variant="contained">Chi tiết</Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default TopProducts;
import { Box, Button, Pagination, Tooltip, Typography, CircularProgress, Chip } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import myStyle from './AllBookings.module.scss';
const AllBooking = () => {
    return (
        <Box>
            <Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between",flexWrap:"wrap" }}>
                    <Box>
                        {/* Tìm kiếm */}
                        <Box sx={{ display: "flex", alignItems: "center", border: "solid 1px #000", width: "400px", gap: "2px", borderRadius: "20px", overflow: "hidden" }}>
                            <input className={myStyle.searchInput} placeholder="Tìm kiếm" type="text"  />
                            <button className={myStyle.searchButton}><SearchIcon /></button>
                        </Box>
                    </Box>
                    {/* Sắp xếp */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>Sắp xếp: </Typography>
                        <Button
                            
                            sx={{ textTransform: "none" }}>
                            Mặc định
                        </Button>
                        <Button
                            
                            sx={{ textTransform: "none" }}
                            >
                            Theo tên
                        </Button>
                    </Box>

                </Box>
                {/* Bộ lọc */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: "20px" }}>
                    <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>Bộ lọc: </Typography>
                    <Button
                        
                        sx={{ textTransform: "none" }}
                       >
                        Tất cả
                    </Button>
                    <Button
                        
                        sx={{ textTransform: "none" }}
                       >
                        Đang hoạt động
                    </Button>
                    <Button
                        
                        sx={{ textTransform: "none" }}
                        >
                        Đã khóa
                    </Button>
                </Box>

                <Box sx={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
                    <Pagination size="small" />
                </Box>
               
            </Box>
        </Box>
    )
}

export default AllBooking;
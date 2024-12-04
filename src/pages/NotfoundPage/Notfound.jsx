import { Box, Typography } from "@mui/material"

const Notfound = () => {
    return(
        <Box sx={{display:"flex", justifyContent:"center", alignItems:"center"}}>
            <Typography sx={{fontWeight:"bold", fontSize:"1.5rem"}}>Không tìm thấy trang</Typography>
        </Box>
    )
}

export default Notfound;
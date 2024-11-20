import myStyle from "./Home.module.scss";

import { Box, Divider, Typography } from "@mui/material";
import { useAuth } from "../../components/Authentication/authentication";

import TopProducts from "./TopProdutcs/TopProduct";
import CommonNoitice from "./CommonNoitices/CommonNoitice";
import Revenu from "./Revenu/Revenu";
const Home = () => {

    const auth = useAuth();
    return (
        <Box>
            {/* Thong bao chung */}
            <Box>
                <CommonNoitice />
            </Box>

            {/* Top sản phẩm + Doanh thu*/}
            <Box>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                    {/* Top sanr pham */}
                    <Box className={myStyle.col6}>
                        <TopProducts />
                    </Box>
                    {/* Doanh thu */}
                    <Box className={myStyle.col6}>
                        <Revenu />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Home;
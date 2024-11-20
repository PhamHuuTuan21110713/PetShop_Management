import myStyle from "./Revenu.module.scss";

import { Box, Typography, Button } from "@mui/material"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from "react";
import { LineChart } from '@mui/x-charts/LineChart';

const Revenu = () => {

    return (
        <Box sx={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;", padding: "5px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", position: "relative" }}>

                <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", paddingX: "10px" }}>Doanh thu năm</Typography>
            </Box>
            <Box sx={{ maxHeight: "390px", overflowY: "auto", padding: "5px" }} >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <LineChart
                        sx={{
                            '.MuiLineElement-root': {
                                stroke: '#37a693',
                                strokeWidth: 4,
                            },
                            '.MuiMarkElement-root': {
                                stroke: '#000',
                                scale: '0.6',
                                fill: '#fff',
                                strokeWidth: 2,
                            },
                        }}
                        xAxis={[{ scaleType: 'point', data: ["Jan", "Feb", "Mar", "Apr", "May", "Jul", "July", "Aug", "Sep", "Oct", "Nov", "Dec"] }]}
                        series={[
                            {
                                data: [2, 5.5, 2, 8.5, 1.5, 5, 10, 3, 10, 2],
                                // area: true,
                                label: "revenu"
                            },
                        ]}
                        width={500}
                        height={400}
                    />
                </Box>
            </Box>
        </Box>
    )
}

export default Revenu;
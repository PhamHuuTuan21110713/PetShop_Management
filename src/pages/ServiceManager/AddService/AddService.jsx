import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import AddNamePage from "./AddnamePage";
import Description from "./Description";
import Price from "./Price";
import Procedures from "./Procedures";

const AddService = () => {
    const [subPage, setSubPage] = useState(1);
    const [data, setData] = useState(
        {
            name: "",
            description: [],
            price: [],
            procedures: [],
            applicableBranches: [],
        }
    )
    const changeSubPage = (value,data) => {
        setSubPage(value);
        setData(data);
    }
    // console.log(data);
    // console.log(subPage);
    return (
        <Box>
            <Box>
                {
                    subPage === 1 ? <AddNamePage onChange={changeSubPage} value={subPage} data={data} /> :
                        (
                            subPage === 2 ? <Description onChange={changeSubPage} value={subPage} data={data} /> :
                                (
                                    subPage === 3 ? <Price onChange={changeSubPage} value={subPage} data={data} /> :
                                        (
                                            subPage === 4 ? <Procedures isFinal={true} onChange={changeSubPage} value={subPage} data={data} /> : null
                                        )
                                )
                        )
                }
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3, marginTop:"10px" }}>
                <Button variant="contained" color="warning">Hủy</Button>
                {
                    subPage === 4 && < Button variant="contained" color="success">Gửi</Button>
                }
        </Box>
        </Box >
    )
}

export default AddService;
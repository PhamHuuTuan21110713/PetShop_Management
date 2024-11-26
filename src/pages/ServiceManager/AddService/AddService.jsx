import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import AddNamePage from "./AddnamePage";
import Description from "./Description";
import Price from "./Price";
import Procedures from "./Procedures";
import Summary from "./Summary";

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
    const changeSubPage = (value, data) => {
        setSubPage(value);
        setData(data);
    }
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
                                            subPage === 4 ? <Procedures onChange={changeSubPage} value={subPage} data={data} /> :
                                                <Summary value={subPage}  onChange={changeSubPage} data={data} />
                                        )
                                )
                        )
                }
            </Box>
        </Box >
    )
}

export default AddService;
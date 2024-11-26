import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
const AddNamePage = ({ onChange, value }) => {
    const [name, SetName] = useState("");
    const [checked, setChecked] =useState([true, false]);

    const handleChange1 = (event) => {
        setChecked([event.target.checked, event.target.checked]);
    };

    const handleChange2 = (event) => {
        setChecked([event.target.checked, checked[1]]);
    };

    const handleChange3 = (event) => {
        setChecked([checked[0], event.target.checked]);
    };
    const handleNext = () => {
        onChange(value + 1);
    }
    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>Thêm tên và chi nhánh áp dụng</Typography>
            </Box>
            <Box>
                <Typography sx={{ fontWeight: "bold", fontSize: '1.2rem' }}>Tên dịch vụ</Typography>
                <Box>
                    <input style={{ height: '40px', width: "400px" }} value={name} onChange={(e) => SetName(e.target.value)} />
                </Box>
            </Box>
            <Box>
                <Typography sx={{ fontWeight: "bold", fontSize: '1.2rem' }}>Địa chỉ áp dụng</Typography>
                <Box>
                    <FormControlLabel
                        label="Chọn tất cả"
                        control={
                            <Checkbox
                                checked={checked[0] && checked[1]}
                                indeterminate={checked[0] !== checked[1]}
                                onChange={handleChange1}
                            />
                        }
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                        <FormControlLabel
                            label="Child 1"
                            control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
                        />
                        <FormControlLabel
                            label="Child 2"
                            control={<Checkbox checked={checked[1]} onChange={handleChange3} />}
                        />
                    </Box>
                </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                <Button variant="contained" onClick={handleNext}>Tiếp</Button>
            </Box>
        </Box>
    )
}

export default AddNamePage;
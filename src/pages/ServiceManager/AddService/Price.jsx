import { Box,Button } from "@mui/material";
const Price = ({ onChange, value }) => {
    const handleBack = () => {
        onChange(value - 1)
    }
    const handleNext = () => {
        onChange(value + 1)
    }
    return (
        <Box>
            <Button onClick={handleBack}>Back</Button>
            them gia
            <Button onClick={handleNext}>Next</Button>
        </Box>
    )
}

export default Price;
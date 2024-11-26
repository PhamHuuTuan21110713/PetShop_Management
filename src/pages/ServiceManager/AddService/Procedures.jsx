import { Box ,Button} from "@mui/material";

const Procedures = ({ isFinal, onChange, value }) => {
    const handleBack = () => {
        onChange(value - 1)
    }
    const handleNext = () => {
        onChange(value + 1)
    }
    return (
        <Box>
            <Button onClick={handleBack}>Back</Button>
            Quy trinh
            {
                !isFinal && <Button>Next</Button>
            }
        </Box>
    )
}

export default Procedures;
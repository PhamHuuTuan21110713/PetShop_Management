import { Box, Button, Typography } from "@mui/material";
import { useRef, useState } from "react";

const Description = ({ onChange, value, data }) => {
    const [descriptions, setDescriptions] = useState(data.description);
    const [subAddContent, setSubAddConent] = useState([])
    const [newDescription, setNewDescription] = useState({
        heading: "",
        content: []
    });
    const [newSubConent, setNewSubContent] = useState("");
    const handleBack = () => {
        const reData = {...data};
        reData.description = descriptions
        onChange(value - 1,reData)
        
    }
    const handleNext = () => {
        const reData = {...data};
        reData.description = descriptions
        onChange(value + 1, reData);
    }

    const handleChangeHeader = (e, chimuc) => {

        const newDescription = [...descriptions];
        newDescription[chimuc].heading = e.target.value;
        setDescriptions(newDescription);
    }
    const handleChangeConent = (e, chimucMota, chimucNoidung) => {
        const newDescription = [...descriptions];
        newDescription[chimucMota].content[chimucNoidung] = e.target.value;
        setDescriptions(newDescription);
    }
    const handleChangeAddConent = (e, chimucMota) => {
        const newAddContent = [...subAddContent];
        newAddContent[chimucMota] = e.target.value;
        setSubAddConent(newAddContent);
    }
    const handleAddSubContent = (chimucMota) => {
        if (subAddContent[chimucMota] !== "" && subAddContent[chimucMota] !== null) {
            const newDescription = [...descriptions];
            newDescription[chimucMota].content.push(subAddContent[chimucMota]);
            const newAddContent = [...subAddContent];
            newAddContent[chimucMota] = "";
            setDescriptions(newDescription);
            setSubAddConent(newAddContent)
        }

    }
    const handleRemoveConent = (chimucMota, chimucNoidung) => {
        const newDescription = [...descriptions];
        newDescription[chimucMota].content.splice(chimucNoidung, 1);
        setDescriptions(newDescription);
    }
    const handleRemoveDescription = (chimucMota) => {
        const newDescription = [...descriptions];
        newDescription.splice(chimucMota, 1);
        setDescriptions(newDescription);
    }
    const handleChangeNewHeader = (e) => {
        const news = { ...newDescription };
        news.heading = e.target.value;
        setNewDescription(news);
    }
    const handleChangeNewContent = (e, idx) => {
        const news = { ...newDescription };
        news.content[idx] = e.target.value;
        setNewDescription(news);
    }
    const handleChangeNewSubContent = (e) => {
        setNewSubContent(e.target.value)
    }
    const handleAddNewSubContent = () => {
        if(newSubConent !== '') {
            const news = { ...newDescription };
            news.content.push(newSubConent);
            setNewDescription(news);
            setNewSubContent("");
        }
    }
    const handleRemoveNewContent = (idx) => {
        const news = { ...newDescription };
        news.content.splice(idx, 1) ;
        setNewDescription(news);
    }
    const handleAddDescription = () => {
        if(newDescription.heading !== "" && newDescription.content.length > 0) {
            const newDescriptions = [...descriptions];
            newDescriptions.push(newDescription);
            setDescriptions(newDescriptions);
            setNewDescription({
                heading:"",
                content:[]
            })
        }
    }
    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>Thêm mô tả</Typography>
            </Box>
            <Box sx={{ padding: "20px", display: "flex", flexDirection: "column", gap: 2, boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;" }}>
                {/* Mô tả Item */}
                {
                    descriptions.length > 0 && descriptions.map((description, index) => {
                        return (
                            <Box key={index} sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "20px", position: "relative" }}>
                                <Button onClick={() => handleRemoveDescription(index)} color="error" variant="contained" sx={{ position: "absolute", right: 0, top: 0, textTransform: "none" }}>Xóa mô tả</Button>
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                                    <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Tiêu đề</Typography>
                                    <input type="text" value={description.heading} style={{ width: "400px" }} onChange={(e) => handleChangeHeader(e, index)} />
                                </Box>
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                                    <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Nội dung</Typography>
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
                                        {
                                            description.content.length > 0 && description.content.map((content, idx) => {
                                                return (
                                                    <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <input type="text" value={content} onChange={(e) => handleChangeConent(e, index, idx)} style={{ width: "400px" }} />
                                                        <Button onClick={() => handleRemoveConent(index, idx)} color="error" variant="contained" sx={{ textTransform: "none" }}>xóa</Button>
                                                    </Box>
                                                )
                                            })
                                        }
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
                                            <Box>
                                                <input value={subAddContent[index]} onChange={(e) => handleChangeAddConent(e, index)} style={{ width: "400px" }} type="text" />
                                            </Box>
                                            <Button onClick={() => handleAddSubContent(index)} variant="contained" sx={{ textTransform: "none" }}>Thêm nội dung</Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        )
                    })
                }
                {/* Theem mo ta moi */}
                <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "20px" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                            <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Tiêu đề</Typography>
                            <input value={newDescription.heading} onChange={handleChangeNewHeader} type="text" style={{ width: "400px" }} />
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                            <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Nội dung</Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
                                {
                                    newDescription.content.length > 0 && (
                                        newDescription.content.map((content, idx) => {
                                            return (
                                                <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <input value={content} onChange={(e) => handleChangeNewContent(e, idx)} style={{ width: "400px" }} type="text" />
                                                    <Button onClick={() => handleRemoveNewContent(idx)} color="error" variant="contained" sx={{ textTransform: "none" }}>xóa</Button>
                                                </Box>
                                            )
                                        })
                                    )
                                }
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
                                    <input value={newSubConent} onChange={handleChangeNewSubContent}  style={{ width: "400px" }} type="text" />
                                    <Button onClick={handleAddNewSubContent} variant="contained" sx={{ textTransform: "none" }}>Thêm nội dung</Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 3, marginTop: "10px" }}>
                <Button onClick={handleAddDescription} variant="contained" sx={{ textTransform: "none" }}>Thêm mô tả</Button>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3, marginTop: "10px" }}>
                <Button variant="contained" onClick={handleBack}>Quay lại</Button>
                {
                    descriptions.length > 0 && <Button variant="contained" onClick={handleNext}>Tiếp</Button>
                }
            </Box>
        </Box>
    )
}

export default Description;
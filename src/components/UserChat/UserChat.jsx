import { Avatar, Box, Skeleton, Typography } from "@mui/material"
import { fetchRecipientUser } from "./fetchRecipient";

const UserChat = ({onClick, chat, user }) => {
    // console.log("chat: ", chat);
    // console.log("user: ", user);
    const { recipientUser } = fetchRecipientUser(chat, user);
    // console.log("recipeient: ", recipientUser)
    return (
        <Box onClick={onClick} sx={{ cursor: "pointer", boxShadow:"rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding:"10px",borderRadius:"4px" }} >
            {
                recipientUser ?
                    (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Box>
                                <Avatar src={`${recipientUser.avatar.preview}`} />
                            </Box>
                            <Box sx={{ maxWidth: "100%", overflow: "hidden" }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography sx={{

                                        display: "inline-block",     // Hoặc "block" nếu cần canh chỉnh theo layout
                                        whiteSpace: "nowrap",        // Hiển thị nội dung trên một hàng duy nhất
                                        overflow: "hidden",          // Ẩn phần văn bản bị tràn
                                        textOverflow: "ellipsis",
                                        margin: 0,
                                        flex: 1
                                    }}>{recipientUser.name}</Typography>
                                    <Typography sx={{ fontSize: "0.7rem" }}>12:03</Typography>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                                    <p style={{
                                        fontSize: "0.7rem",
                                        display: "inline-block",     // Hoặc "block" nếu cần canh chỉnh theo layout
                                        whiteSpace: "nowrap",        // Hiển thị nội dung trên một hàng duy nhất
                                        overflow: "hidden",          // Ẩn phần văn bản bị tràn
                                        textOverflow: "ellipsis",
                                        margin: 0,
                                        flex: 1
                                    }}>Text messagessssssssssssssssssssssssssssssssssssssssss</p>
                                    <Box sx={{width:"20px", height:"20px", display:"flex", justifyContent:"center", alignItems:"center", backgroundColor:"#dc3546", borderRadius:"50%"}}>
                                        <p style={{
                                            fontSize: "0.7rem",
                                            display: "inline-block",     // Hoặc "block" nếu cần canh chỉnh theo layout
                                            whiteSpace: "nowrap",        // Hiển thị nội dung trên một hàng duy nhất
                                            overflow: "hidden",          // Ẩn phần văn bản bị tràn
                                            textOverflow: "ellipsis",
                                            margin: 0,
                                            color:"#fff"
                                        }} >2</p>
                                    </Box>

                                </Box>

                            </Box>
                        </Box>
                    ) :
                    (
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Skeleton variant="circular">
                                <Avatar />
                            </Skeleton>
                            <Skeleton width="100%">
                                <Typography>.</Typography>
                            </Skeleton>
                        </Box>
                    )

            }

        </Box >
    )
}
export default UserChat
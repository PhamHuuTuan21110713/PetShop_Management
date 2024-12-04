import { useContext, useState, useRef, useEffect } from "react";
import { useAuth } from "../Authentication/authentication"
import { ChatContext } from "~/pages/ChatProvider/ChatProvider";
import { fetchRecipientUser } from "./fetchRecipient";
import { Typography, Box, Avatar, Divider, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import InputEmoji from "react-input-emoji";
import SendIcon from '@mui/icons-material/Send';

const ChatBox = () => {
    const auth = useAuth();
    const { currentChat, messages, isMessagesLoading, sendTextMessage } = useContext(ChatContext);
    const { recipientUser } = fetchRecipientUser(currentChat, auth.user);
    const [textMessage, setTexMessage] = useState("");
    const scroll = useRef();
//    console.log("chatbox message: ", messages);
    useEffect(() => {
        // console.log("scrollTo")
            // console.log("scroll current: ", scroll.current);
            scroll.current?.scrollIntoView(
                // {behavior: "smooth"}
            )
      
    }, [messages,recipientUser])
    
    if (!recipientUser) {
        return (
            <Typography sx={{ textAlign: "center" }}>
                Chưa có sự lựa chọn
            </Typography>
        )
    }
    if (isMessagesLoading) {
        return (
            <Typography sx={{ textAlign: "center" }}>
                Đang tải tin nhắn...
            </Typography>
        )
    }
    return (
        <Box sx={{ padding: "20px", display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
                <Avatar src={`${recipientUser.avatar.preview}`} />
                <Typography>{recipientUser.name}</Typography>
            </Box>
            <Divider sx={{ marginY: "20px" }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minHeight: `calc( 100% - 131.6px)`, maxHeight: `calc( 100% - 131.6px)`, overflowY: 'auto' }} >
                {
                    messages && messages.map((message, index) => {
                        return (
                            <Box
                                ref={scroll}
                                sx={{
                                    backgroundColor: message.senderId === auth.user._id ? "#397ede" : "#6f706f",
                                    maxWidth: "60%",
                                    display: "inline-block",
                                    wordBreak: "break-word",
                                    wordWrap: "break-word",
                                    padding: "10px",
                                    borderRadius: "4px",
                                    alignSelf: message.senderId === auth.user._id ? "flex-end" : "flex-start"
                                }}
                                key={index}>
                                <Typography sx={{ color: "#fff" }} >{message.text}</Typography>
                                <Typography sx={{ color: "#fff", fontSize: "0.7rem" }}>{dayjs(message.createdAt).format("DD/MM/YYYY HH:mm")}</Typography>
                            </Box>
                        )
                    })
                   
                }
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <InputEmoji value={textMessage} onChange={setTexMessage} />
                <Tooltip title="Gửi tin nhắn">
                    <button onClick={() => sendTextMessage(textMessage,auth.user, currentChat._id,setTexMessage )} style={{ border: "none", backgroundColor: "transparent", cursor: "pointer" }}><SendIcon sx={{ color: "#397ede" }} /></button>
                </Tooltip>
            </Box>
        </Box>
    )
}
export default ChatBox
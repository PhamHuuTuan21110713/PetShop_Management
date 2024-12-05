import { Avatar, Box, Skeleton, Typography } from "@mui/material"
import { fetchRecipientUser } from "./fetchRecipient";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "~/pages/ChatProvider/ChatProvider";
import { NotifyFetch } from "~/REST_API_Client";
import { useAuth } from "../Authentication/authentication";
import { UserFetch } from "~/REST_API_Client";
const UserChat = ({ onClick, chat, user }) => {
    // console.log("chat: ", chat);
    // console.log("user: ", user);
    // const { recipientUser } = fetchRecipientUser(chat, user);
    const [recipientUser, setRecipientUser] = useState(null)
    const auth = useAuth();
    const { unReadNotifications,userChats } = useContext(ChatContext);
    const [thisUserNotifications, setThisUserNotifications] = useState([]);
    // console.log("recipeient: ", recipientUser)

    useEffect(() => {
        const getUser = () => {
            const recipientId = chat?.members.find((id) => id !== user?._id);
            if(!recipientId) return null;
            UserFetch.getById(recipientId)
                .then(data => {
                    setRecipientUser(data.data);
                })
                .catch(err =>{
                    console.log("Loi nguoi dung: ",err);
                    return setError(err);
                })
        }
        getUser();
    },[user,chat])

    useEffect(() => {
        const fetchUnreadMessage = () => {
            if (!auth.user) return
            if (recipientUser) {
                console.log(`recpitId - ${recipientUser._id}: `, recipientUser);
                NotifyFetch.getNotify({ receiverId: auth.user._id,senderId: recipientUser._id, isReading: false, type: "message" })
                    .then(data => {
                        // console.log("unread message: ", data)
                        if (data.data.length > 0) {

                            setThisUserNotifications(data.data);
                        }

                    })
                    .catch(err => {
                        console.log("err get unread message: ", err);
                    })
            }

        }
        fetchUnreadMessage();
    }, [recipientUser])
    useEffect(() => {
        if (unReadNotifications && recipientUser) {
            const ani = unReadNotifications?.filter(n => n.senderId === recipientUser._id);
            setThisUserNotifications(ani);
        }
    }, [unReadNotifications])
    return (
        <Box onClick={onClick} sx={{ cursor: "pointer", boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;", padding: "10px", borderRadius: "4px" }} >
            {
                recipientUser ?
                    (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Box>
                                <Avatar src={`${recipientUser.avatar.preview}`} />
                            </Box>
                            <Box sx={{ maxWidth: "100%", overflow: "hidden" }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                                    <Typography sx={{
                                        maxWidth: "95%",
                                        display: "inline-block",     // Hoặc "block" nếu cần canh chỉnh theo layout
                                        whiteSpace: "nowrap",        // Hiển thị nội dung trên một hàng duy nhất
                                        overflow: "hidden",          // Ẩn phần văn bản bị tràn
                                        textOverflow: "ellipsis",
                                        margin: 0,
                                        flex: 1
                                    }}>{recipientUser.name}</Typography>
                                    {
                                        thisUserNotifications.length > 0 &&
                                        (
                                            <Box sx={{ width: "20px", height: "20px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#dc3546", borderRadius: "50%" }}>
                                                <p style={{
                                                    fontSize: "0.7rem",
                                                    display: "inline-block",     // Hoặc "block" nếu cần canh chỉnh theo layout
                                                    whiteSpace: "nowrap",        // Hiển thị nội dung trên một hàng duy nhất
                                                    overflow: "hidden",          // Ẩn phần văn bản bị tràn
                                                    textOverflow: "ellipsis",
                                                    margin: 0,
                                                    color: "#fff"
                                                }} >{thisUserNotifications.length}</p>
                                            </Box>
                                        )
                                    }

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
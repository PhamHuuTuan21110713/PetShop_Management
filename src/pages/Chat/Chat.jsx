import { Box, Divider, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { ChatContext } from "../ChatProvider/ChatProvider";
import UserChat from "~/components/UserChat/UserChat";
import { useAuth } from "~/components/Authentication/authentication";
import ChatBox from "~/components/UserChat/ChatBox";
import { NotifyFetch, ChatFetch} from "~/REST_API_Client";
const Chat = () => {
    const {
        userChats,
        updateUserChats,
        isUserChatsLoading,
        updateCurrentChat,
        unReadNotifications,
        updateUnreadNotifications,
        setIsUserChatsLoading,
        setUserChatsError
    } = useContext(ChatContext);
    const auth = useAuth();
    console.log("userchat: ", userChats);
    const handleUpdateCurrentChat = (chat) => {
        updateCurrentChat(chat);
        const senderId = chat?.members.find((id) => id !== auth.user?._id);
        NotifyFetch.updateManyNotify(senderId, auth.user._id, "message", "update")
            .then(data => {
                const newUnreadNotify = unReadNotifications.filter((unr, indx) => {
                    return unr.senderId !== senderId
                })
                // console.log("senderid: ", senderId);
                // console.log("recievid: ", auth.user._id);
                // console.log("orrgin unread: ", unReadNotifications);
                // console.log("new unread: ",newUnreadNotify);
                updateUnreadNotifications(newUnreadNotify);
                console.log("Đã xóa nội dun tin nhắn")
            })
            .catch(err => {
                console.log("Lỗi xóa tin nhắn: ", err)
            })
    }
    useEffect(() => {
        return () => {
            updateCurrentChat(null);

        }
    },[])
    // useEffect(() => {
    //     const getUserChats = () => {
    //         if (auth.user?._id) {
    //             setIsUserChatsLoading(true);
    //             setUserChatsError(null);
    //             ChatFetch.getChatByUserId(auth.user?._id)
    //                 .then(data => {
    //                     console.log("data chats: ", data);         
    //                     updateUserChats(data.data);
    //                     setIsUserChatsLoading(false);
    //                 })
    //                 .catch(err => {
    //                     console.log("error chats: ", err);
    //                     setIsUserChatsLoading(false);
    //                 })
    //         }
    //     }
    //     getUserChats()
    // }, [])
    return (
        <Box sx={{
            minWidth: "900px",
            maxHeight: (theme) => `calc( 100vh - ${theme.customSize.headerHeight} - 20px)`,
            minHeight: (theme) => `calc( 100vh - ${theme.customSize.headerHeight} - 20px)`,
            height: (theme) => `calc( 100vh - ${theme.customSize.headerHeight} - 20px)`,
            overflow: "auto",
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
            display: "flex",
        }}>
            {/* List User Chat */}
            <Box sx={{ padding: "10px", width: "300px", minHeight: "100%", maxHeight: "100%", overflowY: "auto", boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;" }}>
                <Typography sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.2rem" }}>Chat</Typography>
                <Divider sx={{ marginY: "10px" }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {
                        isUserChatsLoading && <Typography>Đang tải chat...</Typography>
                    }
                    {
                        userChats && userChats.map((chat, index) => {
                            return (
                                <UserChat onClick={() => handleUpdateCurrentChat(chat)} key={chat._id} chat={chat} user={auth.user} />
                            )
                        })
                    }
                </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
                <ChatBox />
            </Box>
        </Box>
    );
}

export default Chat;
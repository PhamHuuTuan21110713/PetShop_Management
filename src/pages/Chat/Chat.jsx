import { Box, Divider, Typography } from "@mui/material";
import { useContext } from "react";
import { ChatContext } from "../ChatProvider/ChatProvider";
import UserChat from "~/components/UserChat/UserChat";
import { useAuth } from "~/components/Authentication/authentication";
const Chat = () => {
    const {
        userChats,
        isUserChatsLoading,
        userChatsError
    } = useContext(ChatContext);
    const auth = useAuth();
    console.log("userchat: ", userChats);
    return ( 
        <Box sx={{
            minWidth:"900px",
            maxHeight: (theme) =>  `calc( 100vh - ${theme.customSize.headerHeight} - 20px)`,
            minHeight: (theme) => `calc( 100vh - ${theme.customSize.headerHeight} - 20px)`,
            height:  (theme) => `calc( 100vh - ${theme.customSize.headerHeight} - 20px)`,
            overflow:"auto",
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
            display:"flex", 
        }}>
            {/* List User Chat */}
            <Box sx={{padding:"10px",width:"300px",  minHeight:"100%", maxHeight:"100%", overflowY:"auto", boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;"}}>
                <Typography sx={{textAlign:"center", fontWeight:"bold", fontSize:"1.2rem"}}>Chat</Typography> 
                <Divider sx={{marginY:"10px"}} />
                <Box sx={{display:"flex", flexDirection:"column", gap:1}}>
                    {
                        isUserChatsLoading && <Typography>Đang tải chat...</Typography>
                    }
                    {
                        userChats && userChats.map((chat, index) => {
                            return(
                                <UserChat key={index} chat={chat} user={auth.user}/>
                            )
                        })
                    }
                </Box>
            </Box>
            <Box sx={{flex:1}}>

            </Box>
        </Box>
     );
}
 
export default Chat;
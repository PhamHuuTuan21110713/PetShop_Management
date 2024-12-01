
import { createContext, useCallback, useEffect, useState } from "react"
import { useAuth } from "~/components/Authentication/authentication";
import { ChatFetch, UserFetch } from "~/REST_API_Client";
export const ChatContext = createContext();
export const ChatProvider = ({ children }) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);

    const auth = useAuth();
    // useEffect(() => {
    //     const getUsers = () => {
    //         if (auth?.user._id) {
    //             UserFetch.get({ paging: 1, limiting: 1000 }, undefined, undefined, undefined)
    //                 .then(data => {
    //                     // console.log("data users:" ,data.data);
    //                     const pChats = data.data.filter((u) => {
    //                         let isChatCreated = false;
    //                         if(auth?.user._id === u._id) return false;
    //                         if(userChats) {
    //                             isChatCreated = userChats?.some((chat) => {
    //                                 return chat.members[0] === u._id || chat.members[1] === u._id
    //                             })
    //                         }
    //                         return !isChatCreated;
    //                     })
    //                     // console.log("pchat: ", pChats)
    //                     setPotentialChats(pChats);
    //                 })
    //                 .catch(err => {
    //                     console.log("error get users: ",err);
    //                 })
    //         }
    //     }
    //     getUsers();
    // }, [userChats])
    const createChat = useCallback(async (firstId, secondId) => {
        ChatFetch.createChat(firstId, secondId)
            .then(data => {
                setUserChats((prev) => {
                    return [...prev, data.data]
                })
            })
    },[])
    useEffect(() => {
        const getUserChats = () => {
            if (auth.user?._id) {
                setIsUserChatsLoading(true);
                setUserChatsError(null);
                console.log("userid: ",)
                ChatFetch.getChatByUserId(auth.user?._id)
                    .then(data => {
                        // console.log("data chats: ", data);
                        setUserChats(data.data);
                        setIsUserChatsLoading(false);
                    })
                    .catch(err => {
                        console.log("error chats: ", err);
                        setIsUserChatsLoading(false);
                    })
            }
        }
        getUserChats()
    }, [auth.user])
   
    return (
        <ChatContext.Provider value={{
            userChats,
            isUserChatsLoading,
            userChatsError,
            createChat
            // potentialChats
        }}>
            {children}
        </ChatContext.Provider>
    )
}
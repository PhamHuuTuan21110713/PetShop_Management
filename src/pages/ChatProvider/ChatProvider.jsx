
import { createContext, useCallback, useEffect, useState } from "react"
import { useAuth } from "~/components/Authentication/authentication";
import { ChatFetch, MessageFetch, UserFetch, NotifyFetch } from "~/REST_API_Client";
import { SOCKET_URL } from "~/constants";
import { io } from "socket.io-client";
export const ChatContext = createContext();
export const ChatProvider = ({ children }) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    // const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    // const [notifications, setNotifications] = useState([]);
    const [unReadNotifications, setUnReadNotifications] = useState([]);
    const [newBookingNoti, setNewBookingNoti] = useState(null);
    const [unreadBookingNotifies, setUnreadBookingNotifyes] = useState([]);
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
    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);
        // console.log("socket url: ", SOCKET_URL);
        return () => {
            if (socket !== null) {
                socket.disconnect();
            }
        }
    }, [auth.user])
    //SOCKET ADD USER ONLINE
    useEffect(() => {
        if (socket === null) return;
        socket.emit("addNewUser", auth.user._id)
    }, [socket])
    // SOKET SEND MESSAGE 
    useEffect(() => {
        if (socket === null) return;
        if (currentChat) {
            const recipientId = currentChat.members.find((id) => id !== auth.user._id)
            socket.emit("sendMessage", { ...newMessage, recipientId })
        }

    }, [newMessage]);
    // SOKET RECEIVE MESSAGE 
    console.log("unread notify", unReadNotifications)
    useEffect(() => {
        if (socket === null) return;

        socket.on("getMessage", (res) => {
            if (!userChats) return
            const isExistChat = userChats?.some((usc) => usc._id === res.chatId)
            console.log("isExxistedchat: ", isExistChat);
            if (isExistChat) {
                console.log("roivao1")
                const newUserChats = [...userChats].filter((uc) => uc._id !== res.chatId);
                const firstUserChat = [...userChats].find((uc) => uc._id === res.chatId);
                setUserChats([firstUserChat, ...newUserChats]);
                console.log("newUserChats: ", newUserChats)
                console.log("first element: ", firstUserChat);
                if (currentChat?._id !== res.chatId) return;
                // console.log("user get new message: ", res)
                setMessages((prev) => [...prev, res])
            } else {
                console.log("roivao2")
                ChatFetch.createChat(res.recipientId, res.senderId)
                    .then(data => {
                        console.log("data get: ", data.data)
                        console.log("status: ", data.status)
                        if (data.status === "EXIST") {
                            setUserChats((prev) => {
                                return [data.data, ...prev]
                            })
                        } else {
                            return
                        }

                    })
                    .catch(err => {
                        console.log("err create chat: ", err)
                    })
            }

        })
        socket.on("getNotification", (res) => {
            const isChatOpen = currentChat?.members.some(id => id === res.senderId);
            if (isChatOpen) {

            } else {
                NotifyFetch.createNotify({
                    senderId: res.senderId,
                    receiverId: auth.user._id,
                    type: "message",
                    targetId: "",
                    text: `Tin nhắn chưa đọc từ ${res.senderId} tới ${auth.user._id}`
                }).then(data => {
                    console.log("Tạo thông báo thành công: ", data.data);
                    setUnReadNotifications((prev) => [{ ...res, receiverId: auth.user._id }, ...prev])
                }).catch(err => {
                    console.log("Lỗi tạo thông báo: ", err);
                })
            }
        })
        return () => {
            socket.off("getMessage");
            socket.off("getNotification")
        }

    }, [socket, currentChat, userChats]);

    // Socket receive Booking Notify
    console.log("Unread booking notifys: ", unreadBookingNotifies)
    useEffect(() => {
        if (socket === null) return;
        socket.on("getBookingNotify", (notify) => {
            console.log("push from socket")
            setUnreadBookingNotifyes((prev) => [notify,...prev])
        })
        return () => {
            socket.off("getBookingNotify")
        }
    }, [socket])

    // socket send Booking notify
    // useEffect(() => {
    //     if(socket === null) return;
    //     if(newBookingNoti) {
    //         socket.emit("sendBookingNotify", newBookingNoti)
    //     }
    // }, [newBookingNoti])

    const sendBookingNotify = useCallback((notify) => {
        NotifyFetch.createNotify(notify)
            .then((data) => {
                console.log("Them notify thanh cong: ", data.data)
                // setNewBookingNoti(data.data)
                if(socket) {
                    console.log("sending booking notify")
                    socket.emit("sendBookingNotify", data.data)
                }
            })
            .catch(err => {
                console.log("Loi them booking notify")
            })
    }, [socket])

    const updateUnreadNotifications = (data) => {
        setUnReadNotifications(data)
    }
    const createChat = useCallback(async (firstId, secondId) => {
        return ChatFetch.createChat(firstId, secondId)
            .then(data => {
                console.log("create chat succesfull: ", data.message);
                console.log("chat data: ", data.data);
                console.log("data status: ", data.status);
                if (data.status === "EXIST") {

                } else {
                    setUserChats((prev) => {
                        return [...prev, data.data]
                    })
                }

            })
            .catch(err => {
                console.log("err create chat: ", err)
            })
    }, [])

    useEffect(() => {
        const getUserChats = () => {
            if (auth.user?._id) {
                setIsUserChatsLoading(true);
                setUserChatsError(null);
                ChatFetch.getChatByUserId(auth.user?._id)
                    .then(data => {
                        console.log("data chats: ", data);
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
    useEffect(() => {
        const getMessages = () => {
            setIsMessagesLoading(true);
            setMessagesError(null);

            MessageFetch.getMessageByChatId(currentChat?._id)
                .then(data => {
                    console.log("data messages: ", data);
                    setMessages(data.data);
                    setIsMessagesLoading(false);
                })
                .catch(err => {
                    console.log("error messages: ", err);
                    setIsMessagesLoading(false);
                })
        }
        getMessages()
    }, [currentChat])
    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat);
        console.log("currentchat:", chat);
    }, [])
    const sendTextMessage = useCallback((textMessage, sender, currentChatId, setTexMessage) => {
        if (!textMessage) {
            return
        }
        MessageFetch.createMessage(sender._id, currentChatId, textMessage)
            .then(data => {
                console.log("sended message: ", data.data)
                setNewMessage(data.data);
                setMessages((prev) => [...prev, data.data]),
                    setTexMessage("")
            })
            .catch(err => {
                console.log("err send message: ", err);
            })
    }, []);
    const updateUserChats = (data) => {
        setUserChats(data);
    }
    return (
        <ChatContext.Provider value={{
            userChats,
            updateUserChats,
            isUserChatsLoading,
            userChatsError,
            setIsUserChatsLoading,
            setUserChatsError,
            createChat,
            updateCurrentChat,
            currentChat,
            messages,
            isMessagesLoading,
            messagesError,
            sendTextMessage,
            unReadNotifications,
            updateUnreadNotifications,
            sendBookingNotify,
            unreadBookingNotifies,
            setUnreadBookingNotifyes
            // potentialChats
        }}>
            {children}
        </ChatContext.Provider>
    )
}
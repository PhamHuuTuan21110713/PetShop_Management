const ChatAPI = (axiosInstance) => {

    async function createChat(firstId, secondId) {
        const access_token = localStorage.getItem("access_token");
        
        try {
          const res = await axiosInstance.post('/chats/', {firstId, secondId}, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });
          return res.data;
        } catch (error) {
            if (error.response) {
                console.log("err: ", error);
                throw new Error(error.response.data.message);
            } else if (error.request) {
                throw new Error("Server không phản hồi");
            } else {
                throw new Error(error.message);
            }
        }
      }
   
    const getChatByUserId = async (userId) => {
        try {
            const res = await axiosInstance.get(`/chats/${userId}`);
            return res.data; // Trả về dữ liệu từ API
        } catch (error) {
            if (error.response) {
                console.log("err: ", error);
                throw new Error(error.response.data.message);
            } else if (error.request) {
                throw new Error("Server không phản hồi");
            } else {
                throw new Error(error.message);
            }
        }
    }

    const findChat = async (firstId, secondId) => {
        try {
            const res = await axiosInstance.get(`/chats/find/${firstId}/${secondId}`)
            return res.data
        }
        catch (error) {
            if (error.response) {
                throw new Error(error.response.data.message);
            } else if (error.request) {
                throw new Error("Server không phản hồi");
            } else {
                throw new Error(error.message);
            }
        }
    }

    return {
        createChat,
        getChatByUserId, // Trả về phương thức getAllOrder
        findChat
        
    }
}

export default ChatAPI;

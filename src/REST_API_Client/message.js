const MessageAPI = (axiosInstance) => {

    async function createMessage(senderId, chatId, text) {
        try {
          const res = await axiosInstance.post('/messages/', {senderId, chatId, text});
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
   
    const getMessageByChatId = async (chatId) => {
        try {
           
            const res = await axiosInstance.get(`/messages/${chatId}`);
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

    return {
        createMessage,
        getMessageByChatId
    }
}

export default MessageAPI;

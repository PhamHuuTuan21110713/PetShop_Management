const NotifyAPI = (axiosInstance) => {

    async function createNotify(data) {
        try {
            const res = await axiosInstance.post('/notifications/', data);
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

    const getNotifyById = async (id) => {
        try {

            const res = await axiosInstance.get(`/notifications/${id}`);
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
    const getNotify = async (condition) => {
        const params = new URLSearchParams({});
        try {
            if(condition.receiverId) {
                params.append("receiverId", condition.receiverId)
            }
            if(condition.isReading !== null && condition.isReading !== undefined ) {
                params.append("isReading",JSON.stringify(condition.isReading))
            }
            if(condition.type) {
                params.append("type",condition.type)
            }
            if(condition.senderId) {
                params.append("senderId", condition.senderId);
            }
            const res = await axiosInstance.get(`/notifications/?${params}`);
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
    const updateNotify = async (id,data) => {
        try {

            const res = await axiosInstance.patch(`/notifications/${id}`, data);
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
    const deleteNotify = async (id) => {
        try {

            const res = await axiosInstance.delete(`/notifications/${id}`);
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

    const updateManyNotify =async (senderId, receiverId, type,data) => {
        try {
            const res = await axiosInstance.patch(`/notifications/`,{
                senderId,
                receiverId,
                type,
                data
            });
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
        createNotify,
        getNotifyById,
        getNotify,
        updateNotify,
        deleteNotify,
        updateManyNotify
    }
}

export default NotifyAPI;

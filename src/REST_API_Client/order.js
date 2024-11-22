const OrderAPI = (axiosInstance) => {
    const getOrderByUserId = async (userId) => {
        const accessToken = localStorage.getItem("access_token");
        try {
            const res = await axiosInstance.get(`/order/get-by-user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Accept": "application/json",
                }
            })
            return res.data;
        }catch(error) {
            if (error.response) {
                console.log("err: ",error);
                throw new Error(error.response.data.message.message);
            } else if (error.request) {
                throw new Error("Server không phản hồi");
            } else {
                throw new Error(error.message)
            }
        }
    }

    return {
        getOrderByUserId
    }
}

export default OrderAPI;
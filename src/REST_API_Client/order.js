const OrderAPI = (axiosInstance) => {
    const getOrderByUserId = async (userId, condition, find) => {
        const params = new URLSearchParams({});
        const accessToken = localStorage.getItem("access_token");
        try {
            if(condition) {
                params.append("filter", JSON.stringify(condition));
            }
            if(find) {
                params.append("finding", find)
            }
            const res = await axiosInstance.get(`/order/get-by-user/${userId}?${params}`, {
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
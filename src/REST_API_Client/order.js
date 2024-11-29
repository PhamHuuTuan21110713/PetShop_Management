const OrderAPI = (axiosInstance) => {
    const getOrderByUserId = async (userId, condition, find) => {
        const params = new URLSearchParams({});
        const accessToken = localStorage.getItem("access_token");
        try {
            if (condition) {
                params.append("filter", JSON.stringify(condition));
            }
            if (find) {
                params.append("finding", find)
            }
            const res = await axiosInstance.get(`/order/get-by-user/${userId}?${params}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Accept": "application/json",
                }
            })
            return res.data;
        } catch (error) {
            if (error.response) {
                console.log("err: ", error);
                throw new Error(error.response.data.message.message);
            } else if (error.request) {
                throw new Error("Server không phản hồi");
            } else {
                throw new Error(error.message)
            }
        }
    }

    // Thêm phương thức getAllOrder
    const getAllOrder = async (page, limit,filters) => {

        const accessToken = localStorage.getItem("access_token");


        try {
            const filtersString = encodeURIComponent(JSON.stringify(filters));
            const res = await axiosInstance.get(`/order/?page=${page}&limit=${limit}&filters=${filtersString}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Accept": "application/json",
                }
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

    const updateOrder = async (orderId, data) => {
        const access_token = localStorage.getItem("access_token");
        console.log("data update", data);


        try {
            const res = await axiosInstance.patch(`/order/update/${orderId}`, data, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json' // Đảm bảo gửi multipart/form-data
                },
            })
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
        getOrderByUserId,
        getAllOrder, // Trả về phương thức getAllOrder
        updateOrder
    }
}

export default OrderAPI;

const BookingAPI = (axiosInstance) => {
    const getAll = async (userId, condition, find,sort,page,limit) => {
        const params = new URLSearchParams({});
        try {
            if (userId) {
                params.append("userId", userId);
            }
            if (condition) {
                params.append("filter", JSON.stringify(condition))
            }
            if (find) {
                params.append("finding", find)
            }
            if(sort) {
                params.append("sort", JSON.stringify(sort))
            }
            if(page) {
                params.append("page", page)
            }
            if(limit){
                params.append("limit", limit)
            }
            const res = await axiosInstance.get(`/bookings/?${params}`)
            return res.data;
        } catch (error) {
            if (error.response) {
                // console.log("err: ",error);
                throw new Error(error.response.data.message);
            } else if (error.request) {
                throw new Error("Server không phản hồi");
            } else {
                throw new Error(error.message)
            }
        }
    }
    const createNew = async (data) => {
        try {
            const res = await axiosInstance.post(`/bookings`,data);
            return res.data
        }catch(error) {
            if (error.response) {
                throw new Error(error.response.data.message);
            } else if (error.request) {
                throw new Error("Server không phản hồi");
            } else {
                throw new Error(error.message)
            }
        }
    }
    const upDate = async (id,data) => {
        try {
            const access_token = localStorage.getItem("access_token");
            const res = await axiosInstance.patch(`/bookings/${id}`,data, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                }
            });
            return res.data
        }catch(error) {
            if (error.response) {
                throw new Error(error.response.data.message);
            } else if (error.request) {
                throw new Error("Server không phản hồi");
            } else {
                throw new Error(error.message)
            }
        }
    }
    const getById = async (id) => {
        try {
           
            const res = await axiosInstance.get(`/bookings/${id}`);
            return res.data
        }catch(error) {
            if (error.response) {
                throw new Error(error.response.data.message);
            } else if (error.request) {
                throw new Error("Server không phản hồi");
            } else {
                throw new Error(error.message)
            }
        }
    }
    return {
        getAll,
        createNew,
        upDate,
        getById
    }
}

export default BookingAPI;
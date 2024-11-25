const BookingAPI = (axiosInstance) => {
    const getAll = async (userId, condition, find) => {
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

    return {
        getAll
    }
}

export default BookingAPI;
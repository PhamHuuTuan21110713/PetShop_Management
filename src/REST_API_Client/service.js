const ServiceAPI = (axiosInstance) => {
    const get = async (sorting, finding) => {
        const params = new URLSearchParams({});
        try {
            if (sorting) params.append("sort", (JSON.stringify(sorting)));
            if(finding) params.append("find", finding);
            const res = await axiosInstance.get(`/services?${params}`);
            return res.data
        } catch (error) {
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
            const res = await axiosInstance.get(`/services/${id}`);
            return res.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.message.message);
            } else if (error.request) {
                throw new Error("Server không phản hồi");
            } else {
                throw new Error(error.message)
            }
        }
    }
    return {
        get,
        getById
    }
}

export default ServiceAPI
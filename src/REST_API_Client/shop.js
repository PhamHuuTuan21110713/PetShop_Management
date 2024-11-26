const ShopAPI = (axiosInstance) => {
    const getInfo = async () => {
        try {
            const res = await axiosInstance.get(`/shop/6735bcc9bcac2ff8ff968263`)
            return res.data;
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
        getInfo
    }
}

export default ShopAPI
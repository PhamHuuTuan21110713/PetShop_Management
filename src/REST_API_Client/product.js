// api/ProductAPI.js
const ProductAPI = (axiosInstance) => {

    // Lấy tất cả sản phẩm
    async function getAllProduct(page) {
      try {
        const res = await axiosInstance.get(`/product?page=${page}&limit=10`);
        return res.data;
      } catch (error) {
        handleApiError(error);
      }
    }
  
    // Lấy chi tiết sản phẩm theo ID
    async function getById(productId) {
      try {
        const res = await axiosInstance.get(`/product/${productId}`);
        return res.data;
      } catch (error) {
        handleApiError(error);
      }
    }

    async function updateProduct(id, data) {
      const access_token = localStorage.getItem("access_token");
      try {
          const res = await axiosInstance.patch(`/product/${id}`, data, {
              headers: {
                  Authorization: `Bearer ${access_token}`,
                  "Content-Type": "multipart/form-data",
              }
          })
          // console.log(res)
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
  
    // Lấy sản phẩm bán chạy nhất
    async function fetchTopSaleProducts(page) {
      try {
        const res = await axiosInstance.get(`/product/best-selling-products?page=${page}&limit=10`);
        return res.data;
      } catch (error) {
        handleApiError(error);
      }
    }

    // Hàm xử lý lỗi chung
    function handleApiError(error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Đã có lỗi xảy ra từ server');
      } else if (error.request) {
        throw new Error("Không nhận được phản hồi từ server");
      } else {
        throw new Error(error.message);
      }
    }
  
    return {
      getAllProduct,
      getById,
      updateProduct,
      fetchTopSaleProducts,
    };
  };
  
  export default ProductAPI;
  
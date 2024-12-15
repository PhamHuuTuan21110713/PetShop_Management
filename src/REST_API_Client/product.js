// api/ProductAPI.js
const ProductAPI = (axiosInstance) => {

  /// Tạo sản phẩm mới
  async function createProduct(data) {
    const access_token = localStorage.getItem("access_token");
    try {
      const res = await axiosInstance.post('/product/', data, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          //'Content-Type': 'multipart/form-data', // Đảm bảo gửi 'multipart/form-data' khi upload file
        },
      });
      return res.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  // Phương thức để thêm ảnh thumbnail cho sản phẩm
  async function addThumbnail(productId, thumbnailFormData) {
    const access_token = localStorage.getItem("access_token");

    try {
      // Gửi PATCH request đến API để thêm thumbnail
      const response = await axiosInstance.patch(`/product/add-thumbnail/${productId}`, thumbnailFormData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  // Thêm ảnh thumbnail cho sản phẩm
  // async function addThumbnail(productId, imageFile) {
  //   const access_token = localStorage.getItem("access_token");
  //   try {
  //     const formData = new FormData();
  //     formData.append("image", imageFile); // "image" là tên trường trong formData

  //     // Gửi yêu cầu PATCH đến API
  //     const res = await axiosInstance.patch(`/product/add-thumbnail/${productId}`, formData, {
  //       headers: {
  //         Authorization: `Bearer ${access_token}`,
  //         'Content-Type': 'multipart/form-data', // Đảm bảo gửi multipart/form-data
  //       },
  //     });

  //     return res.data;
  //   } catch (error) {
  //     handleApiError(error);
  //   }
  // }

  // Lấy tất cả sản phẩm
  async function getAllProduct(page, sort, filters, limit) {
    console.log("filter", filters);

    try {
      const filtersString = encodeURIComponent(JSON.stringify(filters));
      const res = await axiosInstance.get(`/product?page=${page}&limit=${limit}&sort_by=${sort}&filters=${filtersString}`);
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

  // Cập nhật sản phẩm
  async function updateProduct(id, data) {
    const access_token = localStorage.getItem("access_token");
    try {
      const res = await axiosInstance.patch(`/product/${id}`, data, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "multipart/form-data", // Đảm bảo gửi multipart/form-data
        },
      });
      return res.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message.message);
      } else if (error.request) {
        throw new Error("Server không phản hồi");
      } else {
        throw new Error(error.message);
      }
    }
  }

  // Lấy sản phẩm bán chạy nhất
  async function fetchTopSaleProducts(page) {
    try {
      const res = await axiosInstance.get(`/product/best-selling-products?page=${page}&limit=1000`);
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

  async function createProducts(data) {
    const access_token = localStorage.getItem("access_token");
    try {
      const res = await axiosInstance.post("/product/create-many", data, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json"
        }
      });
      return res;
    } catch (error) {
      if (error.response) {
        console.log("loi ne: ", error);
        throw new Error(error.response.data.writeErrors[0].err.errmsg)
      } else if (error.request) {
        throw new Error("Server không phản hồi");
      } else {
        throw new Error(error.message);
      }
    }
  }

  return {
    getAllProduct,
    getById,
    updateProduct,
    fetchTopSaleProducts,
    createProduct,
    addThumbnail,
    createProducts
  };
};

export default ProductAPI;

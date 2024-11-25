
const CategoryAPI = (axiosInstance) => {

    async function get() {
      try {
        const res = await axiosInstance.get(`/categories/`)
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
  
    // async function getById(id,condition, query, sort) {
    //   const params = new URLSearchParams({});
    //   try {
    //     if(condition?.page !== undefined) params.append("page",condition.page);
    //     if(condition?.limit !== undefined) params.append("limit", condition.limit);
    //     if(query?.minPrice !== undefined && query?.minPrice.trim() !== "" ) params.append("minPrice", `${query.minPrice}000`);
    //     if(query?.maxPrice !== undefined && query?.maxPrice.trim() !== "") params.append("maxPrice", `${query.maxPrice}000`);
    //     if(query?.minStar !== undefined) params.append("minStar", query.minStar);
    //     if(query?.maxStar !== undefined) params.append("maxStar", query.maxStar);
    //     if(query?.onlyPromotion !== undefined) params.append("onlyPromotion", query.onlyPromotion);
    //     if (sort) params.append("sort", (JSON.stringify(sort)));

    //     // const res = await axiosInstance.get(`/categories/${id}?page=${condition?.page}&limit=${condition?.limit}`)
    //     const res = await axiosInstance.get(`/categories/${id}?${params}`)
    //     return res.data;
    //   } catch (error) {
    //     if (error.response) {
    //       throw new Error(error.response.data.message.message);
    //     } else if (error.request) {
    //       throw new Error("Server không phản hồi");
    //     } else {
    //       throw new Error(error.message)
    //     }
    //   }
    // }
  
    async function getById(id, condition, query, sort) {
      const params = new URLSearchParams({});
    
      try {
        // Thêm các tham số phân trang nếu có
        if (condition?.page !== undefined) params.append("page", condition.page);
        if (condition?.limit !== undefined) params.append("limit", condition.limit);
    
        // Thêm các điều kiện tìm kiếm như giá, đánh giá, khuyến mãi
        if (query?.minPrice !== undefined && query?.minPrice.trim() !== "") {
          params.append("minPrice", `${query.minPrice}000`); // Chuyển đổi giá thành đơn vị phù hợp
        }
        if (query?.maxPrice !== undefined && query?.maxPrice.trim() !== "") {
          params.append("maxPrice", `${query.maxPrice}000`); // Chuyển đổi giá thành đơn vị phù hợp
        }
        if (query?.minStar !== undefined) params.append("minStar", query.minStar);
        if (query?.maxStar !== undefined) params.append("maxStar", query.maxStar);
        if (query?.onlyPromotion !== undefined) params.append("onlyPromotion", query.onlyPromotion);
    
        // Thêm tham số sắp xếp
        if (sort) params.append("sort", JSON.stringify(sort)); // Sắp xếp theo trường hợp được chọn
    
        // Gọi API để lấy dữ liệu
        const res = await axiosInstance.get(`/categories/${id}?${params}`);
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
    
    
    
    return {
      get,
      getById
    }
  }
  
  export default CategoryAPI
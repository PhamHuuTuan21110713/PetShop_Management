const BlogAPI = (axiosInstance) => {

  async function createBlog(data) {
    const access_token = localStorage.getItem("access_token");
    console.log("data Fetch", data);

    try {
      const res = await axiosInstance.post('/blogs', data, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          //'Content-Type': 'application/json', // Đảm bảo gửi 'multipart/form-data' khi upload file
        },
      });
      return res.data;
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

  //Thêm phương thức getAllOrder
  const getAllBlog = async (page, limit, showAll) => {
    try {
      //const filtersString = encodeURIComponent(JSON.stringify(filters));
      const res = await axiosInstance.get(`/blogs?page=${page}&limit=${limit}&showAll=${showAll}`);
      return res.data;
    } catch (error) {
      handleApiError(error);
    }
  };

  const updateBlog = async (blogId, data) => {
    const access_token = localStorage.getItem("access_token");
    console.log("data update", data);


    try {
      const res = await axiosInstance.patch(`/blogs/${blogId}`, data, {
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

  const deleteById = async (id) => {
    try {
        const access_token = localStorage.getItem("access_token");
        const res = await axiosInstance.delete(`/blogs/${id}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        });
        return res.data;
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

  return {
    createBlog,
    getAllBlog, // Trả về phương thức getAllOrder
    updateBlog,
    deleteById
  }
}

export default BlogAPI;

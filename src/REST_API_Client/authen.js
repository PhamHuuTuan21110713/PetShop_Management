const AuthenAPI = (axiosInstance) => {

  async function login(data) {
    try {
      const res = await axiosInstance.post(`/login`, data)
      return res.data;
    } catch (error) {
      if (error.response) {
        // Lỗi từ server phản hồi (4xx, 5xx)
        // console.log('Status Code:', error.response.status); // Mã trạng thái
        // console.log('Error Message:', error.response.data.message.message); // Nội dung lỗi
        console.log(error)
        throw new Error(error.response.data.message.message);
      } else if (error.request) {
        // Không nhận được phản hồi từ server
        // console.log('No response received', error.request);
        throw new Error("Server không phản hồi");
      } else {
        // Lỗi khi thiết lập request
        // console.log('Error:', error.message);
        throw new Error(error.message)
      }
    }
  }
  async function checkToken() {
    const access_token = localStorage.getItem("access_token");
    // console.log(access_token);
    try {
      const res = await axiosInstance.post(`/check-token`, null, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
      return res.data;
    } catch (error) {
      if (error.response) {
        // Lỗi từ server phản hồi (4xx, 5xx)
        // console.log('Status Code:', error.response.status); // Mã trạng thái
        // console.log('Error Message:', error.response.data.message.message); // Nội dung lỗi
        throw new Error(error.response.data.message);
      } else if (error.request) {
        // Không nhận được phản hồi từ server
        // console.log('No response received', error.request);
        throw new Error("Server không phản hồi");
      } else {
        // Lỗi khi thiết lập request
        // console.log('Error:', error.message);
        throw new Error(error.message)
      }
    }
  }
  async function logout() {
    try {
      const res = await axiosInstance.post(`/logout`)
      return res.data;
    } catch (error) {
      if (error.response) {
        // Lỗi từ server phản hồi (4xx, 5xx)
        // console.log('Status Code:', error.response.status); // Mã trạng thái
        // console.log('Error Message:', error.response.data.message.message); // Nội dung lỗi
        throw new Error(error);
      } else if (error.request) {
        // Không nhận được phản hồi từ server
        // console.log('No response received', error.request);
        throw new Error("Server không phản hồi");
      } else {
        // Lỗi khi thiết lập request
        // console.log('Error:', error.message);
        throw new Error(error)
      }
    }
  }
  return {
    login,
    checkToken,
    logout
  }

}
export default AuthenAPI
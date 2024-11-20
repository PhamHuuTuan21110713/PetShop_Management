
// api/index.js
import axios from 'axios';
import { API_URL } from '~/constants';  // URL API
import configAxios from './config';
import AuthenAPI from './authen';
import UserAPI from './user'; // Import User API
// Tạo một instance của axios

const axiosInstance = axios.create({
  baseURL: `${API_URL}`, // Thay đổi URL theo backend của bạn
  withCredentials: true, // Để gửi cookie cho yêu cầu làm mới token
});

// Cấu hình axios nếu cần thiết
configAxios(axiosInstance);

// Export các API

export const AuthenFetch = AuthenAPI(axiosInstance);
export const UserFetch = UserAPI(axiosInstance);

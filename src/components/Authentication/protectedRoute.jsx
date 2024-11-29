import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./authentication";

const ProtectedRoutes = () => {
  const { user } = useAuth();
    // console.log("user protected: ", user);
  if (user === null) {
    // Điều hướng tới đăng nhập nếu chưa có người dùng
    return <Navigate to="/dang-nhap" />;
  }

  // Hiển thị nội dung nếu đã đăng nhập
  return <Outlet />;
};

export default ProtectedRoutes;
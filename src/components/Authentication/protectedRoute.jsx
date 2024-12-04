import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./authentication";
import { ChatProvider } from "~/pages/ChatProvider/ChatProvider";

const ProtectedRoutes = () => {
  const { user } = useAuth();
    // console.log("user protected: ", user);
  if (user === null) {
    // Điều hướng tới đăng nhập nếu chưa có người dùng
    return <Navigate to="/dang-nhap" />;
  }
  if(user.role === "user") {
    return <Navigate to="not-found" />
  }
  // Hiển thị nội dung nếu đã đăng nhập
  // return <Outlet />;
  return (
    <ChatProvider>
      <Outlet />
    </ChatProvider>
  )
};

export default ProtectedRoutes;
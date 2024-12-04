

import { Route, Routes, Navigate } from 'react-router-dom';
import Manager from './pages/Manager';
import Home from './pages/Home/Home';
import AccountManager from './pages/AccountManager/AccountManager';
import { AuthProvider } from './components/Authentication/authentication';
import Login from './pages/Login/Login';
import AllAccount from './pages/AccountManager/AllAccount/AllAccount';
import AddAccount from './pages/AccountManager/AddAccount/AddAccount';
import Products from './pages/ProductManager/ProductsManager';
import AllProduct from './pages/ProductManager/AllProduct/AllProduct';
import Account from './pages/Account/Account';
import ServiceManager from './pages/ServiceManager/ServiceManager';
import AllService from './pages/ServiceManager/AllServices/AllServices';
import AddService from './pages/ServiceManager/AddService/AddService';
import AddProduct from './pages/ProductManager/AddProduct/Addproduct';
import OrdersManager from './pages/OrderManager/OrdersManager';
import Promotion from './pages/PromotionManager/Promotion';
import AllPromotion from './pages/PromotionManager/AllPromotion/AllPromotion';
import AddPromotion from './pages/PromotionManager/AddPromotion/AddPromotion';
import Service from './pages/Service/Service';
import UpdateBaseInfor from './pages/Service/UpdateBaseInfor';
import UpdateDescriptions from './pages/Service/UpdateDescriptions';
import UpdatePrice from './pages/Service/UpdatePrice';
import UpdateProcedure from './pages/Service/UpdateProcedure';
import MonitoringService from './pages/Service/MonitoringService';
import BookingManager from './pages/BookingManager/BookingManager';
import AllBooking from './pages/BookingManager/AllBookings/AllBookings';
import AddBooking from './pages/BookingManager/AddBooking/AddBooking';
import StatisticalBooking from './pages/BookingManager/StatisticalBooking/StatisticalBooking';
import ProtectedRoutes from './components/Authentication/protectedRoute';
import Booking from './pages/Booking/Booking';

import CategoryManager from './pages/CategoryManager/CategoryManager';
import AddCategory from './pages/CategoryManager/AddCategory/AddCategory';
import AllCategory from './pages/CategoryManager/AllCategory/AllCategory';
import { ChatProvider } from './pages/ChatProvider/ChatProvider';
import Chat from './pages/Chat/Chat';

import RevenueReport from './pages/RevenueReport/RevenueReport';
import ProductReport from './pages/RevenueReport/ProductReport';
import Notify from './pages/Notify/Notify';
import Notfound from './pages/NotfoundPage/Notfound';

function App() {

  return (
    <AuthProvider>
      {/* <ChatProvider> */}
      <Routes>
        {/* Đăng nhập */}
        <Route path='*' element={<Notfound />} />
        <Route path='not-found' element={<Notfound />} />
        <Route path="/dang-nhap" element={<Login />} />
        <Route path='/' element={<ProtectedRoutes />}>
          <Route path="/" element={<Manager />}>
            <Route index element={<Home />} />
            {/* Chat */}
            <Route path='chat' element={<Chat />} />
            {/* Thong bao */}
            <Route path='thong-bao' element={<Notify />} />
            {/* Quản lý tài khoản */}
            <Route path='quan-ly-tai-khoan' element={<AccountManager />} >
              <Route index element={<Navigate to="danh-sach" />} />
              <Route path='danh-sach' element={<AllAccount />} />
              <Route path='them-moi' element={<AddAccount />} />
            </Route>
            {/* Quản lý dịch vụ */}
            <Route path='quan-ly-dich-vu' element={<ServiceManager />}>
              <Route index element={<Navigate to="danh-sach" />} />
              <Route path='danh-sach' element={<AllService />} />
              <Route path='them-moi' element={<AddService />} />
            </Route>
            {/* Chi tiết tài khoản */}
            <Route path='tai-khoan/:id' element={<Account />} />
            {/* Quản lý sản phẩm */}
            <Route path="quan-ly-san-pham" element={<Products />}>
              <Route index element={<Navigate to="danh-sach-san-pham" />} />
              <Route path='danh-sach-san-pham' element={<AllProduct />} />
              <Route path='them-san-pham' element={<AddProduct />} />
            </Route>
            {/* Quản lý lịch đặt dịch vụ */}
            <Route path='lich-dat' element={<BookingManager />}>
              <Route index element={<Navigate to="danh-sach" />} />
              <Route path='danh-sach' element={<AllBooking />} />
              <Route path='them-moi' element={<AddBooking />} />
              <Route path='thong-ke' element={<StatisticalBooking />} />
            </Route>
            {/* Chi tiết lịch đặt */}
            <Route path='lich-dat/:id' element={<Booking />} />
            {/* Chi tiết dịch vụ */}
            <Route path='dich-vu/:id' element={<Service />}>
              <Route path='co-ban' element={<UpdateBaseInfor />} />
              <Route path='mo-ta' element={<UpdateDescriptions />} />
              <Route path='bang-gia' element={<UpdatePrice />} />
              <Route path='quy-trinh' element={<UpdateProcedure />} />
              <Route path='giam-sat' element={<MonitoringService />} />
            </Route>

            {/* Quản lý khuyến mãi */}
            <Route path="quan-ly-khuyen-mai" element={<Promotion />}>
              <Route index element={<Navigate to="danh-sach-khuyen-mai" />} />
              <Route path='danh-sach-khuyen-mai' element={<AllPromotion />} />
              <Route path='them-khuyen-mai' element={<AddPromotion />} />
            </Route>
            {/* Quản lý đơn hàng */}
            <Route path='quan-ly-don-hang' element={<OrdersManager />} />

            {/* Quản lý danh mục */}
            <Route path='quan-ly-danh-muc' element={<CategoryManager />}>
              <Route path='danh-sach' element={<AllCategory />} />
              <Route path='them-moi' element={<AddCategory />} />
            </Route>
            <Route path='thong-ke-doanh-thu' element={<RevenueReport />} />
            <Route path='thong-ke-san-pham' element={<ProductReport />} />
          </Route>

        </Route>
      </Routes>
      {/* </ChatProvider> */}
    </AuthProvider>

  );
}

export default App;
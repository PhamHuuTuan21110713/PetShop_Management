

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

function App() {

  return (


    <AuthProvider>
      <Routes>
        <Route path="/" element={<Manager />}>
          <Route index element={<Home />} />
          <Route path='quan-ly-tai-khoan' element={<AccountManager />} >
            <Route index element={<Navigate to="danh-sach" />} />
            <Route path='danh-sach' element={<AllAccount />} />
            <Route path='them-moi' element={<AddAccount />} />
          </Route>
          <Route path='quan-ly-dich-vu' element={<ServiceManager />}>
            <Route index element={<Navigate to="danh-sach" />} />
            <Route path='danh-sach' element={<AllService />} />
            <Route path='them-moi' element={<AddService />} />
          </Route>
          <Route path='tai-khoan/:id' element={<Account />} />
          <Route path="quan-ly-san-pham" element={<Products />}>
            <Route index element={<Navigate to="danh-sach-san-pham" />} />
            <Route path='danh-sach-san-pham' element={<AllProduct />} />
            <Route path='them-san-pham' element={<AddProduct />} />
          </Route>
          <Route path='quan-ly-don-hang' element={<OrdersManager/>}/>
          <Route path="quan-ly-khuyen-mai" element={<Promotion />}>
            <Route index element={<Navigate to="danh-sach-khuyen-mai" />} />
            <Route path='danh-sach-khuyen-mai' element={<AllPromotion />} />
            <Route path='them-khuyen-mai' element={<AddPromotion />} />
          </Route>
          <Route path='tai-khoan/:id' element={<Account />}/>
          {/* <Route path='tai-khoan/:id' element={<Account />} /> */}
          <Route path='dich-vu/:id' element={<Service />}>
            <Route path='co-ban' element={<UpdateBaseInfor />}/>
            <Route path='mo-ta' element = {<UpdateDescriptions />}/>
            <Route path='bang-gia' element = {<UpdatePrice />} />
            <Route path='quy-trinh' element={<UpdateProcedure />}/>
            <Route path='giam-sat' element={<MonitoringService />}/>
          </Route>
        </Route>
        <Route path="dang-nhap" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
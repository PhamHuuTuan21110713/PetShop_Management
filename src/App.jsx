

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
import AddProduct from './pages/ProductManager/AddProduct/Addproduct';
import OrdersManager from './pages/OrderManager/OrdersManager';
import Promotion from './pages/PromotionManager/Promotion';
import AllPromotion from './pages/PromotionManager/AllPromotion/AllPromotion';
import AddPromotion from './pages/PromotionManager/AddPromotion/AddPromotion';

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
        </Route>
        <Route path="dang-nhap" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;


import { Route, Routes, Navigate } from 'react-router-dom';
import Manager from './pages/Manager';
import Home from './pages/Home/Home';
import AccountManager from './pages/AccountManager/AccountManager';
import { AuthProvider } from './components/Authentication/authentication';
import Login from './pages/Login/Login';
import AllAccount from './pages/AccountManager/AllAccount/AllAccount';
import AddAccount from './pages/AccountManager/AddAccount/AddAccount';
import Account from './pages/Account/Account';
import ServiceManager from './pages/ServiceManager/ServiceManager';
import AllService from './pages/ServiceManager/AllServices/AllServices';
import AddService from './pages/ServiceManager/AddService/AddService';

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
        </Route>
        <Route path="dang-nhap" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
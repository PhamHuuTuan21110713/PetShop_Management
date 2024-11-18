

import { Route, Routes } from 'react-router-dom';
import Manager from './pages/Manager';
import Users from './components/Content/Users';
import Products from './components/Content/Products';
function App() {

  return (
    <Routes>
      <Route path="/*" element={<Manager />}>
        {/* <Route path='quan-ly-nguoi-dung' element={<Users />} /> 
        <Route path="quan-ly-san-pham" element={<Products />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
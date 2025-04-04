import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home/Home';
import UserManagement from './pages/UserManagement/UserManagement';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import SuperUserLogin from './pages/SuperUserLogin/SuperUserLogin'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<Home />} />
        <Route path='/UserManagement' element={<UserManagement />} />
        <Route path='/Adminlogin' element={<AdminLogin />} />
        <Route path='/superuserlogin' element={<SuperUserLogin />} />




      </Routes>
    </Router>
  );
};

export default App;

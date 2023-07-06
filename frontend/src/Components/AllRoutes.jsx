import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Menu from '../Pages/Menu';
import AddDish from '../Pages/AddDish';
import Orders from '../Pages/Orders';
import Login from '../Pages/Login';
import Signup from '../Pages/Signup';
import PrivateRoute from './PrivateRoute';

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/menu" element={<Menu/>} />
      <Route path="/placeorder" element={<PrivateRoute><AddDish/></PrivateRoute>} />
      <Route path="/orders" element={<PrivateRoute><Orders/></PrivateRoute>} />
      <Route path="/" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
    </Routes>
  );
};

export default AllRoutes;
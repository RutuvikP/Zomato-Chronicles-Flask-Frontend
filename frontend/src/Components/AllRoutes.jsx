import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Menu from '../Pages/Menu';
import AddDish from '../Pages/AddDish';
import Orders from '../Pages/Orders';
import Login from '../Pages/Login';
import Signup from '../Pages/Signup';
import Home from '../Pages/Home';

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/menu" element={<Menu/>} />
      <Route path="/placeorder" element={<AddDish/>} />
      <Route path="/orders" element={<Orders/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
    </Routes>
  );
};

export default AllRoutes;
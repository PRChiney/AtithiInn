//from frontend/src/components/AdminRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const adminFromRedux = useSelector((state) => state.adminLogin?.adminInfo);
  const adminFromStorage = JSON.parse(localStorage.getItem('adminInfo'));
  const adminInfo = adminFromRedux || adminFromStorage;

  console.log('Route check - adminInfo:', adminInfo); 

  if (!adminInfo?.admin?._id) {
    console.log('No admin ID found, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;
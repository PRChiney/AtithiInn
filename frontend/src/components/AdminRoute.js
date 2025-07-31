import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const adminFromRedux = useSelector((state) => state.adminLogin?.adminInfo);
  const adminFromStorage = JSON.parse(localStorage.getItem('adminInfo'));
  const adminInfo = adminFromRedux || adminFromStorage;

  if (!adminInfo?.admin?._id) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminRoute;
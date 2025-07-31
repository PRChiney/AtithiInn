import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';

const AdminProfilePage = () => {
  const navigate = useNavigate();
  const { adminInfo } = useSelector((state) => state.adminLogin);
  const admin = adminInfo?.admin;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
    }
  }, [admin, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-6 text-white">
          <h1 className="text-2xl font-bold">Admin Profile</h1>
          <p className="opacity-90">View your account information</p>
        </div>

        <div className="p-6">
          {loading ? (
            <Loader />
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 block w-full rounded-md bg-gray-100 shadow-sm sm:text-sm p-2 border">
                  {admin?.name || 'N/A'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 block w-full rounded-md bg-gray-100 shadow-sm sm:text-sm p-2 border">
                  {admin?.email || 'N/A'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account Type
                </label>
                <div className="mt-1 block w-full rounded-md bg-gray-100 shadow-sm sm:text-sm p-2 border">
                  Admin
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
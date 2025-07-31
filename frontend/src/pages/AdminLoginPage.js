//frontend/src/pages/AdminLoginPage.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../actions/adminActions';
import { Link } from 'react-router-dom';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const adminLogin = useSelector((state) => state.adminLogin);
  const { loading, error } = adminLogin || {};


  useEffect(() => {
  if (
    adminLogin &&
    adminLogin.adminInfo &&
    adminLogin.adminInfo.admin &&
    adminLogin.adminInfo.admin._id
  ) {
    navigate('/admin/dashboard');
  }
}, [adminLogin, navigate]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!email.trim() || !password) {
    setValidationError('Email and password are required');
    return;
  }
  setValidationError('');
  try {
    const resultAction = await dispatch(loginAdmin({ email, password }));
    console.log('Login result:', resultAction);
  } catch (err) {
    console.error('Login error:', err);
  }
};

  return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
    <div
      className="w-full max-w-md p-8 rounded-2xl shadow-2xl transition-all duration-300"
      style={{
        backgroundColor: 'rgb(57, 71, 117)',
        border: '2px solid rgb(32, 37, 55)',
      }}
    >
      <h2 className="text-3xl font-extrabold text-white mb-6 text-center">Admin Sign In</h2>

      {validationError && (
        <div className="text-red-400 text-center mb-4 text-sm">{validationError}</div>
      )}
      {error && (
        <div className="text-red-400 text-center mb-4 text-sm">{error}</div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 w-full rounded-full font-semibold hover:opacity-90 transition shadow-md text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 
                    3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </div>
      </form>

      {/* Register link */}
      <div className="pt-6 text-center">
        <p className="text-sm text-gray-300">
          Need an admin account?{' '}
          <Link to="/admin/register" className="text-blue-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  </div>
);

};

export default AdminLoginPage;
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerAdmin } from '../actions/adminActions';
import { Link, useNavigate } from 'react-router-dom';

const AdminRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    secretKey: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const adminRegister = useSelector((state) => state.adminRegister || {});
  const { loading = false, error = null } = adminRegister;

  useEffect(() => {
    
    if (error) {
      setFormErrors({});
    }
  }, [formData, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.secretKey) {
      errors.secretKey = 'Secret key is required';
    }
    return errors;
  };

 const submitHandler = async (e) => {
  e.preventDefault();
  const errors = validateForm();
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }

  try {
    const resultAction = await dispatch(
      registerAdmin({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        secretKey: formData.secretKey
      })
    );
    
  
    if (resultAction.meta.requestStatus === 'fulfilled') {
      navigate('/admin/login', { 
        state: { 
          registrationSuccess: true,
          registeredEmail: formData.email 
        } 
      });
    }
  } catch (err) {
    console.error('Registration error:', err);
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
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Admin Account</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md text-sm text-center">
          {error.message || error.toString()}
        </div>
      )}

      <form onSubmit={submitHandler} className="space-y-4 text-sm">
        {/* Name */}
        <div>
          <label className="block text-gray-200 mb-1" htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${
              formErrors.name ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-blue-400 bg-gray-50`}
          />
          {formErrors.name && <p className="text-red-400 mt-1">{formErrors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-200 mb-1" htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${
              formErrors.email ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-blue-400 bg-gray-50`}
          />
          {formErrors.email && <p className="text-red-400 mt-1">{formErrors.email}</p>}
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-gray-200 mb-1" htmlFor="password">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${
              formErrors.password ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-blue-400 bg-gray-50`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[35px] text-gray-500 text-sm"
          >
            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
          {formErrors.password && <p className="text-red-400 mt-1">{formErrors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block text-gray-200 mb-1" htmlFor="confirmPassword">Confirm Password</label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${
              formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-blue-400 bg-gray-50`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-[35px] text-gray-500 text-sm"
          >
            <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
          {formErrors.confirmPassword && (
            <p className="text-red-400 mt-1">{formErrors.confirmPassword}</p>
          )}
        </div>

        {/* Secret Key */}
        <div className="relative">
          <label className="block text-gray-200 mb-1" htmlFor="secretKey">Admin Secret Key</label>
          <input
            type={showSecretKey ? 'text' : 'password'}
            id="secretKey"
            name="secretKey"
            value={formData.secretKey}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${
              formErrors.secretKey ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-blue-400 bg-gray-50`}
          />
          <button
            type="button"
            onClick={() => setShowSecretKey(!showSecretKey)}
            className="absolute right-3 top-[35px] text-gray-500 text-sm"
          >
             <i className={`fas ${showSecretKey ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
          {formErrors.secretKey && (
            <p className="text-red-400 mt-1">{formErrors.secretKey}</p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full font-semibold hover:opacity-90 transition shadow-md"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373..."></path>
                </svg>
                Registering...
              </span>
            ) : (
              'Register as Admin'
            )}
          </button>
        </div>
      </form>

      {/* Login Link */}
      <div className="pt-6 text-center">
        <p className="text-gray-300 text-sm">
          Already have an admin account?{' '}
          <Link to="/admin/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  </div>
);

};

export default AdminRegisterPage;
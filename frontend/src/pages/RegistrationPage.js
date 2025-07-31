import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../actions/authActions';
import { useNavigate, Link } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import API from '../services/api'; 

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo, error: registerError, loading: registerLoading } = userRegister;


  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await API.get('/health');
        if (response.status === 200) {
          setBackendStatus('healthy');
        } else {
          setBackendStatus('unhealthy');
          setError('Backend service is unavailable. Please try again later.');
        }
      } catch {
        setBackendStatus('unreachable');
        setError('Cannot connect to backend server. Please ensure it is running.');
      }
    };

    checkBackendHealth();
  }, []);


  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username.trim() || !formData.email.trim() || !formData.password) {
      return setError('All fields are required');
    }

    if (formData.password.length < 8) {
      return setError('Password must be at least 8 characters');
    }

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

   try {
    await dispatch(register(
      formData.username,
      formData.email,
      formData.password
    ));
  } catch (err) {
    console.error('Registration error in component:', err);
    setError(err.message || 'Registration failed. Please try again.');
  }
};

  if (backendStatus === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
        <p className="ml-2">Checking backend connection...</p>
      </div>
    );
  }

  if (backendStatus !== 'healthy') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Message variant="danger">
          {error || 'Backend service is unavailable. Please try again later.'}
        </Message>
      </div>
    );
  }

  return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
    <div
      className="w-full max-w-md p-8 rounded-2xl shadow-2xl transition-all duration-300"
      style={{
        backgroundColor: 'rgb(57, 71, 117)',
        border: '2px solid rgb(32, 37, 55)',
      }}
    >
      <Meta title="Register | Hotel Booking" />
      <h2 className="text-3xl font-extrabold text-white mb-6 text-center">Create your account</h2>

      {error && <Message variant="danger">{error}</Message>}
      {registerError && <Message variant="danger">{registerError}</Message>}

      <form className="space-y-5" onSubmit={submitHandler}>
        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-1">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition"
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition"
            >
              <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>

        {/* Register Button */}
        <div>
          <button
            type="submit"
            disabled={registerLoading}
            className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 w-full rounded-full font-semibold hover:opacity-90 transition shadow-md text-sm"
          >
            {registerLoading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">↻</span> Registering...
              </span>
            ) : (
              'Register'
            )}
          </button>
        </div>
      </form>

      {/* Already have an account */}
      <div className="pt-6 text-center">
        <p className="text-sm text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  </div>
);

};

export default RegistrationPage;
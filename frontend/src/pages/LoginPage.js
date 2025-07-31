import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../actions/authActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import Meta from '../components/Meta';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email.trim()) {
      return setValidationError('Please enter your email');
    }

    if (!password) {
      return setValidationError('Please enter your password');
    }

    try {
      await dispatch(login(email, password));
    } catch (error) {
      console.error('Login error:', error);
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
      <Meta title="Login | Hotel Booking" />
      <h1 className="text-3xl font-extrabold mb-6 text-white text-center">Sign In</h1>

      {validationError && <Message variant="danger">{validationError}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}

      <Form onSubmit={submitHandler}>
        {/* Email Field */}
        <Form.Group controlId="email" className="mb-4">
          <Form.Label className="text-gray-200 text-sm font-medium">Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={!!validationError && !email.trim()}
            autoFocus
            className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50 text-sm"
          />
        </Form.Group>

        {/* Password Field */}
        <Form.Group controlId="password" className="mb-5">
          <Form.Label className="text-gray-200 text-sm font-medium">Password</Form.Label>
          <div className="relative">
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!validationError && !password}
              className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50 text-sm pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </Form.Group>

        {/* Sign In Button */}
        <Button
          type="submit"
          className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full font-semibold hover:opacity-90 transition w-full shadow-md text-sm"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2">↻</span>Signing In...
            </span>
          ) : (
            'Sign In'
          )}
        </Button>
      </Form>

      {/* Links */}
      <Row className="pt-4">
        <Col className="text-center text-sm">
          <span className="text-gray-300">New Customer? </span>
          <Link
            to={redirect ? `/register?redirect=${redirect}` : '/register'}
            className="text-blue-400 hover:underline"
          >
            Register
          </Link>
        </Col>
      </Row>

      <Row className="pt-2">
        <Col className="text-center text-sm">
          <span className="text-gray-300">Admin Access? </span>
          <Link to="/admin/login" className="text-blue-400 hover:underline">
            Admin Login
          </Link>
        </Col>
      </Row>
    </div>
  </div>
);

};

export default LoginPage;
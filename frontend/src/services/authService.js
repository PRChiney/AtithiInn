// src/services/authServices.js
import { API } from './api';

// Login service
export const login = async (email, password) => {
  try {
    const response = await API.post('/auth/login', { 
      email: email.trim().toLowerCase(),
      password: password.trim()
    });

    if (!response.data?.user || !response.data?.token) {
      throw new Error('Invalid server response');
    }

    // Store complete user info
    const userData = {
      user: response.data.user,
      token: response.data.token
    };

    localStorage.setItem('userInfo', JSON.stringify(userData));
    return userData;

  } catch (error) {
    console.error('Login Service Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    let errorMessage = error.response?.data?.message || 
                      (error.response?.status === 401 
                        ? 'Invalid credentials' 
                        : 'Login failed');
    
    throw new Error(errorMessage);
  }
};

// Registration service
export const register = async (username, email, password) => {
  try {
    const response = await API.post('/auth/register', {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim()
    });

    if (!response.data?.user || !response.data?.token) {
      throw new Error('Invalid server response');
    }

    // Store complete user info
    const userData = {
      user: response.data.user,
      token: response.data.token
    };

    localStorage.setItem('userInfo', JSON.stringify(userData));
    return userData;

  } catch (error) {
    console.error('Registration Service Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    let errorMessage = error.response?.data?.message || 
                      (error.response?.status === 409 
                        ? 'User already exists' 
                        : 'Registration failed');
    
    throw new Error(errorMessage);
  }
};

// Admin registration service
export const registerAdmin = async (username, email, password, adminSecret) => {
  try {
    const response = await API.post('/auth/admin/register', {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      adminSecret
    });

    if (!response.data?.user || !response.data?.token) {
      throw new Error('Invalid server response');
    }

    // Store complete user info
    const userData = {
      user: response.data.user,
      token: response.data.token
    };

    localStorage.setItem('userInfo', JSON.stringify(userData));
    return userData;

  } catch (error) {
    console.error('Admin Registration Service Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    let errorMessage = error.response?.data?.message || 
                      (error.response?.status === 403 
                        ? 'Invalid admin secret' 
                        : 'Admin registration failed');
    
    throw new Error(errorMessage);
  }
};

// Logout service
export const logout = async () => {
  try {
    await API.post('/auth/logout');
  } catch (error) {
    console.error('Logout Service Error:', error);
    throw error;
  } finally {
    localStorage.removeItem('userInfo');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
};

// Check authentication status
export const checkAuth = () => {
  const userInfo = localStorage.getItem('userInfo');
  if (!userInfo) return false;

  try {
    const parsedInfo = JSON.parse(userInfo);
    return !!parsedInfo?.token;
  } catch {
    return false;
  }
};
import API from '../services/api';
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  ADMIN_REGISTER_REQUEST,
  ADMIN_REGISTER_SUCCESS,
  ADMIN_REGISTER_FAIL
} from '../constants/authConstants';

export const ADMIN_LOGIN_REQUEST = 'ADMIN_LOGIN_REQUEST';
export const ADMIN_LOGIN_SUCCESS = 'ADMIN_LOGIN_SUCCESS';
export const ADMIN_LOGIN_FAIL = 'ADMIN_LOGIN_FAIL';


export const login = (email, password) => async (dispatch) => {
  try {

    try {
      const healthCheck = await API.get('/health');
      if (healthCheck.data?.status !== 'UP') {
        throw new Error('Backend service unavailable');
      }
    } catch {
  throw new Error('Cannot connect to backend server. Please ensure it is running.');
}

    if (!email?.trim() || !password?.trim()) {
      throw new Error('Email and password are required');
    }

    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      timeout: 8000 
    };

    const { data } = await API.post(
      '/auth/login', 
      { 
        email: email.trim().toLowerCase(), 
        password: password.trim() 
      },
      config
    );

    if (!data?.user || !data?.token) {
      throw new Error('Invalid server response format');
    }

 
    const userData = {
      user: {
        _id: data.user._id,
        username: data.user.username,
        email: data.user.email,
        isAdmin: data.user.isAdmin,
        profilePicture: data.user.profilePicture || ''
      },
      token: data.token
    };

    localStorage.setItem('userInfo', JSON.stringify(userData));
    dispatch({ type: USER_LOGIN_SUCCESS, payload: userData });

    return userData;

  } catch (error) {
    console.error('Login Error Details:', {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
      timestamp: new Date().toISOString()
    });

    let errorMessage = 'Login failed';
    
    if (error.response) {
      if (error.response.status === 400 || error.response.status === 401) {
        errorMessage = error.response.data?.message || 'Invalid email or password';
      } else if (error.response.status === 500) {
        errorMessage = 'Server error, please try again later';
      }
    } else if (error.message.includes('Network Error') || error.code === 'ECONNREFUSED') {
      errorMessage = 'Cannot connect to server. Please check your connection and ensure the backend is running.';
    }

    dispatch({
      type: USER_LOGIN_FAIL,
      payload: errorMessage
    });

    throw new Error(errorMessage);
  }
};
export const adminLogin = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_LOGIN_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await API.post(
      '/api/users/admin/login',
      { email, password },
      config
    );


    if (!data.user.isAdmin) {
      throw new Error('Admin privileges required');
    }

    const userData = {
      user: {
        _id: data.user._id,
        username: data.user.username,
        email: data.user.email,
        isAdmin: true,
        profilePicture: data.user.profilePicture || ''
      },
      token: data.token
    };

    localStorage.setItem('userInfo', JSON.stringify(userData));
    dispatch({ type: ADMIN_LOGIN_SUCCESS, payload: userData });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: userData }); 

  } catch (error) {
    dispatch({
      type: ADMIN_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};


export const register = (username, email, password) => async (dispatch) => {
  try {
    
    try {
    const healthCheck = await API.get('/health');
      if (healthCheck.data?.status !== 'UP') {
        throw new Error('Backend service unavailable');
      }
    } catch (healthError) {
      console.error('Backend Health Check Error:', healthError);
      throw new Error('Cannot connect to backend server. Please ensure it is running.');
    }

    if (!username?.trim() || !email?.trim() || !password?.trim()) {
      throw new Error('All fields are required');
    }

    if (password.trim().length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    dispatch({ type: USER_REGISTER_REQUEST });

    const { data } = await API.post('/auth/register', {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim()
    }, {
      timeout: 10000,
      withCredentials: true
    });


    if (!data?.user || !data?.token) {
      throw new Error('Invalid server response format');
    }

    const userData = {
      user: {
        _id: data.user._id,
        username: data.user.username,
        email: data.user.email,
        isAdmin: data.user.isAdmin || false,
        profilePicture: data.user.profilePicture || ''
      },
      token: data.token
    };


    dispatch({ type: USER_REGISTER_SUCCESS, payload: userData });
    

    localStorage.setItem('userInfo', JSON.stringify(userData));
    dispatch({ type: USER_LOGIN_SUCCESS, payload: userData });

    return userData;

  } catch (error) {
    console.error('Registration Error Details:', {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
      timestamp: new Date().toISOString()
    });

    let errorMessage = 'Registration failed';


    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data?.message || 'Validation failed';
      } else if (error.response.status === 409) {
        errorMessage = error.response.data?.message || 'User already exists';
      } else if (error.response.status === 500) {
        errorMessage = 'Server error, please try again later';
      }
    } else if (error.message.includes('Network Error') || error.code === 'ECONNREFUSED') {
      errorMessage = 'Cannot connect to registration service. Please check your connection.';
    }

    dispatch({
      type: USER_REGISTER_FAIL,
      payload: errorMessage
    });

    throw new Error(errorMessage);
  }
};


export const registerAdmin = (username, email, password, adminSecret) => async (dispatch) => {
  try {

    try {
      const healthCheck = await API.get('/api/v1/health');
      if (healthCheck.data?.status !== 'UP') {
        throw new Error('Backend service unavailable');
      }
    } catch (healthError) {
      console.error('Backend Health Check Error:', healthError);
      throw new Error('Cannot connect to backend server. Please ensure it is running.');
    }

    dispatch({ type: ADMIN_REGISTER_REQUEST });

    const { data } = await API.post('/auth/admin/register', {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      adminSecret
    }, {
      timeout: 10000,
      withCredentials: true
    });

    if (!data?.user || !data?.token) {
      throw new Error('Invalid server response format');
    }

    const userData = {
      user: {
        _id: data.user._id,
        username: data.user.username,
        email: data.user.email,
        isAdmin: true,
        profilePicture: data.user.profilePicture || ''
      },
      token: data.token
    };

    localStorage.setItem('userInfo', JSON.stringify(userData));
    dispatch({ type: ADMIN_REGISTER_SUCCESS, payload: userData });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: userData });

    return userData;

  } catch (error) {
    console.error('Admin Registration Error:', {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
      timestamp: new Date().toISOString()
    });

    let errorMessage = 'Admin registration failed';
    
    if (error.response) {
      if (error.response.status === 403) {
        errorMessage = 'Invalid admin registration secret';
      } else {
        errorMessage = error.response.data?.message || errorMessage;
      }
    } else if (error.message.includes('Network Error') || error.code === 'ECONNREFUSED') {
      errorMessage = 'Cannot connect to admin registration service.';
    }

    dispatch({
      type: ADMIN_REGISTER_FAIL,
      payload: errorMessage
    });

    throw new Error(errorMessage);
  }
};


export const logout = () => async (dispatch) => {
  try {
    await API.post('/auth/logout', {}, {
      timeout: 5000,
      withCredentials: true
    });
  } catch (error) {
    console.error('Logout API Error:', {
      error: error.message,
      timestamp: new Date().toISOString()
    });
  } finally {

    localStorage.removeItem('userInfo');

    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    dispatch({ type: USER_LOGOUT });
  }
};

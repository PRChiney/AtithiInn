import axios from 'axios';
import API from '../services/api';
import { getErrorMessage } from '../utils/errorUtils';


export const USER_REGISTER_REQUEST = 'USER_REGISTER_REQUEST';
export const USER_REGISTER_SUCCESS = 'USER_REGISTER_SUCCESS';
export const USER_REGISTER_FAIL = 'USER_REGISTER_FAIL';
export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_FAIL = 'USER_LOGIN_FAIL';
export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_DETAILS_REQUEST = 'USER_DETAILS_REQUEST';
export const USER_DETAILS_SUCCESS = 'USER_DETAILS_SUCCESS';
export const USER_DETAILS_FAIL = 'USER_DETAILS_FAIL';
export const USER_LIST_REQUEST = 'USER_LIST_REQUEST';
export const USER_LIST_SUCCESS = 'USER_LIST_SUCCESS';
export const USER_LIST_FAIL = 'USER_LIST_FAIL';
export const USER_DELETE_REQUEST = 'USER_DELETE_REQUEST';
export const USER_DELETE_SUCCESS = 'USER_DELETE_SUCCESS';
export const USER_DELETE_FAIL = 'USER_DELETE_FAIL';
export const USER_PROMOTE_REQUEST = 'USER_PROMOTE_REQUEST';
export const USER_PROMOTE_SUCCESS = 'USER_PROMOTE_SUCCESS';
export const USER_PROMOTE_FAIL = 'USER_PROMOTE_FAIL';
export const USER_DEMOTE_REQUEST = 'USER_DEMOTE_REQUEST';
export const USER_DEMOTE_SUCCESS = 'USER_DEMOTE_SUCCESS';
export const USER_DEMOTE_FAIL = 'USER_DEMOTE_FAIL';

const handleApiError = (error) => {

  if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
    console.error('Connection Error:', error);
    return 'Cannot connect to server. Please check your network and try again.';
  }

  const errorDetails = {
    message: error.message,
    status: error.response?.status,
    response: error.response?.data,
    config: {
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data
    }
  };

  console.error('API Error:', errorDetails);

  if (error.response) {
    switch (error.response.status) {
      case 401:
        return error.response.data?.message || 'Invalid credentials. Please try again.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return error.response.data?.message || 'Request failed. Please try again.';
    }
  }
  return getErrorMessage(error);
};


export const register = (username, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    if (!username || !email || !password) {
      throw new Error('All fields are required');
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      throw new Error('Invalid email format');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const { data } = await API.post('/auth/register', {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    if (!data.token || !data.user) {
      throw new Error('Invalid server response');
    }

    localStorage.setItem('userInfo', JSON.stringify(data));

    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: handleApiError(error),
    });
  }
};

// Add these actions
export const promoteToAdmin = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_PROMOTE_REQUEST });

    const {
      adminLogin: { adminInfo } = {},
      userLogin: { userInfo } = {},
    } = getState();

    const token = adminInfo?.token || userInfo?.token;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await API.put(`/users/${id}/promote`, {}, config);

    dispatch({ type: USER_PROMOTE_SUCCESS });
    dispatch(listUsers()); 
  } catch (error) {
    dispatch({
      type: USER_PROMOTE_FAIL,
      payload: handleApiError(error),
    });
  }
};

export const demoteAdmin = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DEMOTE_REQUEST });

    const {
      adminLogin: { adminInfo } = {},
      userLogin: { userInfo } = {},
    } = getState();

    const token = adminInfo?.token || userInfo?.token;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await API.put(`/users/${id}/demote`, {}, config);

    dispatch({ type: USER_DEMOTE_SUCCESS });
    dispatch(listUsers()); 
  } catch (error) {
    dispatch({
      type: USER_DEMOTE_FAIL,
      payload: handleApiError(error),
    });
  }
};


export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    const { data } = await API.post('/auth/login', { email, password });
    
 
    localStorage.setItem('userInfo', JSON.stringify(data));
    

    dispatch({ 
      type: USER_LOGIN_SUCCESS, 
      payload: {
        token: data.token,
        user: data.user
      }
    });
  } catch (error) {
    dispatch({ type: USER_LOGIN_FAIL, payload: handleApiError(error) });
  }
};


export const logout = () => async (dispatch) => {
  try {
    try {
      await API.post('/auth/logout');
    } catch (serverError) {
      console.warn('Logout API Warning:', {
        message: serverError.message,
        response: serverError.response?.data,
        status: serverError.response?.status,
      });
    }

    localStorage.removeItem('userInfo');
    dispatch({ type: USER_LOGOUT });

    window.location.href = '/login';
  } catch (error) {
    console.error('Client-side Logout Error:', error);
    localStorage.removeItem('userInfo');
    dispatch({ type: USER_LOGOUT });
  }
};


export const getUserDetails = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
    
    const { userLogin: { userInfo } } = getState();
    
    if (!userInfo?.token) {
      return dispatch({ 
        type: USER_DETAILS_FAIL, 
        payload: 'Authentication required' 
      });
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
      params: {
        t: Date.now() 
      }
    };

    const { data } = await API.get('/users/me', config);
    

    const userData = data.user || data;
    
    if (!userData) {
      throw new Error('No user data received');
    }

    dispatch({ 
      type: USER_DETAILS_SUCCESS, 
      payload: userData 
    });
    
    return userData; 
  } catch (error) {
    const errorMessage = handleApiError(error);
    dispatch({ 
      type: USER_DETAILS_FAIL, 
      payload: errorMessage 
    });
    throw errorMessage; 
  }
};

// In your listUsers action

export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LIST_REQUEST });

    const {
      adminLogin: { adminInfo } = {},
      userLogin: { userInfo } = {},
    } = getState();


    const token = adminInfo?.token || userInfo?.token;
    const isAdmin = adminInfo?.admin?.isAdmin || adminInfo?.isAdmin;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };


    const endpoint = isAdmin ? '/api/admin/users' : '/api/v1/users';

    const { data } = await axios.get(endpoint, config);

    dispatch({ type: USER_LIST_SUCCESS, payload: data.users || data.data || [] });
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload: error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};



// Delete User (Admin)
export const deleteUser = (userId) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DELETE_REQUEST });

    const {
      adminLogin: { adminInfo } = {},
      userLogin: { userInfo } = {},
    } = getState();

    const token = adminInfo?.token || userInfo?.token;

    if (!token) {
      return dispatch({ type: USER_DELETE_FAIL, payload: 'User not authenticated.' });
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await API.delete(`/users/${userId}`, config);

    dispatch({ type: USER_DELETE_SUCCESS, payload: userId });
  } catch (error) {
    console.error('Delete User Error:', error);
    dispatch({
      type: USER_DELETE_FAIL,
      payload: handleApiError(error),
    });
  }
};

export const createUser = (userData) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const { adminLogin: { adminInfo } = {}, userLogin: { userInfo } = {} } = getState();
    const token = adminInfo?.token || userInfo?.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };


    await API.post('/users', userData, config);

    dispatch({ type: USER_REGISTER_SUCCESS });
    dispatch(listUsers());
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};


export const updateUser = (id, userData) => async (dispatch, getState) => {
  try {

    const { adminLogin: { adminInfo } = {}, userLogin: { userInfo } = {} } = getState();
    const token = adminInfo?.token || userInfo?.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await API.put(`/users/${id}`, userData, config);

    dispatch(listUsers());
  } catch (error) {

    console.error(error);
  }
};
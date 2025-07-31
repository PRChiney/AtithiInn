//frontend/src/actions/adminActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ADMIN_LOGOUT } from '../constants/adminConstants';

export const registerAdmin = createAsyncThunk(
  'admin/register',
  async ({ name, email, password, secretKey }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/admin/register', {
        name,
        email,
        password,
        secretKey
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const loginAdmin = createAsyncThunk(
  'admin/login',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post('/api/admin/login', { email, password });
      
      const response = {
  admin: {
    ...data.admin,
    _id: data.admin._id || data.admin.id,
    isAdmin: true
  },
  token: data.token,
  expiresIn: data.expiresIn
};

     
     localStorage.setItem('adminInfo', JSON.stringify({ ...data }));
      
      
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const logoutAdmin = () => (dispatch) => {
  localStorage.removeItem('adminInfo');
  dispatch({ type: ADMIN_LOGOUT });
};
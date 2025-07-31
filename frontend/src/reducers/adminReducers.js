// frontend/src/reducers/adminReducers.js
import {
  ADMIN_LOGOUT,
  ADMIN_REGISTER_REQUEST,
  ADMIN_REGISTER_SUCCESS,
  ADMIN_REGISTER_FAIL,
} from '../constants/adminConstants';

export const adminLoginReducer = (state = { adminInfo: null }, action) => {
  switch (action.type) {
    case 'admin/login/pending':
      return { ...state, loading: true, error: null };
    case 'admin/login/fulfilled':
      return {
        ...state,
        loading: false,
        adminInfo: action.payload,
        success: true,
        error: null
      };
    case 'admin/login/rejected':
      return { ...state, loading: false, error: action.payload };
    case ADMIN_LOGOUT:
      return { ...state, adminInfo: null, success: false };
    default:
      return state;
  }
};

export const adminRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case ADMIN_REGISTER_REQUEST:
      return { loading: true };
    case ADMIN_REGISTER_SUCCESS:
      return { loading: false, adminInfo: action.payload };
    case ADMIN_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
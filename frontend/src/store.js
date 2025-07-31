// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import { adminLoginReducer, adminRegisterReducer } from './reducers/adminReducers';
// Import reducers
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userListReducer,
  userDeleteReducer,
} from './reducers/userReducers';
import {
  hotelListReducer,
  hotelDetailsReducer,
  hotelCreateReducer,
  hotelDeleteReducer,
} from './reducers/hotelReducers';
import {
  roomListReducer,
  roomCreateReducer,
  roomDeleteReducer,
} from './reducers/roomReducers';
import {
  bookingCreateReducer,
  bookingListMyReducer,
  bookingDetailsReducer,
} from './reducers/bookingReducers';


const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const adminInfoFromStorage = localStorage.getItem('adminInfo')
  ? JSON.parse(localStorage.getItem('adminInfo'))
  : null;


const initialState = {
 userLogin: { 
    userInfo: userInfoFromStorage,
    loading: false,
    error: null
  },
  adminLogin: { 
    adminInfo: adminInfoFromStorage,
    loading: false,
    error: null,
    success: false
  },
  adminRegister: {
    loading: false,
    adminInfo: null,
    error: null,
    success: false
  },
};

// Create store
const store = configureStore({
  reducer: {
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    hotelList: hotelListReducer,
    hotelDetails: hotelDetailsReducer,
    hotelCreate: hotelCreateReducer,
    hotelDelete: hotelDeleteReducer,
    roomList: roomListReducer,
    roomCreate: roomCreateReducer,
    roomDelete: roomDeleteReducer,
    bookingCreate: bookingCreateReducer,
    bookingListMy: bookingListMyReducer,
    adminLogin: adminLoginReducer,
    adminRegister: adminRegisterReducer,
  
bookingDetails: bookingDetailsReducer,
  },
  preloadedState: initialState,
});

export default store;
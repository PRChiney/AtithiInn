import axios from 'axios';
import API from '../services/api';
import {
  ROOM_LIST_REQUEST,
  ROOM_LIST_SUCCESS,
  ROOM_LIST_FAIL,
  ROOM_CREATE_REQUEST,
  ROOM_CREATE_SUCCESS,
  ROOM_CREATE_FAIL,
  ROOM_DELETE_REQUEST,
  ROOM_DELETE_SUCCESS,
  ROOM_DELETE_FAIL,
} from '../constants/roomConstants';

const API_URL = process.env.REACT_APP_API_URL || '/api';


export const listRooms = (params = {}) => async (dispatch, getState) => {
  try {
    dispatch({ type: ROOM_LIST_REQUEST });

    const { 
      adminLogin: { adminInfo },
      userLogin: { userInfo } 
    } = getState();

    const token = adminInfo?.token || userInfo?.token;
    if (!token) {
      throw new Error('Not authorized, no token');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params, 
    };

    const { data } = await API.get('/rooms', config);

    dispatch({ type: ROOM_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ROOM_LIST_FAIL,
      payload: error.response?.data?.message || error.message || 'Failed to fetch rooms',
    });
  }
};


export const createRoom = (roomData) => async (dispatch, getState) => {
  try {
    const { adminLogin: { adminInfo } = {}, userLogin: { userInfo } = {} } = getState();
    const token = adminInfo?.token || userInfo?.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await API.post('/rooms', roomData, config);
    dispatch(listRooms({ page: 1 }));
  } catch (error) {
    console.error(error);
  }
};


export const deleteRoom = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: ROOM_DELETE_REQUEST });

    const { 
      adminLogin: { adminInfo },
      userLogin: { userInfo } 
    } = getState();

    const token = adminInfo?.token || userInfo?.token;
    
    if (!token) {
      throw new Error('Not authorized, no token');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await API.delete(`/rooms/${id}`, config);

    dispatch({ type: ROOM_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: ROOM_DELETE_FAIL,
      payload: error.response?.data?.message || error.message || 'Failed to delete room',
    });
  }
};


export const updateRoom = (id, roomData) => async (dispatch, getState) => {
  try {
    const { adminLogin: { adminInfo } = {}, userLogin: { userInfo } = {} } = getState();
    const token = adminInfo?.token || userInfo?.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await API.put(`/rooms/${id}`, roomData, config);
    dispatch(listRooms());
  } catch (error) {
    console.error(error);
  }
};
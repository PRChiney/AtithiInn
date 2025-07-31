// src/reducers/roomReducers.js
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
  
  export const roomListReducer = (state = { rooms: [] }, action) => {
    switch (action.type) {
      case ROOM_LIST_REQUEST:
        return { loading: true, rooms: [] };
      case ROOM_LIST_SUCCESS:
        return { loading: false,
           rooms: action.payload.data,
          totalPages: action.payload.totalPages,
    currentPage: action.payload.currentPage,
    totalCount: action.payload.totalCount,};
      case ROOM_LIST_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const roomCreateReducer = (state = {}, action) => {
    switch (action.type) {
      case ROOM_CREATE_REQUEST:
        return { loading: true };
      case ROOM_CREATE_SUCCESS:
        return { loading: false, success: true, room: action.payload };
      case ROOM_CREATE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const roomDeleteReducer = (state = {}, action) => {
    switch (action.type) {
      case ROOM_DELETE_REQUEST:
        return { loading: true };
      case ROOM_DELETE_SUCCESS:
        return { loading: false, success: true };
      case ROOM_DELETE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
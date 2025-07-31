// src/reducers/hotelReducers.js
import {
  HOTEL_LIST_REQUEST,
  HOTEL_LIST_SUCCESS,
  HOTEL_LIST_FAIL,
  HOTEL_DETAILS_REQUEST,
  HOTEL_DETAILS_SUCCESS,
  HOTEL_DETAILS_FAIL,
  HOTEL_CREATE_REQUEST,
  HOTEL_CREATE_SUCCESS,
  HOTEL_CREATE_FAIL,
  HOTEL_DELETE_REQUEST,
  HOTEL_DELETE_SUCCESS,
  HOTEL_DELETE_FAIL,
} from '../constants/hotelConstants';

export const hotelListReducer = (state = { hotels: [] }, action) => {
  switch (action.type) {
    case HOTEL_LIST_REQUEST:
      return { loading: true, hotels: [] };
 case HOTEL_LIST_SUCCESS:
  return {
    ...state,
    loading: false,
    hotels: action.payload.data || [], 
    totalCount: action.payload.totalCount,
    currentPage: action.payload.currentPage,
    totalPages: action.payload.totalPages,
  };
    case HOTEL_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const hotelDetailsReducer = (state = { hotel: {} }, action) => {
  switch (action.type) {
    case HOTEL_DETAILS_REQUEST:
      return { loading: true, ...state };
    case HOTEL_DETAILS_SUCCESS:
      return { loading: false, hotel: action.payload };
    case HOTEL_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const hotelCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case HOTEL_CREATE_REQUEST:
      return { loading: true };
    case HOTEL_CREATE_SUCCESS:
      return { loading: false, success: true, hotel: action.payload };
    case HOTEL_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const hotelDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case HOTEL_DELETE_REQUEST:
      return { loading: true };
    case HOTEL_DELETE_SUCCESS:
      return { loading: false, success: true };
    case HOTEL_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
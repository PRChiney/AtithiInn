import API from '../services/api'; // Adjust path to where your axios instance file is saved
import {
  HOTEL_LIST_REQUEST,
  HOTEL_LIST_SUCCESS,
  HOTEL_LIST_FAIL,
  HOTEL_DETAILS_REQUEST,
  HOTEL_DETAILS_SUCCESS,
  HOTEL_DETAILS_FAIL,
  HOTEL_DELETE_REQUEST,
  HOTEL_DELETE_SUCCESS,
  HOTEL_DELETE_FAIL,
} from '../constants/hotelConstants';

// List hotels with optional filters
export const listHotels = (filters = {}) => async (dispatch) => {
  try {
    dispatch({ type: HOTEL_LIST_REQUEST });

    // Clean filters: remove city if empty or only whitespace
    const cleanFilters = { ...filters };
    if (!cleanFilters.city || cleanFilters.city.trim() === '') {
      delete cleanFilters.city;
    } else {
      cleanFilters.city = cleanFilters.city.trim(); // Optional: trim whitespace
    }

    console.log('Sent query params to /hotels:', cleanFilters);

    const { data } = await API.get('/hotels', { params: cleanFilters });
    console.log('API response data:', data);
    dispatch({
  type: HOTEL_LIST_SUCCESS,
  payload: data, // data is the whole object from backend
});
  } catch (error) {
   dispatch({
  type: HOTEL_LIST_FAIL,
  payload:
    error.code === 'ECONNABORTED'
      ? 'Request timed out. Please try again.'
      : error.response?.data?.message || error.message,
});
  }
};



// Fetch hotel details by id
export const listHotelDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: HOTEL_DETAILS_REQUEST });

    const { data } = await API.get(`/hotels/${id}`);
    
    // Extract the hotel data from the response
    const hotelData = data.data || data; // Fallback to entire data if no nested data property
    
    dispatch({
      type: HOTEL_DETAILS_SUCCESS,
      payload: hotelData, // Send just the hotel data, not the entire response
    });
  } catch (error) {
    dispatch({
      type: HOTEL_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Delete a hotel
export const deleteHotel = (hotelId) => async (dispatch, getState) => {
  try {
    dispatch({ type: HOTEL_DELETE_REQUEST });

    // Use admin token if available, otherwise user token
    const { adminLogin: { adminInfo } = {}, userLogin: { userInfo } = {} } = getState();
    const token = adminInfo?.token || userInfo?.token;
    if (!token) throw new Error('Not authorized, no token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await API.delete(`/hotels/${hotelId}`, config);

    dispatch({
      type: HOTEL_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: HOTEL_DELETE_FAIL,
      payload:
        error.code === 'ECONNABORTED'
          ? 'Request timed out. Please try again.'
          : error.response?.data?.message || error.message,
    });
  }
};

// frontend/src/actions/hotelActions.js
export const createHotel = (hotelData) => async (dispatch, getState) => {
  try {
    // Get admin token
    const { adminLogin: { adminInfo } = {}, userLogin: { userInfo } = {} } = getState();
    const token = adminInfo?.token || userInfo?.token;
    if (!token) throw new Error('Not authorized, no token');

    const config = { headers: { Authorization: `Bearer ${token}` } };

    await API.post('/hotels', hotelData, config);

    dispatch(listHotels({ page: 1 }));
  } catch (error) {
    console.error(error);
  }
};

// Add this to hotelActions.js
export const updateHotel = (id, hotelData) => async (dispatch, getState) => {
  try {
    const { adminLogin: { adminInfo } = {}, userLogin: { userInfo } = {} } = getState();
    const token = adminInfo?.token || userInfo?.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await API.put(`/hotels/${id}`, hotelData, config);
dispatch(listHotels());
  } catch (error) {
    console.error(error);
  }
};
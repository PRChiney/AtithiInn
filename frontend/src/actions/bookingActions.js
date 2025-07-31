import API from '../services/api';
import {
  BOOKING_CREATE_REQUEST,
  BOOKING_CREATE_SUCCESS,
  BOOKING_CREATE_FAIL,
  BOOKING_LIST_MY_REQUEST,
  BOOKING_LIST_MY_SUCCESS,
  BOOKING_LIST_MY_FAIL,
  BOOKING_DETAILS_REQUEST,
  BOOKING_DETAILS_SUCCESS,
  BOOKING_DETAILS_FAIL,
  BOOKING_CANCEL_REQUEST,
  BOOKING_CANCEL_FAIL,
  BOOKING_CANCEL_SUCCESS,
} from '../constants/bookingConstants';

const handleBookingError = (error) => {
  // Connection error detection
  if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
    console.error('Booking Connection Error:', error);
    return 'Cannot connect to server. Please check your network and try again.';
  }

  console.error('Booking Error:', {
    error: error.message,
    response: error.response?.data,
    request: error.config?.data
  });

  return error.response?.data?.message || 
         'Booking failed. Please try again.';
};

export const createBooking = (bookingData) => async (dispatch, getState) => {
  try {
    dispatch({ type: BOOKING_CREATE_REQUEST });

    const { userLogin: { userInfo } } = getState();

    if (!userInfo || !userInfo.user || !userInfo.token) {
      dispatch({
        type: BOOKING_CREATE_FAIL,
        payload: 'User authentication failed. Please login again.',
      });
      return;
    }

    // FIX: Ensure all room IDs are valid
    const roomIds = bookingData.rooms
      .map(room => typeof room === 'object' ? room._id : room)
      .filter(id => !!id && id !== 'undefined');

    if (roomIds.length === 0) {
      dispatch({
        type: BOOKING_CREATE_FAIL,
        payload: 'No valid room IDs provided',
      });
      return;
    }

    const payload = {
      hotel: String(bookingData.hotel),
      rooms: roomIds,
      user: String(userInfo.user._id),
      paymentMethod: bookingData.paymentMethod,
      checkInDate: bookingData.checkInDate,
      checkOutDate: bookingData.checkOutDate,
      guests: bookingData.guests || 1,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await API.post('/bookings', payload, config);

    dispatch({ type: BOOKING_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: BOOKING_CREATE_FAIL,
      payload: handleBookingError(error),
    });
  }
};

export const listMyBookings = () => async (dispatch, getState) => {
  try {
    dispatch({ type: BOOKING_LIST_MY_REQUEST });

    const { userLogin: { userInfo } } = getState();

    if (!userInfo || !userInfo.token) {
      dispatch({
        type: BOOKING_LIST_MY_FAIL,
        payload: 'You must be logged in to view your bookings.',
      });
      return;
    }

    const { data } = await API.get('/bookings/mybookings');

    dispatch({
      type: BOOKING_LIST_MY_SUCCESS,
      payload: data.data,
    });
  } catch (error) {
    dispatch({
      type: BOOKING_LIST_MY_FAIL,
      payload: handleBookingError(error),
    });
  }
};
// Add to bookingActions.js
// In bookingActions.js
export const getBookingDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: BOOKING_DETAILS_REQUEST });

    const { userLogin: { userInfo } } = getState();

    if (!userInfo || !userInfo.token) {
      dispatch({
        type: BOOKING_DETAILS_FAIL,
        payload: 'You must be logged in to view booking details.',
      });
      return;
    }

    const { data } = await API.get(`/bookings/${id}`, {
      params: {
        populate: 'hotel,room' // Make sure your backend populates these fields
      }
    });

    dispatch({
      type: BOOKING_DETAILS_SUCCESS,
      payload: data.data,
    });
  } catch (error) {
    dispatch({
      type: BOOKING_DETAILS_FAIL,
      payload: handleBookingError(error),
    });
  }
};

// In bookingActions.js (add this new action)
export const cancelBooking = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: BOOKING_CANCEL_REQUEST });

    const { userLogin: { userInfo } } = getState();

    if (!userInfo || !userInfo.token) {
      dispatch({
        type: BOOKING_CANCEL_FAIL,
        payload: 'You must be logged in to cancel a booking',
      });
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await API.put(`/bookings/${id}`, { status: 'cancelled' }, config);

    dispatch({
      type: BOOKING_CANCEL_SUCCESS,
      payload: data.data,
    });

    // Refresh the booking details after cancellation
    dispatch(getBookingDetails(id));
  } catch (error) {
    dispatch({
      type: BOOKING_CANCEL_FAIL,
      payload: handleBookingError(error),
    });
  }
};
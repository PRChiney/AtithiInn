import { API } from './api';

// Fetch hotels with optional filters
export const fetchHotels = async (filters = {}) => {
  try {
    const response = await API.get('/v1/hotels', { params: filters });
    return response.data;
  } catch (error) {

    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch hotels';
    const statusCode = error.response?.status;
    throw new Error(`Error ${statusCode}: ${errorMessage}`);
  }
};

// Fetch details of a specific hotel by ID
export const fetchHotelDetails = async (id) => {
  try {
    const response = await API.get(`/hotels/${id}`);
    return response.data;
  } catch (error) {

    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch hotel details';
    const statusCode = error.response?.status;
    throw new Error(`Error ${statusCode}: ${errorMessage}`);
  }
};

// Create a new hotel entry
export const createHotel = async (hotelData) => {
  try {
    const response = await API.post('/hotels', hotelData);
    return response.data;
  } catch (error) {

    const errorMessage = error.response?.data?.message || error.message || 'Failed to create hotel';
    const statusCode = error.response?.status;
    throw new Error(`Error ${statusCode}: ${errorMessage}`);
  }
};

// Delete a hotel by ID
export const deleteHotel = async (id) => {
  try {
    await API.delete(`/hotels/${id}`);
  } catch (error) {

    const errorMessage = error.response?.data?.message || error.message || 'Failed to delete hotel';
    const statusCode = error.response?.status;
    throw new Error(`Error ${statusCode}: ${errorMessage}`);
  }
};

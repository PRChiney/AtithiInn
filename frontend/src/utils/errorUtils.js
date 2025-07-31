// src/utils/errorUtils.js

export const getErrorMessage = (error) => {
    if (error.response && error.response.data) {
      return error.response.data.message || error.response.data.error || error.message || 'An error occurred.';
    }
    return error.message || 'An unknown error occurred.';
  };
  
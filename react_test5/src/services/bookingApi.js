import axios from 'axios';

export const createBooking = async (bookingData) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(
      'http://127.0.0.1:8080/booking_api/bookings/',
      bookingData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(bookingData);
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error creating booking', error);
  }
};

export const getAvailableDate = async (apartmentId) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8080/booking_api/available_dates/${apartmentId}/`
    );
    return response;
  } catch (error) {
    console.error('some error witch request', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.patch(
      `http://127.0.0.1:8080/booking_api/bookings/${bookingId}/cancel/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating booking', error);
  }
};

export const getUserBookingDetail = async (bookingId) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(
      `http://127.0.0.1:8080/booking_api/bookings/${bookingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating booking', error);
  }
};

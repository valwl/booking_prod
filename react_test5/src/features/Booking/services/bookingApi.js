import api from '../../../shared/lib/axiosInstance';

export const createBooking = async (bookingData) => {
  try {
    console.log(bookingData);
    const response = await api.post('/booking_api/bookings/', bookingData);
    console.log(bookingData);
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error creating booking', error);
  }
};

export const getAvailableDate = async (apartmentId) => {
  try {
    const response = await api.get(
      `/booking_api/available_dates/${apartmentId}/`
    );
    return response;
  } catch (error) {
    console.error('some error witch request', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const response = await api.post(
      `/booking_api/bookings/${bookingId}/cancel/`,
      {}
    );

    return response;
  } catch (error) {
    console.error('Error creating booking', error);
  }
};

export const getUserBookingDetail = async (bookingId) => {
  try {
    const response = await api.get(`/booking_api/bookings/${bookingId}/`);
    return response;
  } catch (error) {
    console.error('Error creating booking', error);
  }
};

export const getUserBookins = async () => {
  try {
    const response = await api.get('/booking_api/bookings/');
    return response;
  } catch (error) {
    console.error('Error creating booking', error);
  }
};

export const getBookingPaymentUrl = async (id, formData) => {
  try {
    const response = await api.post(
      `booking_api/bookings/${id}/pay/`,
      formData
    );
    return response;
  } catch (error) {
    console.error('Error get booking payment link', error);
  }
};

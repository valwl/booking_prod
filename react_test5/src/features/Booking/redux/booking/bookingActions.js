export const UPDATE_BOOKING_FORM = 'UPDATE_BOOKING_FORM';
export const RESET_BOOKING_FORM = 'RESET_BOOKING_FORM';
export const SAVE_BOOKING_DATA = 'SAVE_BOOKING_DATA';

export const updateBookingForm = (formData) => ({
  type: UPDATE_BOOKING_FORM,
  payload: formData,
});

export const resetBookingForm = () => ({
  type: RESET_BOOKING_FORM,
});

export const saveBookingDates = (bookingData) => ({
  type: SAVE_BOOKING_DATA,
  payload: bookingData,
});

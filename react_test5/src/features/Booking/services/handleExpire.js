import { getUserBookingDetail, cancelBooking } from './bookingApi';

export const handleExpire = async (bookingId) => {
  if (!bookingId) return;

  try {
    const response = await getUserBookingDetail(bookingId);
    console.log(response);

    const currentStatus = response.data.status;

    if (currentStatus === 'pending') {
      await cancelBooking(bookingId);
    }
    return currentStatus;

    // если paid — ничего не отменяем
  } catch (error) {
    console.error('Error checking booking status:', error);
  }
};

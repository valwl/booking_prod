import React from 'react';

import styles from './BookingCancelButton.module.scss';
import { useCancelBooking } from '../../hooks/useBookingCancel';

const BookingCancelButton = ({ bookingId }) => {
  const { cancelBookingProccess } = useCancelBooking(bookingId);
  return (
    <button onClick={cancelBookingProccess} className={styles.cancelButton}>
      Booking Cancel
    </button>
  );
};

export default BookingCancelButton;

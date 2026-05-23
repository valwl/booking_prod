import React from 'react';
import { useLocation } from 'react-router';
import styles from './ConfirmBooking.module.scss';
import { useBookingConfirm } from '../../hooks/useBookingConfirm';

const ConfirmBooking = () => {
  const location = useLocation();

  const { formData: bookingData } = location.state;
  const { user, apartment, handleSubmit, handleNavigate } =
    useBookingConfirm(bookingData);

  return (
    <div className={styles.confirmBookingPage}>
      <div className={styles.confirmBooking}>
        <h2 className={styles.title}>
          Welcome to booking confirm, {user.first_name}
        </h2>

        <div className={styles.confirmBookingDetail}>
          <span>Booking details</span>

          <div className={styles.apartmentTitle}>
            {apartment ? (
              <button
                onClick={() => handleNavigate(bookingData.apartment)}
                className={styles.apartmentTitle}
              >
                Apartment: {apartment.title}
              </button>
            ) : (
              <p>Apartment: booking apartment</p>
            )}
          </div>

          <p>Check-in Day: {bookingData.checkin_day}</p>
          <p>Check-out Day: {bookingData.checkout_day}</p>
          <p>Total price: ${bookingData.total_price}</p>
          <p>
            Guests:
            {bookingData.guests.adults}
          </p>
        </div>

        <div>
          <form onSubmit={handleSubmit} className={styles.sendForm}>
            <button type="submit">Pay now</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBooking;

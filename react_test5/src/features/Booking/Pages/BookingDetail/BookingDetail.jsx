import React from 'react';
import { Link } from 'react-router-dom';
import BaseSlider from '../../../../shared/components/BaseSlider/BaseSlider';
import styles from './BookingDetail.module.scss';
import { StripeCheckOutButton } from '../../components/StripeCheckOutButton/StripeCheckOutButton';

import BookingCancelButton from '../../components/BookingCancelButton/BookingCancelButton';
import { useBookingDetail } from '../../hooks/useBookingDetail';

const BookingDetail = () => {
  const { apartment, formatedTimeLeft, bookingId, booking, bookingStatus } =
    useBookingDetail();

  console.log(apartment);

  return (
    <div className={styles.bookingDetailContainer}>
      <h1 className={styles.pageTitle}>Booking detail</h1>

      <div className={styles.apartmentData}>
        {apartment && apartment.images && Array.isArray(apartment.images) && (
          <div className={styles.sliderContainer}>
            <BaseSlider images={apartment.images.map((image) => image.img)} />
          </div>
        )}
        <Link
          to={`/apartments_detail/${apartment.id}`}
          className={styles.apartmentLink}
        >
          {apartment.title}
        </Link>
      </div>

      <div className={styles.bookingInfo}>
        <h2>Booking information</h2>

        <h3>Check-in-day: {booking.checkin_day}</h3>
        <h3>Check-out-day: {booking.checkout_day}</h3>
        <h3>Total price: {booking.total_price}</h3>
        <h3>status: {booking.status}</h3>
      </div>

      <div className={styles.actions}>
        {bookingStatus === 'pending' && (
          <div className={styles.pendingList}>
            <p className={styles.timerDisplay}>Time Left: {formatedTimeLeft}</p>

            <StripeCheckOutButton
              id={bookingId}
              formData={booking}
              className={styles.buttonActions}
            />

            <BookingCancelButton bookingId={booking.id} />
          </div>
        )}

        {bookingStatus === 'complete' && (
          <Link
            to={`/review_create/${bookingId}`}
            state={{ apartmentId: apartment.id }}
            className={styles.reviewLink}
          >
            Leave review
          </Link>
        )}
      </div>
    </div>
  );
};

export default BookingDetail;

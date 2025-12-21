import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import BaseSlider from '../../../Components/Slider/BaseSlider/BaseSlider';
import styles from './BookingDetail.module.scss';
import { StripeCheckOutButton } from '../../../services/StripeCheckOutButton/StripeCheckOutButton';
import { getUserBookingDetail } from '../../../services/bookingApi';
import BookingCancelButton from '../../../services/BookingCancelButton/BookingCancelButton';
import { useWebSocket } from '../../../services/WebSocketContext';
import { useTimer } from '../../../services/TimerProvider/TimerProvider';

const BookingDetail = () => {
  const { startTimer, handleSuccessfulPayment, timeLeft, status } = useTimer();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: bookingId } = useParams(); // bookingId теперь доступен раньше
  const { booking, apartment } = location.state;
  const [bookingStatus, setBookingStatus] = useState(booking.status);
  const { messageRecived, setMessageRecived } = useWebSocket();

  useEffect(() => {
    if (status === 'EXPIRE') {
      navigate('/home');
      console.log('booking is canceled');
    }
  }, [status, navigate]);

  const fetchBookingStatus = async () => {
    try {
      const updateStatus = await getUserBookingDetail(bookingId);
      setBookingStatus(updateStatus.data.status);
      console.log(updateStatus);
    } catch (error) {
      console.error('Error data booking status:', error);
    }
  };

  useEffect(() => {
    if (messageRecived) {
      fetchBookingStatus();
      setMessageRecived(false);
    }
  }, [messageRecived, setMessageRecived]);

  if (!booking || !apartment) {
    return <div>...Loading</div>;
  }

  const minutes = Math.floor(timeLeft / 60);
  const secondes = timeLeft % 60;
  const formatedTimeLeft = `${String(minutes).padStart(2, '0')}:${String(
    secondes
  ).padStart(2, '0')}`;

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
        <h3>
          Check-in-day: {new Date(booking.checkin_day).toLocaleDateString()}
        </h3>
        <h3>
          Check-out-day: {new Date(booking.checkout_day).toLocaleDateString()}
        </h3>
        <h3>Total price: {booking.total_price}</h3>
        <h3>Status: {bookingStatus}</h3>
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

            <BookingCancelButton bookingId={bookingId} />
          </div>
        )}

        {bookingStatus === 'complete' && (
          <Link
            to={`/review_create/${booking.apartment}`}
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

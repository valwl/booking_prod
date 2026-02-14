import React from 'react';
import { useEffect, useState } from 'react';
import { createBooking } from '../../../services/bookingApi';
import { useNavigate, useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import styles from './ConfirmBooking.module.scss';
import { getApartmentDetail } from '../../../services/apartmentApi';
import { useTimer } from '../../../services/TimerProvider/TimerProvider';
import { createStripeCheckOutSession } from '../../../services/createStripeCheckOutSession';
import { useWebSocket } from '../../../services/WebSocketContext';

const ConfirmBooking = () => {
  const [apartment, setApartment] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { initializeWebSicket, socket } = useWebSocket();
  const { formData: bookingFormData, apartmentId } = location.state;
  const { startTimer } = useTimer();

  const { user } = useSelector((state) => state.auth);
  const { status } = useSelector((state) => state.timer);

  const bookingData = {
    //
    checkin_day: bookingFormData.checkInDay,
    checkout_day: bookingFormData.checkOutDay,
    total_price: bookingFormData.totalPrice,
    apartment: bookingFormData.apartmentId,
    guests: bookingFormData.guests.adults,
    // user: user.id, // Передача ID пользователя вместо всего объекта
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createBooking(bookingData);
      if (response.status === 201) {
        // const { id } = response.data;
        const { booking, checkout_url } = response.data;
        // const booking = response.booking;
        // const checkout_url = response.checkout_url;

        startTimer(1800, booking.id);
        console.log(booking.id);
        initializeWebSicket(booking.id);

        // createStripeCheckOutSession({ id, formData: bookingData });

        window.open(checkout_url, '_blank');

        if (socket) {
          socket.send(
            JSON.stringify({
              type: 'booking_created',
              bookingId: response.data.id,
            })
          );
        }

        navigate('/home');
      }
    } catch (error) {
      console.error('data for this error:', error);
    }
  };

  useEffect(() => {
    const fetchApartmentData = async () => {
      try {
        const response = await getApartmentDetail(bookingFormData.apartmentId);
        setApartment(response);
        console.log(response);
      } catch (error) {
        console.error('error:', error);
      }
    };
    fetchApartmentData();
  }, [apartmentId]);

  const handleNavigate = (apartmentId) => {
    navigate(`/apartments_detail/${apartmentId}`);
  };

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
                onClick={() => handleNavigate(bookingFormData.apartmentId)}
                className={styles.apartmentTitle}
              >
                Apartment: {apartment.title}
              </button>
            ) : (
              <p>Apartment: {apartmentId}</p>
            )}
          </div>

          <p>Check-in Day: {bookingFormData.checkInDay}</p>
          <p>Check-out Day: {bookingFormData.checkOutDay}</p>
          <p>Total price: ${bookingFormData.totalPrice}</p>
          <p>
            Guests: {bookingFormData.guests.adults} Adults,{' '}
            {bookingFormData.guests.children}
            Children, {bookingFormData.guests.pets} Pets
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

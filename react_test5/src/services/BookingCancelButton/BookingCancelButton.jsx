import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import styles from './BookingCancelButton.module.scss';
import { useWebSocket } from '../WebSocketContext';
import { setSleep } from '../../redux/actions/timerActions';
import { useDispatch } from 'react-redux';

const BookingCancelButton = ({ bookingId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeWebSocket } = useWebSocket();
  const handleClick = async (e) => {
    e.preventDefault();
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
      if (response.status === 200) {
        dispatch(setSleep());
        closeWebSocket();
        navigate('/home');
        console.log('booking cancel success');
      }
    } catch (error) {
      console.error('error data', error);
    }
  };
  return (
    <button onClick={handleClick} className={styles.cancelButton}>
      Booking Cancel
    </button>
  );
};

export default BookingCancelButton;

import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BookingCard from '../../../Components/Card/BookingCard/BookingCard';
import styles from './MyBookings.module.scss';
import { useWebSocket } from '../../../services/WebSocketContext';
import api from '../../../services/axiosInstance';

const MyBookings = () => {
  const navigate = useNavigate();
  const { messageRecived, setMessageRecived } = useWebSocket();
  const userName = useSelector((state) => state.auth.user.first_name);

  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('All');

  const fetchBookingList = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await api.get(
        //'http://127.0.0.1:8080/booking_api/bookings/',
        '/booking_api/bookings/'
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );
      console.log(response);
      const filteredBoobings = response.data.filter(
        (booking) => booking.status !== 'cancelled'
      );
      setBookings(filteredBoobings);
      console.log(filteredBoobings);
    } catch (error) {
      console.error('error:', error);
    }
  };

  useEffect(() => {
    fetchBookingList();
  }, []);

  useEffect(() => {
    if (messageRecived) {
      fetchBookingList();
      setMessageRecived(false);
    }
  }, [messageRecived, setMessageRecived]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filtereBookings = bookings.filter((booking) => {
    if (filter === 'All') return true;
    return booking.status === filter;
  });

  const handleMoreDetails = (id, booking, apartment) => {
    navigate(`/bookingDetail/${id}`, { state: { booking, apartment } });
  };

  console.log(bookings);

  return (
    <div className={styles.userBookingPage}>
      <div className={styles.header}>
        <h1>hello {userName} this is your bookings</h1>
        <div className={styles.selectContainer}>
          <select
            id="bookingFilter"
            value={filter}
            onChange={handleFilterChange}
          >
            <option value="All">All</option>
            <option value="pending">pending</option>
            <option value="paid">payd</option>
            <option value="complete">complete</option>
          </select>
        </div>
      </div>

      <div>
        <ul className={styles.bookingList}>
          {filtereBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onMoreDetails={handleMoreDetails}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyBookings;

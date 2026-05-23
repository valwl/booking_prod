import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useWebSocket } from '../services/context/WebSocketContext';
import { useSelector } from 'react-redux';
import { getUserBookins } from '../services/bookingApi';

export const useMyBookingList = () => {
  const navigate = useNavigate();
  const { messageRecived, setMessageRecived } = useWebSocket();
  const userName = useSelector((state) => state.auth.user.first_name);

  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('All');

  const fetchBookingList = async () => {
    try {
      const response = await getUserBookins();

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
  return {
    userName,
    filtereBookings,
    handleMoreDetails,
    handleFilterChange,
    filter,
  };
};

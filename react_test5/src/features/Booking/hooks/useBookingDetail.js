import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getUserBookingDetail } from '../services/bookingApi';
import { useWebSocket } from '../services/context/WebSocketContext';
import { useTimer } from '../services/context/TimerProvider';

export const useBookingDetail = () => {
  const { handleSuccessfulPayment, timeLeft, status } = useTimer();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: bookingId } = useParams(); 
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
  return {
    apartment,
    formatedTimeLeft,
    bookingId,
    booking,
    bookingStatus,
  };
};

import { useNavigate } from 'react-router';
import { cancelBooking } from '../services/bookingApi';
import { useWebSocket } from '../services/context/WebSocketContext';

export const useCancelBooking = (bookingId) => {
  console.log(bookingId);

  const navigate = useNavigate();
  const { closeWebSocket } = useWebSocket();

  const cancelBookingProccess = async (e) => {
    e.preventDefault();

    try {
      const response = cancelBooking(bookingId);
      console.log(response);
      if (response.status === 200) {
        closeWebSocket();
        navigate('/home');
        console.log('booking cancel success');
      }
    } catch (error) {
      console.error('error data', error);
    }
  };

  return { cancelBookingProccess };
};

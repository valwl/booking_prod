import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  runnigTimer,
  timerTick,
  setSleep,
} from '../../redux/actions/timerActions';
import { cancelBooking } from '../../services/bookingApi';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { timeLeft, status, bookingId } = useSelector((state) => state.timer);

  const startTimer = useCallback(
    (duration, bookingId) => {
      dispatch(runnigTimer({ timeLeft: duration, bookingId }));
    },
    [dispatch]
  );

  const handleSuccessfulPayment = useCallback(() => {
    dispatch(setSleep());
  }, [dispatch]);

  useEffect(() => {
    if (timeLeft > 0 && status === 'RUNNING') {
      const timer = setInterval(() => {
        dispatch(timerTick());
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && bookingId && status === 'EXPIRE') {
      cancelBooking(bookingId);
      dispatch(setSleep());
    }
  }, [timeLeft, status, bookingId, dispatch]);

  // const cancelBooking = async (id) => {
  //   try {
  //     await fetch(`/api/bookings/${id}/cancel/`, { method: 'POST' });
  //   } catch (error) {
  //     console.error('Ошибка при отмене бронирования:', error);
  //   }
  // };

  return (
    <TimerContext.Provider
      value={{ startTimer, handleSuccessfulPayment, timeLeft, status }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);

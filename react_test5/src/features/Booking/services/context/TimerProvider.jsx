import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  runnigTimer,
  updateTimeLeft,
  setExpire,
  setSleep,
} from '../../redux/timer/timerActions';
import { handleExpire } from '../handleExpire';

const TimerContext = createContext(null);

export const TimerProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { timeLeft, status, bookingId, expiresAt } = useSelector(
    (state) => state.timer
  );

  /**
   * 🚀 Запуск таймера
   */
  const startTimer = useCallback(
    (durationInSeconds, bookingId) => {
      const expiresAt = Date.now() + durationInSeconds * 1000;
      dispatch(
        runnigTimer({
          expiresAt,
          bookingId,
        })
      );
    },
    [dispatch]
  );

  /**
   * 💳 Успешная оплата
   */

  const handleSuccessfulPayment = useCallback(() => {
    dispatch(setSleep());
  }, [dispatch]);

  /**
   * ⏱ Основной интервал
   */

  useEffect(() => {
    if (status !== 'RUNNING' || !expiresAt) return;
    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((expiresAt - Date.now()) / 1000)
      );
      dispatch(updateTimeLeft(remaining));
      if (remaining === 0) {
        dispatch(setExpire());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status, expiresAt, dispatch]);

  /**
   * 🔥 Обработка истечения
   */

  useEffect(() => {
    if (status !== 'EXPIRE' || !bookingId) return;
    const expireBooking = async () => {
      try {
        await handleExpire(bookingId);
      } catch (error) {
        console.error('Expire failed:', error);
      } finally {
        dispatch(setSleep());
      }
    };
    expireBooking();
  }, [status, bookingId, dispatch]);

  return (
    <TimerContext.Provider
      value={{
        startTimer,
        handleSuccessfulPayment,
        timeLeft,
        status,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used inside TimerProvider');
  }
  return context;
};

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { createBooking } from '../services/bookingApi';
import { getApartmentDetail } from '../../Apartments/api/apartmentApi';
import { useWebSocket } from '../services/context/WebSocketContext';
import { useTimer } from '../services/context/TimerProvider';
import { useDispatch } from 'react-redux';
import { resetBookingForm } from '../redux/booking/bookingActions';
import { saveBookingDates } from '../redux/booking/bookingActions';

export const useBookingConfirm = (bookingData) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apartmentId = bookingData.apartment;

  const { startTimer } = useTimer();
  const { initializeWebSicket } = useWebSocket();

  const { user } = useSelector((state) => state.auth);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [apartment, setApartment] = useState(null);

  const bookingDataToSave = {
    checkin_day: bookingData.checkin_day,
    checkout_day: bookingData.checkout_day,
    total_price: bookingData.total_price,
    apartment: bookingData.apartment,
    guests: bookingData.guests,
  };

  const createBookingData = {
    checkin_day: bookingData.checkin_day,
    checkout_day: bookingData.checkout_day,
    total_price: bookingData.total_price,
    apartment: bookingData.apartment,
    guests: bookingData.guests.adults,
  };

  // booking create
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(bookingData);
    if (!isAuthenticated) {
      dispatch(saveBookingDates(bookingDataToSave));

      navigate('/login');

      return;
    }

    try {
      const response = await createBooking(createBookingData);
      if (response.status === 201) {
        dispatch(resetBookingForm());
        const { booking, checkout_url } = response.data;

        startTimer(1800, booking.id);
        console.log(booking.id);
        initializeWebSicket(booking.id);

        window.open(checkout_url, '_blank');

        navigate('/home');
      }
    } catch (error) {
      console.error('data for this error:', error);
    }
  };
  // как работать с useEffect в хуке и экспортирровать его ?
  useEffect(() => {
    const fetchApartmentData = async () => {
      try {
        const response = await getApartmentDetail(apartmentId);
        setApartment(response);
        console.log(response);
      } catch (error) {
        console.error('error:', error);
      }
    };
    fetchApartmentData();
  }, [apartmentId]);

  const handleNavigate = (apartmentId) => {
    console.log(apartmentId);
    navigate(`/apartments_detail/${apartmentId}`);
  };

  return {
    user,
    apartment,
    bookingData,
    handleSubmit,
    handleNavigate,
  };
};

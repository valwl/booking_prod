import React, { useState, useEffect } from 'react';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking, getAvailableDate } from '../../../services/bookingApi';
import { getApartmentDetail } from '../../../services/apartmentApi';
import { calculateTotalPrice } from '../../../services/calculateTotalPrice';
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';
import styles from './BookingForm.module.scss';
import { saveBookingDates } from '../../../redux/actions/bookingActions';

const BookingForm = ({ apartmentId }) => {
  const dispatch = useDispatch();
  const initialFormData = {
    checkInDay: null,
    checkOutDay: null,
    totalPrice: 0,
    guests: { adults: 1, children: 0, pets: 0 },
    apartmentId: apartmentId, // new
  };

  const [formData, setFormData] = useState(initialFormData);

  const [blockedDates, setBlockedDates] = useState([]);
  const [focusedInput, setFocusedInput] = useState(null);
  const [error, setError] = useState('');

  const [basePrice, setBasePrice] = useState(0);
  const [weekendPrice, setWeekendPrice] = useState(0);
  const [showGuestCount, setShowGuestCount] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchApartmentData = async () => {
      try {
        const response = await getApartmentDetail(apartmentId);
        const { base_price, weekend_price } = response;
        setBasePrice(base_price);
        setWeekendPrice(weekend_price);
      } catch (error) {
        console.error('Error fetching apartment data:', error);
      }
    };

    const fetchAvailableDates = async () => {
      try {
        const response = await getAvailableDate(apartmentId);
        console.log(response);

        setBlockedDates(
          Array.isArray(response.data.blocked_dates)
            ? response.data.blocked_dates.map((date) =>
                moment(date, 'YYYY-MM-DD')
              )
            : []
        );
        console.log(blockedDates);
      } catch (error) {
        console.error('Error fetching available dates', error);
      }
    };

    fetchAvailableDates();
    fetchApartmentData();
  }, [apartmentId]);

  useEffect(() => {
    console.log('total price update:', formData.totalPrice);
  }, [formData.totalPrice]);

  const handleDatesChange = ({ startDate, endDate }) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      checkInDay: startDate,
      checkOutDay: endDate,
    }));

    if (startDate && endDate) {
      if (isRangeInvalid(startDate, endDate)) {
        setError('Выбранный диапазон содержит заблокированные даты');
        setFormData((prevFormData) => ({
          ...prevFormData,
          totalPrice: 0,
        }));
      } else {
        const totalPrice = calculateTotalPrice(
          startDate,
          endDate,
          basePrice,
          weekendPrice
        );
        setFormData((prevFormData) => ({
          ...prevFormData,
          totalPrice,
        }));
        setError('');
      }
    } else {
      setError('Пожалуйста, выберите даты заезда и выезда');
    }
  };
  const handleGuestChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      guests: {
        ...prevFormData.guests,
        [field]: value,
      },
    })); // может ошибка в форме здесь ?
  };

  const isRangeInvalid = (startDate, endDate) => {
    if (!startDate || !endDate) return false;

    let date = startDate.clone();

    while (date.isBefore(endDate, 'day') || date.isSame(endDate, 'day')) {
      if (blockedDates.some((blockedDate) => date.isSame(blockedDate, 'day'))) {
        return true; // Если хотя бы одна дата в диапазоне заблокирована
      }
      date = date.add(1, 'day'); // Переходим к следующему дню в диапазоне
    }

    return false;
  };

  const isOutsideRange = (day) => {
    const { checkInDay, checkOutDay } = formData;

    if (focusedInput === 'endDate' && checkInDay) {
      return (
        day.isBefore(checkInDay, 'day') ||
        isRangeInvalid(checkInDay, day) || // Проверяем на наличие заблокированных дат в диапазоне
        isDayBlocked(day)
      );
    }

    if (focusedInput === 'startDate' && checkOutDay) {
      return (
        day.isAfter(checkOutDay, 'day') ||
        isRangeInvalid(day, checkOutDay) || // Проверяем на наличие заблокированных дат в диапазоне
        isDayBlocked(day)
      );
    }

    return false;
  };

  const isDayBlocked = (day) =>
    blockedDates.some((date) => day.isSame(date, 'day'));

  console.log(blockedDates);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bookingFormData = {
      ...formData,
      checkInDay: formData.checkInDay
        ? formData.checkInDay.format('YYYY-MM-DD')
        : null,
      checkOutDay: formData.checkOutDay
        ? formData.checkOutDay.format('YYYY-MM-DD')
        : null,
      guests: formData.guests,
      // guests: {
      //   adults: initialFormData.guests.adults,
      //   children: initialFormData.guests.children,
      //   pets: initialFormData.guests.pets,
      // }
    };
    try {
      if (isAuthenticated) {
        console.log('navigation witch state:', {
          formData: bookingFormData,
          apartmentId,
        });
        navigate('/bookingConfirm', {
          state: { formData: bookingFormData, apartmentId },
        });
      } else {
        dispatch(saveBookingDates(bookingFormData));
        console.log(bookingFormData);
        navigate('/Login');
        alert('Please login to the system');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const handleClearDates = () => {
    setFormData({
      checkInDay: null,
      checkOutDay: null,
      totalPrice: 0,
      guests: { adults: 1, children: 0, pets: 1 },
    });
    setFocusedInput(null);
    setError('');
  };

  return (
    <div className={styles.bookingFormContainer}>
      <form onSubmit={handleSubmit}>
        <DateRangePicker
          startDate={formData.checkInDay}
          startDateId="start_date_id"
          endDate={formData.checkOutDay}
          endDateId="end_date_id"
          onDatesChange={handleDatesChange}
          focusedInput={focusedInput}
          onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
          isDayBlocked={isDayBlocked}
          isOutsideRange={isOutsideRange}
          numberOfMonths={1}
          hideKeyboardShortcutsPanel
        />

        <div>
          <label onClick={() => setShowGuestCount(!showGuestCount)}>
            Guest
          </label>
          {showGuestCount && (
            <div className={styles.guestCountContainer}>
              <div>
                <label>Adults</label>
                <input
                  type="number"
                  value={formData.guests.adults}
                  onChange={(e) => handleGuestChange('adults', e.target.value)}
                />
              </div>

              <div>
                <label>Children</label>
                <input
                  type="number"
                  value={formData.guests.children}
                  onChange={(e) =>
                    handleGuestChange('children', e.target.value)
                  }
                />
              </div>

              <div>
                <label>Pets</label>
                <input
                  type="number"
                  value={formData.guests.pets}
                  onChange={(e) => handleGuestChange('pets', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className={styles.totalPrice}>
          <label>Total Price: ${formData.totalPrice}</label>
          <button type="button" onClick={handleClearDates}>
            Clear
          </button>
        </div>

        <button type="submit">Book</button>
      </form>
    </div>
  );
};

export default BookingForm;

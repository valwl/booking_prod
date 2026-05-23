import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { getAvailableDate, createBooking } from '../services/bookingApi';
import { calculateTotalPrice } from '../services/calculateTotalPrice';
import moment from 'moment';

export const useBookingForm = (apartmentId, apartment) => {
  // -------------------------------

  // 1️⃣ Инфраструктура

  // -------------------------------

  const navigate = useNavigate(); // для переходов

  // -------------------------------

  // 2️⃣ Доменное состояние формы

  // -------------------------------

  const [formData, setFormData] = useState({
    checkin_day: null,

    checkout_day: null,

    guests: { adults: 1, children: 0, pets: 0 },

    total_price: 0,
  });

  const [blockedDates, setBlockedDates] = useState([]);

  const { base_price, weekend_price } = apartment;

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [focusedInput, setFocusedInput] = useState(null);

  // -------------------------------

  // 3️⃣ Инициализация данных

  // -------------------------------

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getAvailableDate(apartmentId);

        setBlockedDates(
          Array.isArray(response.data.blocked_dates)
            ? response.data.blocked_dates.map((date) =>
                moment(date, 'YYYY-MM-DD')
              )
            : []
        );
        // setBlockedDates(blockedRes.data);
      } catch (err) {
        setError('Failed to load booking data');
      }
    };

    loadData();
  }, [apartmentId]);

  // -------------------------------

  // 4️⃣ ЛОГИКА ДАТ

  // -------------------------------

  const isDayBlocked = (day) =>
    blockedDates.some((date) => day.isSame(date, 'day'));

  const isRangeInvalid = (startDate, endDate) => {
    if (!startDate || !endDate) return false;

    let date = startDate.clone();

    while (date.isBefore(endDate, 'day') || date.isSame(endDate, 'day')) {
      if (isDayBlocked(date)) return true;

      date = date.clone().add(1, 'day');
    }

    return false;
  };

  const isOutsideRange = (day) => {
    const { checkin_day, checkout_day } = formData;

    if (focusedInput === 'endDate' && checkin_day) {
      return (
        day.isBefore(checkin_day, 'day') ||
        isRangeInvalid(checkin_day, day) ||
        isDayBlocked(day)
      );
    }

    if (focusedInput === 'startDate' && checkout_day) {
      return (
        day.isAfter(checkout_day, 'day') ||
        isRangeInvalid(day, checkout_day) ||
        isDayBlocked(day)
      );
    }

    return false;
  };

  // -------------------------------

  // 5️⃣ Обновление дат

  // -------------------------------

  const updateDates = (startDate, endDate) => {
    const total = calculateTotalPrice(
      startDate,
      endDate,
      weekend_price,
      base_price
    );

    setFormData((prev) => ({
      ...prev,

      checkin_day: startDate,

      checkout_day: endDate,

      total_price: total,
    }));
  };

  // -------------------------------

  // 6️⃣ Обновление гостей

  // -------------------------------

  const updateGuests = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      guests: {
        ...prevFormData.guests,
        [field]: value,
      },
    }));
  };

  // -------------------------------

  // 7️⃣ Очистка формы

  // -------------------------------

  const clear = () => {
    setFormData({
      checkin_day: null,

      checkout_day: null,

      guests: { adults: 1, children: 0, pets: 0 },

      total_price: 0,
    });

    setError(null);
  };

  // -------------------------------

  // 8️⃣ Отправка формы

  // -------------------------------

  const submit = async () => {
    // базовая валидация

    if (!formData.checkin_day || !formData.checkout_day) {
      setError('Please select dates');

      return;
    }

    // если не авторизован → сохраняем draft

    try {
      setLoading(true);

      const payload = {
        apartment: apartmentId,

        checkin_day: formData.checkin_day.format('YYYY-MM-DD'),

        checkout_day: formData.checkout_day.format('YYYY-MM-DD'),

        guests: formData.guests,
        total_price: formData.total_price,
      };

      navigate('/bookingConfirm', {
        state: { formData: payload },
      });
    } catch (err) {
      setError('Booking failed');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------

  // 9️⃣ Возвращаем публичный API

  // -------------------------------

  return {
    formData,
    blockedDates,
    loading,
    error,
    updateDates,
    updateGuests,
    clear,
    submit,
    blockedDates,

    isDayBlocked,

    isOutsideRange,
    focusedInput,
    setFocusedInput,
  };
};

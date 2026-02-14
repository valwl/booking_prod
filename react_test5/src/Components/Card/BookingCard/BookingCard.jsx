import React from 'react';
import BaseSlider from '../../Slider/BaseSlider/BaseSlider';
import styles from './BookingCard.module.scss';
import { useState, useEffect } from 'react';
import { getApartmentDetail } from '../../../services/apartmentApi';
import { type } from '@testing-library/user-event/dist/type';

const BookingCard = ({ booking, onMoreDetails }) => {
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApartmentData = async () => {
      try {
        const response = await getApartmentDetail(booking.apartment);
        setApartment(response);
      } catch (error) {
        console.error('error fetching apartment data', error);
      } finally {
        setLoading(false);
      }
    };
    console.log('');
    fetchApartmentData();
  }, [booking.apartment]);

  // console.log(booking);
  // console.log(typeof booking.checkin_day);
  // console.log(booking.checkin_day, booking.checkin_day.length);

  if (!apartment) {
    return <p>apartment not found</p>;
  }

  return (
    <div className={styles.bookingContainer}>
      {apartment && apartment.images && Array.isArray(apartment.images) && (
        <div className={styles.sliderContainer}>
          <BaseSlider images={apartment.images.map((image) => image.img)} />
        </div>
      )}

      <div className={styles.bookingCardContent}>
        <h3 className={styles.bookingCardTitle}>{apartment.title}</h3>

        <p>Check-in-day: {booking.checkin_day}</p>

        <p>Check-out-day: {booking.checkout_day}</p>

        <button
          className={styles.bookingCardButton}
          onClick={() => onMoreDetails(booking.id, booking, apartment)}
        >
          Get More Info
        </button>
      </div>
    </div>
  );
};

export default BookingCard;

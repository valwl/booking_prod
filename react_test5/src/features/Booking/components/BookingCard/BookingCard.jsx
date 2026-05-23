import React from 'react';
import BaseSlider from '../../../../shared/components/BaseSlider/BaseSlider';
import styles from './BookingCard.module.scss';
import { useState, useEffect } from 'react';
import { getApartmentDetail } from '../../../Apartments/api/apartmentApi';

const BookingCard = ({ booking, onMoreDetails }) => {
  const [apartment, setApartment] = useState(null);

  useEffect(() => {
    const fetchApartmentData = async () => {
      try {
        const response = await getApartmentDetail(booking.apartment);
        setApartment(response);
      } catch (error) {
        console.error('error fetching apartment data', error);
      }
    };
    fetchApartmentData();
  }, [booking.apartment]);

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

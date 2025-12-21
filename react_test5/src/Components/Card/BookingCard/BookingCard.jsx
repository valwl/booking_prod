import React from 'react';
import BaseSlider from '../../Slider/BaseSlider/BaseSlider';
import styles from './BookingCard.module.scss';
import { useState, useEffect } from 'react';
import { getApartmentDetail } from '../../../services/apartmentApi';

const BookingCard = ({ booking, onMoreDetails }) => {
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(booking);

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
    fetchApartmentData();
  }, [booking.apartment]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!apartment) {
    return <p>Error loading apartment data</p>;
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

        <p>Check-in: {new Date(booking.checkin_day).toLocaleDateString()}</p>
        <p>Check-out: {new Date(booking.checkout_day).toLocaleDateString()}</p>

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

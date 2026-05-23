import React from 'react';
import { Link } from 'react-router-dom';
import styles from './SaveBooking.module.scss';
import sagradaFamilia2 from './saganoForest.jpeg';

const SaveBooking = () => {
  return (
    <div className={styles.saveBookingContainer}>
      <img
        src={sagradaFamilia2}
        alt="Save Booking"
        className={styles.saveBookingImage}
      />
      <div className={styles.saveBookingContent}>
        <h1>Secure Your Stay with Confidence</h1>
        <p>
          Our state-of-the-art booking system ensures that your reservations are
          not only easy to make but also highly secure. We prioritize your
          safety and convenience, so you can focus on enjoying your trip. Trust
          us to handle your bookings with the utmost care, providing you with
          peace of mind every step of the way.
        </p>
      </div>
      <Link to="/apartments" className={styles.saveBookingLink}>
        Go to Apartment Selection
      </Link>

      
    </div>
  );
};

export default SaveBooking;

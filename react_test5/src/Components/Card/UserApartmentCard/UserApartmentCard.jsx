import React from 'react';
import BaseSlider from '../../Slider/BaseSlider/BaseSlider';
import styles from './UserApartmentCard.module.scss';

const UserApartmentCard = ({ apartment, onMoreDetails }) => {
  console.log(apartment);
  if (!apartment) {
    return <p>Error loading apartment data</p>;
  }

  const imageUrl = apartment.images.map((image) =>
    image.img.startsWith('http')
      ? image.img
      : `http://127.0.0.1:8080/${image.img}`
  );

  console.log(apartment.images)

  return (
    <div className={styles.bookingContainer}>
      {apartment && apartment.images && Array.isArray(apartment.images) && (
        <div className={styles.sliderContainer}>
          <BaseSlider images={imageUrl} />

        </div>
      )}

      <div className={styles.bookingCardContent}>
        <h3 className={styles.bookingCardTitle}>{apartment.title}</h3>

        <button
          className={styles.bookingCardButton}
          onClick={() => onMoreDetails(apartment.id)}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default UserApartmentCard;

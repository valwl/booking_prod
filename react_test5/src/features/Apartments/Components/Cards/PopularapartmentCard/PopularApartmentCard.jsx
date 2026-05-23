import React from 'react';
import styles from './PopularApartmentCard.module.scss';
import BaseSlider from '../../../../../shared/components/BaseSlider/BaseSlider';

const PopularApartmentCard = ({ images, title, onMoreDetails }) => {
  return (
    <div className={styles.popularApartmentCard}>
      <div className={styles.popularApartmentSlider}>
        <BaseSlider images={images} />
      </div>

      <div className={styles.popularApartmentContent}>
        <h1>{title}</h1>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoreDetails();
          }}
          className={styles.popularApartmentButton}
        >
          Read More
        </button>
      </div>
    </div>
  );
};

export default PopularApartmentCard;

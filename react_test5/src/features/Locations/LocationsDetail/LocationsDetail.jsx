import React from 'react';

import BaseSlider from '../../../shared/components/BaseSlider/BaseSlider';
import styles from './LocationsDetail.module.scss';
import { useLocationdetail } from '../hooks/useLocationDetail';

const LocationDetail = () => {
  const { location, handleBookNow } = useLocationdetail();
  if (!location) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.locationDetailContainer}>
      <div className={styles.sliderContainer}>
        <BaseSlider images={location.images.map((image) => image.img)} />
      </div>
      <div className={styles.detailsContainer}>
        <h2 className={styles.locationTitle}>{location.name}</h2>
        <p className={styles.locationDescription}>{location.description}</p>
        <button className={styles.bookButton} onClick={handleBookNow}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default LocationDetail;

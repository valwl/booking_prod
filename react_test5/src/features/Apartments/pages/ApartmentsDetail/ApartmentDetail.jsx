import React from 'react';
import styles from './ApartmentsDetail.module.scss';

import BaseSlider from '../../../../shared/components/BaseSlider/BaseSlider';
import BookingForm from '../../../Booking/forms/BookingForm/BookingForm';
import ReviewList from '../../../Reviews/ReviewList/ReviewList';

import { useApartmentDetail } from '../../hooks/useApartmentDetail';

const ApartmentsDetail = () => {
  const { apartment, handlePhotoClick, activeSlide, loading } =
    useApartmentDetail();
  console.log(apartment);

  if (!apartment) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.apartmentDetailPage}>
      <div className={styles.sliderContainer}>
        <div className={styles.mainSlider}>
          <BaseSlider
            images={apartment.images.map((image) => image.img)}
            activeSlide={activeSlide}
          />
        </div>
        <div className={styles.sidePhotoContainer}>
          {apartment.images.map((image, index) => (
            <img
              src={image.img}
              alt={apartment.title}
              key={index}
              className={styles.thumbnail}
              onClick={() => handlePhotoClick(index)}
            />
          ))}
        </div>
      </div>

      <div className={styles.apartmentInfoContainer}>
        <div className={styles.leftSide}>
          <h2 className={styles.apartmentTitle}>{apartment.title}</h2>
          <p className={styles.apartmentDescription}>{apartment.description}</p>
        </div>

        <div className={styles.rightSide}>
          <div className={styles.priceContainer}>
            <h3 className={styles.basePrice}>
              base_price: {apartment.base_price}
            </h3>
            <h3 className={styles.weekendPrice}>
              weekend_price: {apartment.weekend_price}
            </h3>
          </div>

          <div className={styles.bookingFormContainer}>
            <BookingForm apartmentId={apartment.id} apartment={apartment} />
          </div>
        </div>
      </div>

      <div className={styles.reviewsContainer}>
        {/* <ReviewList apartmentId={apartment.id} /> */}
        <ReviewList reviews={apartment.reviews} />
      </div>
    </div>
  );
};

export default ApartmentsDetail;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getApartmentDetail } from '../../../services/apartmentApi';
import BaseSlider from '../../../Components/Slider/BaseSlider/BaseSlider';
import BookingForm from '../../../Components/Forms/BookingForm/BookingForm';
import ReviewList from '../../../Components/List/ReviewList/ReviewList';
import styles from './ApartmentsDetail.module.scss';

const ApartmentsDetail = () => {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchApartmentData = async () => {
      try {
        const response = await getApartmentDetail(id);
        setApartment(response);
        console.log(response);
      } catch (error) {
        console.error('error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApartmentData();
  }, [id]);

  if (!apartment) {
    return <div>Loading...</div>;
  }

  const handlePhotoClick = (index) => {
    setActiveSlide(index);
  };

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
            <BookingForm apartmentId={apartment.id} />
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

import React from 'react';
import { useState, useEffect } from 'react';

import { getApartmentReview } from '../../../services/apartmentApi';
import styles from './ReviewList.module.scss';

const ReviewList = ({ apartmentId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getApartmentReview(apartmentId);
        console.log(response);
        setReviews(response);
        console.log(reviews);
      } catch (error) {
        console.error('data error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [apartmentId]);

  if (loading) {
    return <div>...Loading</div>;
  }

  return (
    <div className={styles.reviews}>
      <h2>Reviews for this Apartment</h2>
      {reviews?.length === 0 ? (
        <h3>No review for this apartment </h3>
      ) : (
        <ul className={styles.reviewList}>
          {reviews.map((review) => (
            <li key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <h3 className={styles.reviewTitle}>Author: {review.author}</h3>
                <p className={styles.reviewRating}>Rating: {review.rating}</p>
              </div>

              <p className={styles.reviewDescripiton}>
                Description: {review.text}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewList;

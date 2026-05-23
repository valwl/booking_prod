import React from 'react';
import styles from './ReviewList.module.scss';

const ReviewList = ({ reviews }) => {
  if (!reviews) return <div>Loading...</div>;

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

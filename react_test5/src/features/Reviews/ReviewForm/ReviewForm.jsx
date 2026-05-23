import React from 'react';
import styles from './ReviewForm.module.scss';
import { useReviewForm } from './useReviewForm';

const ReviewForm = () => {
  const { handleSubmit, formData, handleChange, first_name } = useReviewForm();

  console.log(formData.author);
  return (
    <div className={styles.reviewCreatePage}>
      <form onSubmit={handleSubmit} className={styles.reviewForm}>
        <div>
          <label> username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            placeholder={first_name}
            readOnly
          />
        </div>

        <div>
          <label> score</label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>

        <div>
          <label> review</label>
          <textarea
            name="text"
            value={formData.text}
            onChange={handleChange}
            className={styles.reviewEria}
            required
          />
        </div>

        <button type="submit" className={styles.reviewButton}>
          leave review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;

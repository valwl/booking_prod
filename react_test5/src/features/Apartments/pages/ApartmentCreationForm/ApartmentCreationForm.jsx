import React from 'react';
import Select from 'react-select';

import styles from './ApartmentCreationForm.module.scss';
import { useApartmentCreate } from '../../hooks/useApartmentCraete';

const ApartmentCreationForm = () => {
  const {
    handleSubmit,
    formData,
    handleChange,
    locations,
    handleLocationChange,
    handleFileChange,
    error,
  } = useApartmentCreate();

  return (
    <div className={styles.pageContainer}>
      <form onSubmit={handleSubmit} className={styles.formApartment}>
        <h1>Create new apartment</h1>
        <div className={styles.form_group}>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={styles.inputElem}
            required
          />
        </div>
        <div className={styles.form_group}>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.reviewEria}
            required
          />
        </div>
        <div className={styles.form_group}>
          <label>Base Price:</label>
          <input
            type="text"
            name="base_price"
            value={formData.base_price}
            onChange={handleChange}
            className={styles.inputElem}
            required
          />
        </div>
        <div className={styles.form_group}>
          <label>Weekend Price:</label>
          <input
            type="text"
            name="weekend_price"
            value={formData.weekend_price}
            onChange={handleChange}
            className={styles.inputElem}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Location:</label>
          <Select
            options={locations}
            onChange={handleLocationChange}
            placeholder="Select location"
          />
        </div>
        <div className={styles.form_group}>
          <input
            type="file"
            name="images"
            onClick={() => console.log('input clicked')}
            onChange={handleFileChange}
            className={styles.fileInput}
            multiple
            required
          />
        </div>
        {error.message && <p className={styles.error}>{error.message}</p>}
        <button className={styles.button} type="submit">
          Create Apartment
        </button>
      </form>
    </div>
  );
};

export default ApartmentCreationForm;

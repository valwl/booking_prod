import React from 'react';

import styles from './ApartmentUpdate.module.scss';
import { useApartmentUpdate } from '../../hooks/useApartmentUpdate';

const ApartmentUpdate = () => {
  const {
    handleSubmit,
    formData,
    handleChange,
    previewImages,
    handleDelete,
    handleRemoveImage,
    handleFileChange,
  } = useApartmentUpdate();

  return (
    <div className={styles.container}>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className={styles.apartmentForm}
      >
        <h2>Update Apartment</h2>
        <div className={styles.formGroup}>
          <label>Название:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={styles.inputElem}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Описание:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.reviewEria}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Цена за ночь:</label>
          <input
            type="number"
            name="base_price"
            value={formData.base_price}
            onChange={handleChange}
            className={styles.inputElem}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Цена за выходные:</label>
          <input
            type="number"
            name="weekend_price"
            value={formData.weekend_price}
            onChange={handleChange}
            className={styles.inputElem}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Изображения:</label>
          <input
            type="file"
            name="images"
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className={styles.fileInput}
          />
          <div className={styles.imagePreview}>
            {previewImages.map((image, index) => (
              <div key={index} className={styles.previewContainer}>
                <img src={image} alt={`preview ${index}`} />
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() =>
                    handleRemoveImage(
                      index,
                      index >= formData.images.length
                      // Определяем, новое ли изображение
                    )
                  }
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={handleDelete}
            className={styles.deleteButton}
          >
            Удалить квартиру
          </button>
          <button type="submit" className={styles.updateButton}>
            Обновить квартиру
          </button>
        </div>
      </form>
    </div>
  );
};
export default ApartmentUpdate;

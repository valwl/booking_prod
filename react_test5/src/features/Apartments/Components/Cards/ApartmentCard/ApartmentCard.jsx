import React from 'react';
import BaseCard from '../../../../../shared/ui/BaseCard/BaseCard';
import PropTypes from 'prop-types';
import styles from './ApartmentCard.module.scss';

const ApartmentCard = ({ apartment, onMoreDetails }) => {
  const imageUrl = apartment.images.map((image) =>
    image.img.startsWith('http')
      ? image.img
      : `http://127.0.0.1:8080/${image.img}`
  );
  return (
    <BaseCard
      title={apartment.title}
      images={imageUrl}
      onMoreDetails={() => onMoreDetails(apartment.id)}
      backContent={apartment.description}
    >
      <div className={styles.apartmentCardPrice}>
        <span>Price: ${apartment.base_price} $</span>
      </div>
    </BaseCard>
  );
};

ApartmentCard.propTypes = {
  apartment: PropTypes.shape({
    title: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        img: PropTypes.string.isRequired,
      })
    ).isRequired,
    base_price: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  onMoreDetails: PropTypes.func.isRequired,
};

export default ApartmentCard;

import React from 'react';
import styles from './PopularApartmentList.module.scss';
import PopularApartmentCard from '../../Components/Cards/PopularapartmentCard/PopularApartmentCard';
import { usePopularApartment } from '../../hooks/usePopularApartment';

const PopularApartmentList = () => {
  const {apartments, onMoreDetails} = usePopularApartment();
  return (
    <div className={styles.PopularApartmentList}>
      <div className={styles.carousel}>
        {apartments.map((apartment, index) => (
          <PopularApartmentCard
            key={`${apartment.id}-${index}`}
            title={apartment.title}
            onMoreDetails={() => onMoreDetails(apartment.id)}
            images={apartment.images}
            style={{ animationDelay: `${index * 2}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularApartmentList;

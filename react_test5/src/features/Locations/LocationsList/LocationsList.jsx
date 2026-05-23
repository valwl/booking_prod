import React from 'react';
import BaseCard from '../../../shared/ui/BaseCard/BaseCard';
import styles from './LocationsLIst.module.scss';
import { useLocationList } from '../hooks/useLocationList';

const LocationsList = () => {
  const { locations, handleMoreDetails } = useLocationList();

  return (
    <div className={styles.locationList}>
      {locations.map((location) => (
        <BaseCard
          title={location.name}
          images={location.images.map((image) => image.img)}
          backContent={location.description}
          onMoreDetails={() => handleMoreDetails(location.id)}
        />
      ))}
    </div>
  );
};

export default LocationsList;

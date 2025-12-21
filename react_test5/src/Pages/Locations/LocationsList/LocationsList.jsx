import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import BaseCard from '../../../Components/Card/BaseCard/BaseCard';
import axios from 'axios';
import styles from './LocationsLIst.module.scss';

const LocationsList = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:8080/apartments_api/locations/'
        );
        console.log(response);
        setLocations(response.data);
      } catch (error) {
        console.error('error:', error);
      }
    };
    fetchLocations();
  }, []);

  const handleMoreDetails = (id) => {
    navigate(`/LocationDetail/${id}`);
  };

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

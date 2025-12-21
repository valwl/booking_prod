import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import BaseSlider from '../../../Components/Slider/BaseSlider/BaseSlider';
import styles from './LocationsDetail.module.scss';

const LocationDetail = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);

  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/Apartments`, {state: {locationId: location.id}});
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8080/apartments_api/location/${id}/`
        );

        setLocation(response.data);
      } catch (error) {
        console.error('Error fetching location details:', error);
      }
    };
    fetchLocation();
  }, [id]);

  if (!location) {
    return <div>Loading...</div>;
  }
  if (!location) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.locationDetailContainer}>
      <div className={styles.sliderContainer}>
        <BaseSlider images={location.images.map((image) => image.img)} />
      </div>
      <div className={styles.detailsContainer}>
        <h2 className={styles.locationTitle}>{location.name}</h2>
        <p className={styles.locationDescription}>{location.description}</p>
        <button className={styles.bookButton} onClick={handleBookNow}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default LocationDetail;

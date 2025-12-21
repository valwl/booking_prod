import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import BaseSlider from '../BaseSlider/BaseSlider';
import styles from './PopularDestanations.module.scss';
import axios from 'axios';

const PopularDestanations = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchDestanationImages = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:8080/apartments_api/slider_image/'
        );
        console.log(response);
        const imageArray = response.data.map((location) => location.image);
        setImages(imageArray);
      } catch (error) {
        console.error('error:', error);
      }
    };
    fetchDestanationImages();
  }, []);

  if (images.length === 0) return null;

  return (
    <div className={styles.popularDestinations}>
      <h2 className={styles.title}>Popular Destanations</h2>

      <BaseSlider images={images} className={styles.sliderContainer} />

      <Link to="/Locations"> See all Popular Destanations</Link>
    </div>
  );
};

export default PopularDestanations;

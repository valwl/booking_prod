import React from 'react';
import { useState, useEffect } from 'react';
import styles from './PopularApartmentList.module.scss';
import { useNavigate } from 'react-router';
import axios from 'axios';
import PopularApartmentCard from '../../Card/PopularapartmentCard/PopularApartmentCard';

const PopularApartmentList = () => {
  const navigate = useNavigate();
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    const fetchPopularApartment = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:8080/apartments_api/popular_apartment/'
        );

        const processedData = response.data.map((apartment) => ({
          ...apartment,
          id: apartment.id.toString(),
          base_price: Number(apartment.base_price),
          images: apartment.images.map(
            (image) => `http://127.0.0.1:8080${image.img}`
          ),
        }));

        setApartments(processedData);
        console.log(processedData);
      } catch (error) {
        console.error('error:', error);
      }
    };
    fetchPopularApartment();
  }, []);

  const onMoreDetails = async (id) => {
    navigate(`/apartments_detail/${id}`);
  };

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

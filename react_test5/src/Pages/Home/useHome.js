import { useState, useEffect } from 'react';
// import api from '../../shared/lib/axiosInstance';
import { publickApi } from '../../shared/lib/axiosInstance';

export const useHome = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchDestanationImages = async () => {
      try {
        const response = await publickApi.get('/apartments_api/slider_image/');
        console.log(response);
        const imageArray = response.data.map((location) => location.image);
        setImages(imageArray);
      } catch (error) {
        console.error('error:', error);
      }
    };
    fetchDestanationImages();
  }, []);
  return {
    images,
  };
};

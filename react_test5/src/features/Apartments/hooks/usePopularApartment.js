import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import api from '../../../shared/lib/axiosInstance';

export const usePopularApartment = () => {
  const navigate = useNavigate();
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    const fetchPopularApartment = async () => {
      try {
        const response = await api.get('/apartments_api/popular_apartment/');

        const processedData = response.data.map((apartment) => ({
          ...apartment,
          id: apartment.id.toString(),
          base_price: Number(apartment.base_price),
          images: apartment.images.map((img) => img.img),
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

  return {
    onMoreDetails,
    apartments,
  };
};

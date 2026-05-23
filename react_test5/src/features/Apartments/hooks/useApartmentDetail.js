import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { getApartmentDetail } from '../api/apartmentApi';

export const useApartmentDetail = () => {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchApartmentData = async () => {
      try {
        const response = await getApartmentDetail(id);
        setApartment(response);
        console.log(response);
      } catch (error) {
        console.error('error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApartmentData();
  }, [id]);

  const handlePhotoClick = (index) => {
    setActiveSlide(index);
  };

  return {
    apartment,
    handlePhotoClick,
    activeSlide,
    loading,
  };
};

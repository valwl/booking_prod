import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserApartment } from '../api/apartmentApi';
import { useSelector } from 'react-redux';

export const useUserApartment = () => {
  const navigate = useNavigate();
  const userName = useSelector((state) => state.auth.user.first_name);
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserApartments = async () => {
      try {
        const apartment = await getUserApartment();
        setApartments(apartment);
      } catch (error) {
        console.error('error fetching user apartment', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserApartments();
  }, []);

  const handleMoreDetails = (id) => {
    navigate(`/apartment_update/${id}`);
  };

  return {
    userName,
    loading,
    apartments,
    handleMoreDetails,
  };
};

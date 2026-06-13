import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import api from '../../../shared/lib/axiosInstance';
import { publickApi } from '../../../shared/lib/axiosInstance';

export const useLocationList = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await publickApi.get('/apartments_api/locations/');
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

  return {
    locations,
    handleMoreDetails,
  };
};

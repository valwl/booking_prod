import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from '../../../shared/lib/axiosInstance';

export const useLocationdetail = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);

  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/Apartments`, { state: { locationId: location.id } });
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await api.get(`/apartments_api/location/${id}/`);

        setLocation(response.data);
      } catch (error) {
        console.error('Error fetching location details:', error);
      }
    };
    fetchLocation();
  }, [id]);

  return {
    location,
    handleBookNow,
  };
};

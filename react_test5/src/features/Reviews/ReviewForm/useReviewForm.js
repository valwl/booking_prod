import { useState, useEffect } from 'react';
import api from '../../../shared/lib/axiosInstance';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { useLocation } from 'react-router';

export const useReviewForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);
  const location = useLocation();
  const apartmentId = location.state?.apartmentId;
  const initialData = {
    text: '',
    rating: '',
  };
  const [formData, setFormData] = useState(initialData);

  const { first_name } = useSelector((state) => state.auth.user);
  console.log(first_name);

  useEffect(() => {
    const setUserName = () => {
      if (first_name) {
        setFormData({ ...formData, [initialData.author]: first_name });
      }
    };

    setUserName();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        `/apartments_api/create_review/${id}/`,
        formData
      );
      console.log('review success added', response.data);
      if (response.status === 201) {
        navigate(`/apartments_detail/${apartmentId}`);
        console.log('review creation success');
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.detail);

        navigate('/home');
      }

      console.error('error with add review', error);
    }
  };

  return { handleSubmit, formData, handleChange, first_name };
};

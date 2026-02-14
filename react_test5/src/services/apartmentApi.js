import axios from 'axios';
import api from '../services/axiosInstance';

export const getAllApartment = async () => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8080/apartments_api/apartment/`
    );
    return response.data;
  } catch (error) {
    console.error('Errro fetching apartment', error);
  }
};

export const getUserApartment = async () => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await api.get(
      //'http://127.0.0.1:8080/apartments_api/apartment/user',
      '/apartments_api/apartment/user'
      // {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // }
    );
    return response.data || [];
  } catch (error) {
    console.error('Errro fetching user apartment', error);
  }
};

export const apartmentUpdate = async (apartmentId, updateData) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.patch(
      `http://127.0.0.1:8080/apartments_api/apartment_update/${apartmentId}/`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Errro fetching user apartment', error);
  }
};

export const apartmentDelete = async (apartmentId) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.delete(
      `http://127.0.0.1:8080/apartments_api/apartment_delete/${apartmentId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Errro fetching user apartment', error);
  }
};

export const apartmentCreate = async (formData) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.post(
      'http://127.0.0.1:8080/apartments_api/apartment/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Errro fetching user apartment', error);
    throw error;
  }
};

export const getApartmentDetail = async (apartmentId) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8080/apartments_api/apartment_detail/${apartmentId}/`
    );
    return response.data;
  } catch (error) {
    console.error('Errro fetching user apartment', error);
  }
};

export const getLocations = async () => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8080/apartments_api/locations/`
    );
    return response;
  } catch (error) {
    console.error('Errro fetching apartment', error);
  }
};

export const getApartmentReview = async (apartmentId) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8080/apartments_api/apartments/${apartmentId}/reviews/`
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};

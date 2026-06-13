import api from '../../../shared/lib/axiosInstance';
import { publickApi } from '../../../shared/lib/axiosInstance';

export const getAllApartment = async () => {
  try {
    const response = await publickApi.get(`/apartments_api/apartment/`);
    return response.data;
  } catch (error) {
    console.error('Errro fetching apartment', error);
  }
};

export const getUserApartment = async () => {
  try {
    const response = await api.get('/apartments_api/apartment/user');
    return response.data || [];
  } catch (error) {
    console.error('Errro fetching user apartment', error);
  }
};

export const apartmentUpdate = async (apartmentId, updateData) => {
  try {
    const response = await api.patch(
      `/apartments_api/apartment_update/${apartmentId}/`,
      updateData
    );
    return response;
  } catch (error) {
    console.error('Errro fetching user apartment', error);
  }
};

export const apartmentDelete = async (apartmentId) => {
  try {
    const response = await api.delete(
      `/apartments_api/apartment_delete/${apartmentId}/`
    );
    return response;
  } catch (error) {
    console.error('Errro fetching user apartment', error);
  }
};

export const apartmentCreate = async (formData) => {
  try {
    const response = await api.post(`/apartments_api/apartment/`, formData);
    return response;
  } catch (error) {
    console.error('Errro fetching user apartment', error);
    throw error;
  }
};

export const getApartmentDetail = async (apartmentId) => {
  try {
    const response = await publickApi.get(
      `/apartments_api/apartment_detail/${apartmentId}/`
    );
    return response.data;
  } catch (error) {
    console.error('Errro fetching user apartment', error);
  }
};

export const getLocations = async () => {
  try {
    const response = await publickApi.get(`/apartments_api/locations/`);
    return response;
  } catch (error) {
    console.error('Errro fetching apartment', error);
  }
};

export const getApartmentReview = async (apartmentId) => {
  try {
    const response = await publickApi.get(
      `/apartments_api/apartments/${apartmentId}/reviews/`
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};

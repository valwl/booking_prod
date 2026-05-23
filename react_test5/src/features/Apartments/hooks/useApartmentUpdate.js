import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  getApartmentDetail,
  apartmentUpdate,
  apartmentDelete,
} from '../api/apartmentApi.js';

export const useApartmentUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const initialForm = {
    title: '',
    description: '',
    base_price: '',
    weekend_price: '',
    images: [],

  };
  const [formData, setFormData] = useState(initialForm);
  const [previewImages, setPreviewImages] = useState([]);
  // Превью всех изображений
  const [newImages, setNewImages] = useState([]);
  const [deleteImages, setDeleteImages] = useState([]);
  // Удалённые изображения
  useEffect(() => {
    const fetchApartmentData = async () => {
      try {
        const response = await getApartmentDetail(id);
        setFormData({
          title: response.title,
          description: response.description,
          base_price: response.base_price,
          weekend_price: response.weekend_price,
          images: response.images,
        });
        setPreviewImages(response.images.map((image) => image.img));
      } catch (error) {
        console.error('Ошибка при загрузке данных квартиры:', error);
      }
    };
    fetchApartmentData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewImages.length > 24) {
      alert('Максимальное количество фотографий — 24');
      return;
    }
    setNewImages((prev) => [...prev, ...files]);
    console.log(newImages);
    setPreviewImages((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleRemoveImage = (index) => {
    const deleteImage = formData.images[index];
    console.log(deleteImage);

    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, images: updatedImages });

    setDeleteImages((prevDeletImages) => {
      const updateDeleteImages = [...prevDeletImages, deleteImage];
      console.log(updateDeleteImages);
      return updateDeleteImages;
    });

    const updatedPreviewImages = [...previewImages];
    updatedPreviewImages.splice(index, 1);
    setPreviewImages(updatedPreviewImages);
  };

  console.log(deleteImages);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('base_price', formData.base_price);
      formDataToSend.append('weekend_price', formData.weekend_price);
      newImages.forEach((file, index) => {
        formDataToSend.append(`images`, file);
      });
      deleteImages.forEach((image) => {
        formDataToSend.append('removed_images', image.id);
      });
      const response = await apartmentUpdate(id, formDataToSend);
      if (response.status === 200) {
        navigate(`/apartments_detail/${id}`);
      }
    } catch (error) {
      console.error('Ошибка при обновлении квартиры:', error);
    }
  };
  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту квартиру?')) {
      try {
        const response = await apartmentDelete(id);
        console.log(response);
        if (response.status === 200) {
          navigate('/home');
        }
      } catch (error) {
        console.error('Ошибка при удалении квартиры:', error);
      }
    }
  };

  return {
    handleSubmit,
    formData,
    handleChange,
    previewImages,
    handleDelete,
    handleRemoveImage,
    handleFileChange,
  };
};

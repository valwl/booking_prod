import React from 'react';
import Select from 'react-select';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import { toast, ToastContainer } from 'react-toastify';
import { apartmentCreate, getLocations } from '../../../services/apartmentApi';
import styles from './ApartmentCreationForm.module.scss';

const ApartmentCreationForm = () => {
  const navigate = useNavigate();
  const initialData = {
    title: '',
    description: '',
    base_price: '',
    weekend_price: '',
    location: '',
    images: [],
  };

  const [formData, setFormData] = useState(initialData);
  const [error, setErrors] = useState({});
  const [locations, setLocations] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await getLocations();
        setLocations(
          response.data.map((location) => ({
            value: location.id,
            label: location.name,
          }))
        );
      } catch (error) {
        console.error('Failed to fetch locations', error);
      }
    };
    fetchLocations();
  }, []);

  const handleFileChange = (e) => {
    console.log(e.target.name, e.target.value);
    console.log('Files selected', e.target.files);
    const files = Array.from(e.target.files);
    if (files.length > 24) {
      alert('24 photos is the maximum limit');
      return;
    }
    const updateImages = formData.images.concat(files);
    setFormData({ ...formData, images: updateImages });
    setPreviewImages(updateImages.map((file) => URL.createObjectURL(file)));
  };

  const handleLocationChange = (selectedOptions) => {
    setFormData({ ...formData, location: selectedOptions.value });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('base_price', formData.base_price);
    formDataToSend.append('weekend_price', formData.weekend_price);
    formDataToSend.append('location', formData.location);
    formData.images.forEach((file, index) => {
      formDataToSend.append(`images[${index}]`, file);
    });

    try {
      const response = await apartmentCreate(formDataToSend);
      console.log('Apartment successfully added', response);
      setFormData(initialData);
      navigate('/');

      //toast.success('Apartment successfully created!');

      if (response.status === 201) {
        navigate('/');
        console.alert('appartment create successufule');
      }

      // setTimeout(() => {
      //   navigate('/');
      // }, 2000);
    } catch (error) {
      console.error('Error with apartment form', error);
      setErrors({ message: error.response?.data?.message || 'Form failed' });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <form onSubmit={handleSubmit} className={styles.formApartment}>
        <h1>Create new apartment</h1>
        <div className={styles.form_group}>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={styles.inputElem}
            required
          />
        </div>
        <div className={styles.form_group}>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.reviewEria}
            required
          />
        </div>
        <div className={styles.form_group}>
          <label>Base Price:</label>
          <input
            type="text"
            name="base_price"
            value={formData.base_price}
            onChange={handleChange}
            className={styles.inputElem}
            required
          />
        </div>
        <div className={styles.form_group}>
          <label>Weekend Price:</label>
          <input
            type="text"
            name="weekend_price"
            value={formData.weekend_price}
            onChange={handleChange}
            className={styles.inputElem}
            required
          />
        </div>

        <div className={styles.form_group}>
          <label>Location:</label>
          <Select
            options={locations}
            onChange={handleLocationChange}
            placeholder="Select location"
          />
        </div>
        <div className={styles.form_group}>
          <input
            type="file"
            name="images"
            onClick={() => console.log('input clicked')}
            onChange={handleFileChange}
            className={styles.fileInput}
            multiple
            required
          />
        </div>
        {error.message && <p className={styles.error}>{error.message}</p>}
        <button className={styles.button} type="submit">
          Create Apartment
        </button>
      </form>
    </div>
  );
};

export default ApartmentCreationForm;

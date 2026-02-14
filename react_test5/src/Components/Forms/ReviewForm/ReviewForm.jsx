import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import styles from './ReviewForm.module.scss';

const ReviewForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);
  const initialData = {
    apartment: id,
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
    const token = localStorage.getItem('accessToken');
    console.log(formData);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8080/apartments_api/create_review/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); //'this amaizing apartment in tahoe lake'
      console.log('review success added', response.data);
      if (response.status === 201) {
        navigate(`/apartments_detail/${id}`);
        console.log('review creation success');
      }
    } catch (error) {
      if (error.response) {
        console.log(error);
        alert(error.response.data.detail);

        navigate('/home');
      }
      //console.error('error with add review', error.responce.data.message);
      console.error('error with add review', error);
    }
  };

  console.log(formData.author);
  return (
    <div className={styles.reviewCreatePage}>
      <form onSubmit={handleSubmit} className={styles.reviewForm}>
        <div>
          <label> username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            placeholder={first_name}
            readOnly
          />
        </div>

        <div>
          <label> score</label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>

        <div>
          <label> review</label>
          <textarea
            name="text"
            value={formData.text}
            onChange={handleChange}
            className={styles.reviewEria}
            required
          />
        </div>

        <button type="submit" className={styles.reviewButton}>
          leave review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;

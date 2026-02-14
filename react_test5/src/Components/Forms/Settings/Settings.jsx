import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { Link, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

import { updateUserSuccess } from '../../../redux/actions/authActions';

import styles from './Settings.module.scss';

const Settings = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const initialForm = {
    first_name: '',

    last_name: '',

    email: '',

    phone_number: '',
  };

  const [formData, setFormData] = useState(initialForm);

  const [loading, setLoading] = useState(true);

  /* ----------------------------

     1. Загружаем пользователя с сервера

  ----------------------------- */

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        const response = await axios.get(
          'http://127.0.0.1:8080/user_api/user/me/',

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        dispatch(updateUserSuccess(response.data));
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  /* ----------------------------

     2. Синхронизируем redux → form

  ----------------------------- */

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setFormData({
        first_name: user.first_name || '',

        last_name: user.last_name || '',

        email: user.email || '',

        phone_number: user.phone_number || '',
      });
    }
  }, [user]);

  /* ----------------------------

     Handlers

  ----------------------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('accessToken');

    // не мутируем state

    const payload = { ...formData };

    if (!payload.phone_number) {
      delete payload.phone_number;
    }

    try {
      const response = await axios.patch(
        'http://127.0.0.1:8080/user_api/user/update/',

        payload,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        dispatch(updateUserSuccess(response.data));

        navigate('/home');
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  /* ----------------------------

     Render

  ----------------------------- */

  if (loading) {
    return <div className={styles.settingsContainer}>Loading user data…</div>;
  }

  return (
    <div className={styles.settingsContainer}>
      <form onSubmit={handleSubmit} className={styles.settingsForm}>
        <h2>User Change Form</h2>

        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />

        <input
          type="text"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="Phone number"
        />

        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="First name"
        />

        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Last name"
        />

        <Link to="/passwordChange" className={styles.settingsLink}>
          Change password
        </Link>

        <button type="submit" className={styles.settingsSubmitButton}>
          Save changes
        </button>
      </form>
    </div>
  );
};

export default Settings;

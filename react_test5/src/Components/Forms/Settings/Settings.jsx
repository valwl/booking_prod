import React from 'react';
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    const token = localStorage.getItem('accessToken');
    e.preventDefault();

    if (formData.phone_number === '') {
      delete formData.phone_number;
    }
    try {
      console.log(formData);
      const response = await axios.put(
        'http://127.0.0.1:8080/user_api/user/update/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        dispatch(updateUserSuccess(formData))
        navigate('/home');
      }
      console.log(response);
    } catch (error) {
      console.error('error data:', error);
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <form onSubmit={handleSubmit} className={styles.settingsForm}>
        <h2>User Change Form</h2>
        <div>
          <input
            type="text"
            value={formData.email}
            placeholder={formData.email}
            onChange={handleChange}
            name="email"
          />
        </div>

        <div>
          <input
            type="text"
            value={formData.phone_number}
            placeholder={formData.phone_number}
            onChange={handleChange}
            name="phone_number"
          />
        </div>

        <div>
          <input
            type="text"
            placeholder={formData.first_name}
            value={formData.first_name}
            onChange={handleChange}
            name="first_name"
          />
        </div>

        <div>
          <input
            type="text"
            value={formData.last_name}
            placeholder={formData.last_name}
            onChange={handleChange}
            name="last_name"
          />
        </div>

        <div>
          <Link to="/passwordChange" className={styles.settingsLink}>
            password Change
          </Link>
        </div>

        <div>
          <button type="submit" className={styles.settingsSubmitButton}>
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;

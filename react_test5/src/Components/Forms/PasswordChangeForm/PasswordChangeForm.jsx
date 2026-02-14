import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './PasswordChangeForm.module.scss';

const PasswordChangeForm = () => {
  const navigate = useNavigate();

  const initialData = {
    new_password: '',
    new_password_confirm: '',
  };
  const [formData, setFormData] = useState(initialData);

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (formData.new_password === formData.new_password_confirm) {
      try {
        const response = await axios.post(
          `http://127.0.0.1:8080/user_api/user/password/change/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 204) {
          navigate('/home');
          // alert('user password update success');
        }
        console.log(response);
      } catch (error) {
        console.error('error data:', error);
      } 
    } else {
      alert('password didnt match please try again');
    }
  };

  return (
    <div className={styles.pageStyle}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <h2>Password change form</h2>
        <div>
          <input
            type="text"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            className={styles.inputField}
            placeholder="password"
          />
        </div>

        <div>
          <input
            type="text"
            name="new_password_confirm"
            value={formData.new_password_confirm}
            onChange={handleChange}
            className={styles.inputField}
            placeholder="confirm password "
          />
        </div>
        <button type="sybmit" className={styles.submitButton}>
          submit
        </button>
      </form>
    </div>
  );
};

export default PasswordChangeForm;

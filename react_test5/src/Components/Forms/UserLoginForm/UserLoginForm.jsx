import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import styles from './UserLoginForm.module.scss';
import { login } from '../../../redux/actions/authActions';

const UserLoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formData: bookingData } = useSelector((state) => state.booking);

  const initialData = {
    login: '',
    password: '',
  };

  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(login(formData.login, formData.password));
      console.log('response data', response);
      if (response && response.status === 200) {
        // new
        if (bookingData && bookingData.checkInDay && bookingData.checkOutDay) {
          //new
          navigate('/bookingConfirm', {
            state: { formData: bookingData },
          }); //new
        } else {
          navigate('/home');
        }

        console.log('welcome inside of the system');
      }
    } catch (error) {
      console.error('information about error', error);
    }

    setFormData(initialData);
  };

  return (
    <div className={styles.page_style}>
      <div className={styles.login_form}>
        <h1>Sign up</h1>
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.txt_field}>
            <input
              type="text"
              name="login"
              value={formData.login}
              onChange={handleChange}
              required
            />
            <span></span>
            <label>Login</label>
          </div>

          <div className={styles.txt_field}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span></span>
            <label>Password</label>
          </div>

          {/* <input name="submit" type="submit" value="Login" /> */}

          <input
            name="submit"
            type="submit"
            value="Login"
            onChange={handleChange}
          ></input>

          <div className={styles.signup_link}>
            don't have an account?{' '}
            <Link to="/register" className={styles.Link}>
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLoginForm;

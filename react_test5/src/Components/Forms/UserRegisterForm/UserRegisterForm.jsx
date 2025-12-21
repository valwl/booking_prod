import { useEffect, useState } from 'react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { userRegister } from '../../../redux/actions/authActions';
import style from './UserRegisterForm.module.scss';

const UserRegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentState = useSelector((state) => state.auth);
  const initialFormData = {
    email: '',
    phone_number: ' ',
    password: '',
    first_name: '',
    last_name: '',
  };
  const [userData, setUserData] = useState(initialFormData);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const serializedUserData = {
      ...userData,
      phone_number: userData.phone_number.trim(),
    };
    try {
      //const response = await dispatch(userRegister(serializedUserData));
      const response = await dispatch(userRegister(userData));
      if (response && response.status === 201) {
        navigate('/home');
      } else {
        alert('sory some error with request data please try again');
      }
    } catch (error) {
      console.error('Errorin handleSubmit:', error);
      alert('An unexpected error with request data please try again');
    }
    setUserData(initialFormData);
  };

  useEffect(() => {
    console.log('current state', currentState);
  }, [currentState]);

  return (
    <div className={style.page_style}>
      <div className={style.register_form}>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className={style.txt_field}>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
            />
            <span></span>
            <label>email:</label>
          </div>

          <div className={style.txt_field}>
            <input
              type="text"
              name="phone_number"
              value={userData.phone_number}
              onChange={handleChange}
            />
            <span></span>
            <label>phone_number:</label>
          </div>

          <div className={style.txt_field}>
            <input
              type="text"
              name="first_name"
              value={userData.first_name}
              onChange={handleChange}
              required
            />
            <span></span>
            <label>first_name:</label>
          </div>

          <div className={style.txt_field}>
            <input
              type="text"
              name="last_name"
              value={userData.last_name}
              onChange={handleChange}
              required
            />
            <span></span>
            <label>last_name:</label>
          </div>

          <div className={style.txt_field}>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
            />
            <span></span>
            <label>password:</label>
          </div>

          <input
            name="submit"
            type="Submit"
            value="Register"
            onChange={handleChange}
          ></input>

          <div className={style.signup_link}>
            Alredady have an account?
            <Link to="/login" className={style.Link}>
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegisterForm;

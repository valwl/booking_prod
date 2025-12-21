import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import styles from './Menu.module.scss';
import { resetBookingForm } from '../../redux/actions/bookingActions';
import { logoutUser } from '../../redux/actions/authActions';
import userIcon from '../../App';

const Menu = ({}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSubMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    dispatch(resetBookingForm());
    const response = dispatch(logoutUser());
    console.log('data:', response);
    handleClose();
    navigate('/home');
  };

  return (
    <nav className={styles.menu}>
      <ul className={styles.menu_list}>
        <li>
          <Link to="home" className={styles.linkMenuStyle}>
            Home
          </Link>
        </li>

        <li>
          <Link to="locations" className={styles.linkMenuStyle}>
            Locations
          </Link>
        </li>
        <li>
          <Link to="Apartments" className={styles.linkMenuStyle}>
            Apartments
          </Link>
        </li>
        <li>
          <Link to="/SaveBooking" className={styles.linkMenuStyle}>
            save booking
          </Link>
        </li>
        <li>
          <Link to="AboutUS" className={styles.linkMenuStyle}>
            About us
          </Link>
        </li>

        {isAuthenticated ? (
          <li className={styles.user_menu} onMouseEnter={() => setIsOpen(true)}>
            <span> user menu </span>
            {isOpen && (
              <ul className={styles.dropdown_menu}>
                <li>
                  <Link to="/settings" className={styles.linkMenuStyle}>
                    settings
                  </Link>
                </li>
                <li>
                  <Link to="/user_apartment" className={styles.linkMenuStyle}>
                    my apartment
                  </Link>
                </li>
                <li>
                  <Link to="/myBookings" className={styles.linkMenuStyle}>
                    my bookings
                  </Link>
                </li>
                <li onClick={handleLogout}>logout</li>
                <li onClick={handleClose} className={styles.close_menu}>
                  +
                </li>
              </ul>
            )}
          </li>
        ) : (
          <li>
            <Link to="/Login" className={styles.linkMenuStyle}>
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Menu;

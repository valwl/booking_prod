import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Menu.module.scss';

// import userIcon from '../../App';
import { useMenu } from './useMenu';

const Menu = () => {
  const { isAuthenticated, setIsOpen, isOpen, handleLogout, handleClose } =
    useMenu();

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

import React from 'react';
import BookingCard from '../../components/BookingCard/BookingCard';
import styles from './MyBookings.module.scss';
import { useMyBookingList } from '../../hooks/useMyBookingsList';

const MyBookings = () => {
  const { userName, filtereBookings, handleMoreDetails, handleFilterChange, filter } =
    useMyBookingList();

  return (
    <div className={styles.userBookingPage}>
      <div className={styles.header}>
        <h1>hello {userName} this is your bookings</h1>
        <div className={styles.selectContainer}>
          <select
            id="bookingFilter"
            value={filter}
            onChange={handleFilterChange}
          >
            <option value="All">All</option>
            <option value="pending">pending</option>
            <option value="paid">payd</option>
            <option value="complete">complete</option>
          </select>
        </div>
      </div>

      <div>
        <ul className={styles.bookingList}>
          {filtereBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onMoreDetails={handleMoreDetails}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyBookings;

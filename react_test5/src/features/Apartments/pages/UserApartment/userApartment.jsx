import React from 'react';
import { Link } from 'react-router-dom';
import styles from './UserApartment.module.scss';
import UserApartmentCard from '../../Components/Cards/UserApartmentCard/UserApartmentCard';
import { useUserApartment } from '../../hooks/useUserApartment';

const UserApartment = () => {
  const { userName, loading, apartments, handleMoreDetails } =
    useUserApartment();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.userApartmentContainer}>
      {apartments.length === 0 ? (
        <div className={styles.noApartment}>
          <p>you dont have apartment yet</p>
          <Link to="/create_apartment" className={styles.createLink}>
            Create new apartment
          </Link>
        </div>
      ) : (
        <div>
          <h1>hello {userName} this is your aparmtents</h1>
          <ul className={styles.apartmentList}>
            {apartments.map((apartment) => (
              <UserApartmentCard
                key={apartment.id}
                apartment={apartment}
                onMoreDetails={handleMoreDetails}
              />
            ))}
          </ul>
          <Link to="/create_apartment" className={styles.createLink}>
            Create new apartment
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserApartment;

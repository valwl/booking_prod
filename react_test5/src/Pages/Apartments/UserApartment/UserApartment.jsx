import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserApartment } from '../../../services/apartmentApi';
import { useSelector } from 'react-redux';
import styles from './UserApartment.module.scss';
import UserApartmentCard from '../../../Components/Card/UserApartmentCard/UserApartmentCard';

const UserApartment = () => {
  const navigate = useNavigate();
  const userName = useSelector((state) => state.auth.user.first_name);
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserApartments = async () => {
      try {
        const apartment = await getUserApartment();
        setApartments(apartment);
      } catch (error) {
        console.error('error fetching user apartment', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserApartments();
  }, []);

  const handleMoreDetails = (id) => {
    navigate(`/apartment_update/${id}`);
  };

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

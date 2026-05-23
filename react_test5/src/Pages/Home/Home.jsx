import React from 'react';

import BaseSlider from '../../shared/components/BaseSlider/BaseSlider';
import { Link } from 'react-router-dom';

import PopularApartmentList from '../../features/Apartments/Components/PopularApartmentList/PopularApartmentList';
import styles from './Home.module.scss';
import { useHome } from './useHome';

const HomePage = () => {
  const { images } = useHome();
  if (images.length === 0) return null;

  return (
    <div className={styles.homePage}>
      <section className={styles.popularDestinations}>
        <BaseSlider images={images} />
        <div className={styles.overlayContent}>
          <span>Уникальные</span>
          <span>Локации</span>
          <span>для</span>
          <span>Незабываемых</span>
          <span>Впечатлений</span>
          <Link to="/Locations" className={styles.btnPrimary}>
            Read more
          </Link>
        </div>
      </section>

      <section className={styles.popularApartments}>
        <div className={styles.popularApartmentText}>
          <h1>Найдите идеальные апартаменты для вашего следующего отдыха</h1>

          <Link to="/Apartments" className={styles.link}>
            Сотни вариантов по всему миру
          </Link>
        </div>

        <div className={styles.popularApartmentList}>
          <PopularApartmentList />
        </div>
      </section>

      <section className={styles.aboutUs}>
        <h2>О нас</h2>
        <p>
          Мы предлагаем лучшие варианты жилья по всему миру. Забронируйте
          апартаменты своей мечты и наслаждайтесь комфортом и уютом в любом
          уголке планеты.
        </p>
        <Link to="/AboutUS" className={styles.btnPrimary}>
          Узнать подробнее
        </Link>
      </section>
    </div>
  );
};

export default HomePage;

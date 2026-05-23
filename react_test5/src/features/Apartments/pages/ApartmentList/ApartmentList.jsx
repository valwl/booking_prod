import React from 'react';

import ApartmentCard from '../../Components/Cards/ApartmentCard/ApartmentCard';
import ApartmentFilter from '../../Components/ApartmentFilter/ApartmentFilter';
import styles from './ApartmentList.module.scss';
import { useApartmentList } from '../../hooks/useApartmentList';

const Apartments = () => {
  const {
    loading,
    apartments,
    handleFilterChange,
    filterParams,
    locations,
    handleMoreDetails,
    filteredApartments,
  } = useApartmentList();

  console.log(apartments);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.apartmentListContainer}>
      {apartments.length > 0 ? (
        <div>
          <div className={styles.searchFilterCounter}>
            <ApartmentFilter
              onFilterChange={handleFilterChange}
              locations={locations}
              filters={filterParams}
            />
          </div>

          <div className={styles.apartmentList}>
            {filteredApartments.length > 0 ? (
              filteredApartments.map((apartment) => (
                <ApartmentCard
                  key={apartment.id}
                  apartment={apartment}
                  onMoreDetails={handleMoreDetails}
                />
              ))
            ) : (
              <p className={styles.paragrafStyle}>
                По данным фильтрам нет результатов Попробуйте изменить поиск
              </p>
            )}
          </div>
        </div>
      ) : (
        <div> Loading</div>
      )}
    </div>
  );
};

export default Apartments;

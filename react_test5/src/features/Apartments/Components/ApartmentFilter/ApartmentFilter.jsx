import React, { useState, useEffect } from 'react';
import styles from './ApartmentFilter.module.scss';
const ApartmentFilter = ({ onFilterChange, locations, filters }) => {
  const [localfilters, setLocalFilters] = useState({
    searchTerm: filters.searchTerm || '',
    selectedLocation: filters.selectedLocation || '',
    priceMin: filters.priceMin || '',
    priceMax: filters.priceMax || '',
  });
  // Синхронизация локальных фильтров с внешними при изменении props
  useEffect(() => {
    setLocalFilters(filters);
    console.log(filters);
    console.log(localfilters);
  }, [filters.selectedLocation]);
  // Обновляем фильтры в родительском компоненте при изменении локальных
  useEffect(() => {
    onFilterChange(localfilters);
  }, [localfilters, onFilterChange]);
  // Обработчик изменений в полях фильтра
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };
  return (
    <div className={styles.apartmentFilter}>
      <div className={styles.filterGroup}>
        <input
          id="search"
          type="text"
          name="searchTerm"
          value={localfilters.searchTerm}
          onChange={handleInputChange}
          placeholder="Search apartments"
        />
      </div>
      <div className={styles.filterGroup}>
        <select
          id="location"
          name="selectedLocation"
          value={localfilters.selectedLocation}
          onChange={handleInputChange}
        >

          <option value="">All locations</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.filterGroup}>
        <input
          id="priceMin"
          type="number"
          name="priceMin"
          value={localfilters.priceMin}
          onChange={handleInputChange}
          placeholder="Min price"
        />
      </div>
      <div className={styles.filterGroup}>
        <input
          id="priceMax"
          type="number"
          name="priceMax"
          value={localfilters.priceMax}
          onChange={handleInputChange}
          placeholder="Max price"
        />
      </div>
    </div>
  );
};
export default ApartmentFilter;

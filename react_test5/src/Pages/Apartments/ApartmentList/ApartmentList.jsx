import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllApartment, getLocations } from '../../../services/apartmentApi';
import ApartmentCard from '../../../Components/Card/ApartmentCard/ApartmentCard';
import ApartmentFilter from '../../../Components/Filters/ApartmentFilter/ApartmentFilter';
import styles from './ApartmentList.module.scss';

const Apartments = () => {
  const [apartments, setApartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDataLoadet, setIsDataLoadet] = useState(false);

  const [filterParams, setFilterParams] = useState({
    searchTerm: '',
    selectedLocation: '',
    priceMin: '',
    priceMax: '',
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchApartments = async () => {
      const data = await getAllApartment();
      console.log('apartment data', data);

      const processedData = data.map((apartment) => ({
        ...apartment,
        id: apartment.id.toString(),
        base_price: Number(apartment.base_price),
      }));

      const response = await getLocations();
      setLocations(response.data);

      setApartments(processedData);

      if (location.state?.locationId) {
        setFilterParams((prevParams) => ({
          ...prevParams,
          selectedLocation: location.state.locationId.toString(),
        }));
      }

      setLoading(false);
      setIsDataLoadet(true);
    };

    fetchApartments();
  }, [location.id]);

  const handleMoreDetails = (id) => {
    navigate(`/apartments_detail/${id}`);
  };

  const handleFilterChange = useCallback((filters) => {
    setFilterParams(filters);
  }, []);

  const filteredApartments = useMemo(() => {
    if (!isDataLoadet) return apartments;
    return apartments
      .filter((apartment) =>
        apartment.title
          .toLowerCase()
          .includes(filterParams.searchTerm.toLowerCase())
      )
      .filter((apartment) => {
        if (filterParams.selectedLocation === '') return true;
        return apartment.location.toString() === filterParams.selectedLocation;
      })
      .filter((apartment) => {
        if (
          filterParams.priceMin &&
          apartment.base_price < filterParams.priceMin
        )
          return false;
        if (
          filterParams.priceMax &&
          apartment.base_price > filterParams.priceMax
        )
          return false;
        return true;
      });
  }, [apartments, filterParams]);

  console.log(apartments);
  console.log(filterParams.selectedLocation);
  console.log(filteredApartments);

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

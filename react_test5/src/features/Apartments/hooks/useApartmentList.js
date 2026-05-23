import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllApartment, getLocations } from '../api/apartmentApi';

export const useApartmentList = () => {
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

  return {
    loading,
    apartments,
    handleFilterChange,
    filterParams,
    locations,
    handleMoreDetails,
    filteredApartments,
  };
};

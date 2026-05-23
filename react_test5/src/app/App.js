import './styles/App.css';
import React from 'react';

import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Home from '../Pages/Home/Home.jsx';
import AboutUs from '../Pages/AboutUs/AboutUs';

import Locations from '../features/Locations/LocationsList/LocationsList';
import LocationsDetail from '../features/Locations/LocationsDetail/LocationsDetail';

import Apartments from '../features/Apartments/pages/ApartmentList/ApartmentList';
import ApartmentsDetail from '../features/Apartments/pages/ApartmentsDetail/ApartmentDetail';
import UserApartment from '../features/Apartments/pages/UserApartment/userApartment';
import ApartmentUpdate from '../features/Apartments/pages/ApartmentUpdate/ApartmentUpdate';
import ApartmentCreationForm from '../features/Apartments/pages/ApartmentCreationForm/ApartmentCreationForm';

import MyBookings from '../features/Booking/Pages/MyBookings/MyBookings';
import SaveBooking from '../Pages/SaveBooking/SaveBooking';
import ConfirmBooking from '../features/Booking/Pages/ConfirmBooking/confirmBooking';
import BookingDetail from '../features/Booking/Pages/BookingDetail/BookingDetail';
import ReviewForm from '../features/Reviews/ReviewForm/ReviewForm';

import Settings from '../features/User/pages/Settings/Settings';
import UserLoginForm from '../features/User/pages/UserLoginForm/userLoginForm';
import UserRegisterForm from '../features/User/pages/UserRegisterForm/UserRegisterForm';
import PasswordChangeForm from '../features/User/pages/PasswordChangeForm/PasswordChangeForm';

import Footer from '../shared/components/Footer/Footer';
import Menu from '../shared/components/Menu/Menu';

import { WebSocketProvider } from '../features/Booking/services/context/WebSocketContext';

import { TimerProvider } from '../features/Booking/services/context/TimerProvider';

function App() {
  return (
    <div className="App">
      <Menu />
      <ToastContainer />
      <WebSocketProvider>
        <TimerProvider>
          <Routes>
            <Route path="/" element={<Navigate replace to="/home" />} />
            <Route path="/home" exact Component={Home} />
            <Route path="/AboutUS" exact Component={AboutUs} />

            <Route path="/Locations" exact Component={Locations} />
            <Route
              path="/LocationDetail/:id"
              exact
              Component={LocationsDetail}
            />

            <Route path="/Apartments" exact Component={Apartments} />
            <Route
              path="/apartments_detail/:id"
              exact
              Component={ApartmentsDetail}
            />
            <Route path="/user_apartment" exact Component={UserApartment} />
            <Route
              path="/create_apartment"
              exact
              Component={ApartmentCreationForm}
            />
            <Route
              path="/apartment_update/:id"
              exact
              Component={ApartmentUpdate}
            />

            <Route path="/myBookings" exact Component={MyBookings} />
            <Route path="/SaveBooking" exact Component={SaveBooking} />
            <Route path="/bookingConfirm" exact Component={ConfirmBooking} />
            <Route path="/bookingDetail/:id" exact Component={BookingDetail} />
            <Route path="/review_create/:id" exact Component={ReviewForm} />

            <Route path="/Login" exact Component={UserLoginForm} />
            <Route path="/Register" exact Component={UserRegisterForm} />
            <Route path="/settings" exact Component={Settings} />
            <Route
              path="/passwordChange"
              exact
              Component={PasswordChangeForm}
            />
          </Routes>
        </TimerProvider>
      </WebSocketProvider>

      <Footer />
    </div>
  );
}

export default App;

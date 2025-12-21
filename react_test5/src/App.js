import './App.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { refreshAccessToken } from './redux/actions/authActions';
import { useSelector } from 'react-redux';
import store from './redux/store';

import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Home from './Pages/Home/Home.jsx';
import AboutUs from './Pages/AboutUs/AboutUs';

import Locations from './Pages/Locations/LocationsList/LocationsList';
import LocationsDetail from './Pages/Locations/LocationsDetail/LocationsDetail';

import Apartments from './Pages/Apartments/ApartmentList/ApartmentList';
import ApartmentsDetail from './Pages/Apartments/ApartmentsDetail/ApartmentsDetail';
import UserApartment from './Pages/Apartments/UserApartment/UserApartment';
import ApartmentUpdate from './Pages/Apartments/ApartmentUpdate/ApartmentUpdate';
import ApartmentCreationForm from './Components/Forms/ApartmentCreationForm/ApartmentCreationForm';

import MyBookings from './Pages/Bookings/MyBookings/MyBookings';
import SaveBooking from './Pages/SaveBooking/SaveBooking';
import ConfirmBooking from './Pages/Bookings/ConfirmBooking/ConfirmBooking';
import BookingDetail from './Pages/Bookings/BookingDetail/BookingDetail';
import ReviewForm from './Components/Forms/ReviewForm/ReviewForm';

import Settings from './Components/Forms/Settings/Settings.jsx';
import UserLoginForm from './Components/Forms/UserLoginForm/UserLoginForm';
import UserRegisterForm from './Components/Forms/UserRegisterForm/UserRegisterForm';
import PasswordChangeForm from './Components/Forms/PasswordChangeForm/PasswordChangeForm';

import Footer from './Components/Footer/Footer';
import Menu from './Components/Menu/Menu';

import { WebSocketProvider } from './services/WebSocketContext';

import { TimerProvider } from './services/TimerProvider/TimerProvider';

const TOKEN_REFRESH_INTERVAL = 1.5 * 60 * 1000; // 4.5 минуты

function App() {
  //const userId = useSelector((state) => state.auth.user.id); // Получаем userId из Redux
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (userId) {
  //     const intervalId = setInterval(() => {
  //       store.dispatch(refreshAccessToken(userId));
  //       console.log('request for refresh token');
  //     }, TOKEN_REFRESH_INTERVAL);

  //     // Очищаем интервал при размонтировании компонента
  //     return () => clearInterval(intervalId);
  //   }
  // }, [userId]);

  useEffect(() => {
    // Перехватываем URL от ngrok и перенаправляем на внутренние маршруты
    const currentUrl = window.location.href;
    if (currentUrl.includes('ngrok')) {
      const url = new URL(currentUrl);
      if (url.pathname.startsWith('/bookingDetail')) {
        const bookingId = url.pathname.split('/')[2]; // Извлекаем ID
        navigate(`/bookingDetail/${bookingId}`);
      } else if (url.pathname === '/home') {
        navigate('/home');
      }
    }
  }, [navigate]);

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

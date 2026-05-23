import React, { createContext, useEffect, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { setSleep } from '../../redux/timer/timerActions';
import { useNavigate } from 'react-router';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const [messageRecived, setMessageRecived] = useState(false);
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const initializeWebSicket = (bookingId) => {
    const webSocket = new WebSocket(
      `ws://localhost:8080/ws/booking_status/${bookingId}/?token=${token}`
    );
    console.log(bookingId);

    webSocket.onopen = () => {
      console.log('Websocket conection successufully');
    };

    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Message from server:', data);
      const eventType = data.type;

      switch (eventType) {
        case 'payment_success':
          console.log('Payment successful');
          dispatch(setSleep());
          setMessageRecived(true);
          webSocket.close();
          break;
        case 'booking_cancel':
          console.log('booking cancelled');
          dispatch(setSleep());
          setMessageRecived(true);
          webSocket.close();
          navigate('/home');
          break;

        default:
          console.warn('Uncnown event type:', eventType);
      }
    };

    webSocket.onerror = (error) => {
      console.error('Websocket errro: ', error);
    };

    setSocket(webSocket);
  };

  const closeWebSocket = () => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        initializeWebSicket,
        closeWebSocket,
        socket,
        messageRecived,
        setMessageRecived,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
export const useWebSocket = () => useContext(WebSocketContext);

import React, { createContext, useEffect, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { setSleep } from '../redux/actions/timerActions';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const [messageRecived, setMessageRecived] = useState(false);

  const initializeWebSicket = (bookingId) => {
    const webSocket = new WebSocket(
      `ws://localhost:8080/ws/booking_status/${bookingId}/`
    );

    webSocket.onopen = () => {
      console.log('Websocket conection successufully');
    };


    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Message from server:', data);
      if (data.status === 'payment_success') {
        console.log('Payment successful');
        dispatch(setSleep());
        setMessageRecived(true);
        webSocket.close();
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

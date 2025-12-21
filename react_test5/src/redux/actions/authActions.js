import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux';

// const dispatch = useDispatch();
//const { id } = useSelector((state) => state.auth.user);

export const login = (login, password) => async (dispatch) => {
  try {
    const response = await axios.post('http://127.0.0.1:8080/user_api/login/', {
      login,
      password,
    });
    console.log('Response:', response);
    dispatch({ type: 'USER_LOGIN_SUCCESS', payload: response.data });
    return response;
  } catch (error) {
    dispatch({ type: 'AUTH_ERROR', payload: { error: error.message } });
  }
};

export const userRegister = (userData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8080/user_api/register/',
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Response:', response); // Логируем полный ответ

      if (response.status === 201) {
        dispatch({ type: 'USER_REGISTER_SUCCESS', payload: response.data });
        return response;
      } else {
        console.log('Registration failed with status:', response.status);
        return { status: response.status };
      }
    } catch (error) {
      console.error('Error occurred:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('Request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      console.error('Error config:', error.config);
      return null;
    }
  };
};

export const logoutUser = (dispatch) => {
  return (dispatch) => {
    localStorage.removeItem('accessToken');
    dispatch({ type: 'USER_LOGOUT' });
  };
};

export const refreshAccessToken = (id) => async (dispatch) => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) throw new Error('Access token not found');

    const response = await axios.post(
      'http://127.0.0.1:8080/user_api/token/refresh/',
      { access: accessToken, user_id: id }
    );

    const { access } = response.data;
    console.log(response.data);
    dispatch({ type: 'TOKEN_REFRESH_SUCCESS', payload: access });
    localStorage.setItem('accessToken', access);
    return access;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    dispatch(logoutUser());
  }
};

export const updateUserSuccess = (updateUser) => {
  return {
    type: 'USER_UPDATE_SUCCESS',
    payload: updateUser,
  };
};

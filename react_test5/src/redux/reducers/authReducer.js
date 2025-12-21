const initialState = {
  isAuthenticated: false,
  token: '',
  user: {
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    id: '',
  },
  error: '',
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_REGISTER_SUCCESS':
    case 'USER_LOGIN_SUCCESS':
      localStorage.setItem('accessToken', action.payload.access);
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.access,
        user: {
          email: action.payload.email,
          first_name: action.payload.first_name,
          last_name: action.payload.last_name,
          phone_number: action.payload.phone_number,
          id: action.payload.id,
        },
        error: null,
      };

    case 'TOKEN_REFRESH_SUCCESS':
      localStorage.setItem('accessToken', action.payload.access);
      return {
        ...state,
        token: action.payload.access,
      };

    case 'USER_LOGOUT':
      localStorage.removeItem('accessToken');
      return {
        ...state,
        isAuthenticated: false,
        token: '',
        user: initialState.user,
        error: null,
      };

    case 'USER_UPDATE_SUCCESS':
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };

    case 'AUTH_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default authReducer;


import {
  START_TIMER,
  UPDATE_TIME_LEFT,
  SET_EXPIRE,
  SET_SLEEP,
} from '../actions/timerActions';

const initialState = {
  timeLeft: 0,

  status: 'SLEEP',

  bookingId: null,

  expiresAt: null,
};

const timerReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_TIMER:
      return {
        ...state,

        status: 'RUNNING',

        expiresAt: action.payload.expiresAt,

        bookingId: action.payload.bookingId,
      };

    case UPDATE_TIME_LEFT:
      return {
        ...state,

        timeLeft: action.payload,
      };

    case SET_EXPIRE:
      return {
        ...state,

        status: 'EXPIRE',
      };

    case SET_SLEEP:
      return initialState;

    default:
      return state;
  }
};

export default timerReducer;

import { START_TIMER, SLEEP, TIMER_TICK } from '../actions/timerActions';

const initialState = {
  timeLeft: 0,
  status: 'SLEEP',
  bookingId: null,
};

const timerReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_TIMER:
      return {
        ...state,
        timeLeft: action.payload.timeLeft,
        bookingId: action.payload.bookingId,
        status: 'RUNNING',
      };
    case SLEEP:
      return {
        ...state,
        status: 'SLEEP',
        bookingId: null,
        timeLeft: 0,
      };
    case TIMER_TICK:
      if (state.status === 'RUNNING' && state.timeLeft > 0) {
        return {
          ...state,
          timeLeft: state.timeLeft - 1,
          status: state.timeLeft - 1 === 0 ? 'EXPIRE' : 'RUNNING',
        };
      }
      return state;
    default:
      return state;
  }
};

export default timerReducer;
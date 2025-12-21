import { combineReducers } from 'redux';
import authReducer from './authReducer';
import bookingReducer from './bookingReducer';
import timerReducer from './timerReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  booking: bookingReducer,
  timer: timerReducer,
});

export default rootReducer;

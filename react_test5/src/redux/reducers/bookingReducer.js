import {
  UPDATE_BOOKING_FORM,
  RESET_BOOKING_FORM,
  SAVE_BOOKING_DATA,
} from '../actions/bookingActions';

const initialState = {
  formData: {
    checkInDay: null,
    checkOutDay: null,
    totalPrice: 0,
    guests: { adults: 1, children: 0, pets: 0 },
  },
};

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_BOOKING_FORM:
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
      };
    case RESET_BOOKING_FORM:
      return {
        ...state,
        formData: initialState.formData,
      };

    case SAVE_BOOKING_DATA:
      return {
        ...state,
        formData: action.payload,
      };
    default:
      return state;
  }
};

export default bookingReducer;

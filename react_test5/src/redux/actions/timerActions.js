export const START_TIMER = 'START_TIMER';

export const UPDATE_TIME_LEFT = 'UPDATE_TIME_LEFT';

export const SET_EXPIRE = 'SET_EXPIRE';

export const SET_SLEEP = 'SET_SLEEP';

export const runnigTimer = ({ expiresAt, bookingId }) => ({
  type: START_TIMER,

  payload: { expiresAt, bookingId },
});

export const updateTimeLeft = (timeLeft) => ({
  type: UPDATE_TIME_LEFT,

  payload: timeLeft,
});

export const setExpire = () => ({
  type: SET_EXPIRE,
});

export const setSleep = () => ({
  type: SET_SLEEP,
});

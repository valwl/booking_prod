export const TIMER_TICK = 'TIMER_TICK';
export const SLEEP = 'SLEEP';
export const START_TIMER = 'START_TIMER';

export const timerTick = () => ({
  type: TIMER_TICK,
});

export const runnigTimer = (timeLeft) => ({
  type: START_TIMER,
  payload: timeLeft,
});

export const setSleep = () => ({
  type: SLEEP,
});

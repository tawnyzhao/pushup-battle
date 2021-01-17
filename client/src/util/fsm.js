// fsm.js: Finite State Machine for counting pushups

export const STATES = Object.freeze({ DOWN: 1, UP: 2, NONE: 4 });

export const INITIAL_COUNTER = { count: 0, state: STATES.NONE };

export function step(currentState, nextState) {
  switch (nextState) {
    case STATES.DOWN:
      return { count: currentState.count, state: nextState };
      break;
    case STATES.UP:
      if (currentState.state == STATES.DOWN) {
        return { count: currentState.count + 1, state: nextState };
      }
      return { count: currentState.count, state: nextState };
      break;
    case STATES.NONE:
      return { ...currentState };
      break;
  }
}

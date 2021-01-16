// fsm.js: Finite State Machine for counting pushups

export const STATES = Object.freeze({ DOWN: 1, UP: 2, NONE: 4 });

export class Counter {
  constructor() {
    this.count = 0;
    this.state = STATES.NONE;
  }

  step(nextState) {
    switch (nextState) {
      case STATES.DOWN:
        this.state = nextState;
        break;
      case STATES.UP:
        if (this.state == STATES.DOWN) {
          this.count++;
        }
        this.state = nextState;
        break;
      case STATES.NONE:
        break;
    }
  }
}

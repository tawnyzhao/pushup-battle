export const STATES = Object.freeze({DOWN: 1, UP: 2, NONE: 4})

class FiniteStateMachine {
    constructor() {
        this.count = 0;
        this.state = STATES.NONE;
    }

    step(nextState) {
            
    } 
}
class Circuit {
    constructor(elements, directions) {
        this.elements = elements;
        this.directions = directions;
        this.current = 0;
        this.current_idt = 0;
        this.current_ddt = 0;
        this.elapsed_time = 0;
        this.data = new CircuitData();
    }
}

class CircuitData {
    constructor() {
        this.times = [0];
        this.currents = [0];
    }
}

export { Circuit, CircuitData };
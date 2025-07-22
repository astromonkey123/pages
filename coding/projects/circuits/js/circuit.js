export class Circuit {
    constructor(elements) {
        this.elements = elements;
        this.I = 0;
        this.integral_Idt = 0;
        this.dIdt = 0;
        this.elapsed_time = 0;
    }
}

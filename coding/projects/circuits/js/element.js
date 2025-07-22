import { objects, connections } from './canvas.js';
import { Connection } from './connection.js';

export class Element {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.rotation = 0;
        if (this.type == 'wire') this.rotation = 0;
        this.width = 100;
        this.connection1 = new Connection(x - (Math.cos(this.rotation) * this.width/2), y - (Math.sin(this.rotation) * this.width/2), this)
        this.connection2 = new Connection(x + (Math.cos(this.rotation) * this.width/2), y + (Math.sin(this.rotation) * this.width/2), this)
        this.connection1.sibling = this.connection2;
        this.connection2.sibling = this.connection1;
        objects.push(this);
    }

    contains(x, y) {
        return Math.hypot(x - this.x, y - this.y) < 20;
    }

    move(x, y) {
        this.x = x;
        this.y = y;
        this.connection1.x = this.x - (Math.cos(this.rotation) * this.width/2);
        this.connection1.y = this.y - (Math.sin(this.rotation) * this.width/2);
        this.connection2.x = this.x + (Math.cos(this.rotation) * this.width/2);
        this.connection2.y = this.y + (Math.sin(this.rotation) * this.width/2);
    }

    rotate(rotation) {
        if (this.type == 'wire') return;
        this.rotation = rotation;
        this.connection1.x = this.x - (Math.cos(this.rotation) * this.width/2);
        this.connection1.y = this.y - (Math.sin(this.rotation) * this.width/2);
        this.connection2.x = this.x + (Math.cos(this.rotation) * this.width/2);
        this.connection2.y = this.y + (Math.sin(this.rotation) * this.width/2);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.translate(-this.width/2, 0);
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.font = "12px serif";
        if (this.type == 'wire') {
            ctx.beginPath();
            ctx.moveTo(this.connection1.x - this.x + this.width/2, this.connection1.y - this.y);
            ctx.lineTo(this.connection2.x - this.x + this.width/2, this.connection2.y - this.y);
            ctx.stroke();
        } else if (this.type == 'battery') {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0.5 * this.width - 5, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0.5 * this.width + 5, 0);
            ctx.lineTo(this.width, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0.5 * this.width - 5, -20);
            ctx.lineTo(0.5 * this.width - 5, 20);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0.5 * this.width + 5, -10);
            ctx.lineTo(0.5 * this.width + 5, 10);
            ctx.stroke();
            ctx.fillText(this.emf.toFixed(2) + "V", this.width/2, 20);
        } else if (this.type == 'resistor') {
            const spacing = this.width/11;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(1.5 * spacing, 0);
            for (let i = 2; i <= 9; i++) {
                if (i % 2 == 0) {
                    ctx.lineTo(i * spacing, 10);
                } else {
                    ctx.lineTo(i * spacing, -10);
                }
            }
            ctx.lineTo(9.5 * spacing, 0);
            ctx.lineTo(11 * spacing, 0);
            ctx.stroke();
            ctx.fillText(this.delta_V.toFixed(2) + "V", this.width/2, 20);
            ctx.fillText(this.resistance.toFixed(2) + "Ω", this.width/2, 32);
        } else if (this.type == 'capacitor') {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0.5 * this.width - 5, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0.5 * this.width + 5, 0);
            ctx.lineTo(this.width, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0.5 * this.width - 5, -10);
            ctx.lineTo(0.5 * this.width - 5, 10);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0.5 * this.width + 5, -10);
            ctx.lineTo(0.5 * this.width + 5, 10);
            ctx.stroke();
            ctx.fillText(this.delta_V.toFixed(2) + "V", this.width/2, 20);
            if (this.capacitance < 0.1) {
                ctx.fillText((this.capacitance*1000).toFixed(2) + "µF", this.width/2, 32);
            } else {
                ctx.fillText(this.capacitance.toFixed(2) + "F", this.width/2, 32);
            }
            ctx.fillText(this.stored_charge.toFixed(2) + "C", this.width/2, 44);
        } else if (this.type == 'inductor') {
            const spacing = this.width/11;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(1.5 * spacing, 0);
            function x_parametric(t) { return -5 * (Math.cos(4 * t) - t * Math.sqrt(3) - 1) }
            function y_parametric(t) { return 10 * Math.sin(4 * t) }
            const x_jump = x_parametric(Math.PI/2);
            const remainder = (this.width - 3*spacing) % (x_jump);
            const iters = ((this.width - 3*spacing) - remainder) / x_jump;
            for (let t = 0; t <= iters * (Math.PI/2); t += Math.PI/32) {
                ctx.lineTo(1.5 * spacing + x_parametric(t), y_parametric(t));
            }
            ctx.lineTo(this.width, 0);
            ctx.stroke();
            ctx.fillText(this.delta_V.toFixed(2) + "V", this.width/2, 20);
            ctx.fillText(this.inductance.toFixed(2) + "H", this.width/2, 32);
        }
        ctx.restore();
    }
}

export class Battery extends Element {
  constructor(x, y, emf) {
    super(x, y, 'battery');
    this.emf = emf;
  }
}

export class Wire extends Element {
  constructor(x, y) {
    super(x, y, 'wire');
  }
}

export class Resistor extends Element {
  constructor(x, y, resistance) {
    super(x, y, 'resistor');
    this.resistance = resistance;
    this.delta_V = 0;
  }
}

export class Capacitor extends Element {
  constructor(x, y, capacitance, stored_charge) {
    super(x, y, 'capacitor');
    this.capacitance = capacitance;
    this.stored_charge = stored_charge;
    this.delta_V = 0;
  }
}

export class Inductor extends Element {
  constructor(x, y, inductance) {
    super(x, y, 'inductor');
    this.inductance = inductance;
    this.delta_V = 0;
  }
}
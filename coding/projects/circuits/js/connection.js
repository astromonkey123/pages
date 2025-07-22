import { objects, connections } from './canvas.js';
import { Element } from './element.js';

export class Connection {
    constructor(x, y, parent) {
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.sibling;
        this.links = [];
        this.radius = 7;
        connections.push(this);
    }

    contains(x, y) {
        return Math.hypot(this.x - x, this.y - y) < this.radius;
    }

    move(x, y) {
        if (this.parent.type == 'wire') {
            this.x = x;
            this.y = y;
        }
    }

    checkLinks() {
        this.links = [];
        for (let connection of connections) {
            if (connection == this) continue;
            if (Math.hypot(connection.x - this.x, connection.y - this.y) < connection.radius + this.radius) {
                this.links.push(connection);
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.links.length > 0) {
            ctx.fillStyle = 'blue';
            ctx.strokeStyle = 'blue';
        } else {
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'white';
        }
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2)
        ctx.fill();
        ctx.restore();
    }
}

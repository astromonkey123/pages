import { rainbow, highlight, light, dark } from '../utils/colors.js';

class Link {
    constructor(x, y, parent) {
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.sibling;
        this.radius = 6;
        this.links = [];
    }

    containsPoint(x, y) {
        return Math.hypot(this.x - x, this.y - y) < this.radius * 2;
    }

    setPosition(x, y) {
        if (this.parent.type == 'wire') {
            this.x = x;
            this.y = y;
        }
    }

    findLinks(simContainer) {
        this.links = [];
        for (let link of simContainer.links) {
            if (link == this) continue;
            if (Math.hypot(link.x - this.x, link.y - this.y) < link.radius + this.radius) {
                this.links.push(link);
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.links.length > 0) {
            ctx.fillStyle = light;
            ctx.strokeStyle = light;
        } else {
            ctx.fillStyle = highlight;
            ctx.strokeStyle = highlight;
        }
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2)
        ctx.fill();
        ctx.restore();
    }
}

export { Link };
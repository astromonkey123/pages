class Link {
    constructor(x, y, parent) {
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.sibling;
        this.radius = 7;
        this.links = [];
    }

    containsPoint(x, y) {
        return Math.hypot(this.x - x, this.y - y) < this.radius;
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

export { Link };
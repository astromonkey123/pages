class Container {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
    }
}

class SimContainer extends Container {
    constructor(id) {
        super(id);
        this.circuits = [];
        this.elements = [];
        this.links = [];
        this.editing = null;
        this.dragging = null;
        this.offsets = {x: 0, y: 0, rotation: 0};
        this.showData = true;
        this.selection = new Selection();
        this.isSimulating = true;
    }

    updateLinks() {
        this.links = [];
        for (const element of this.elements) {
            this.links.push(element.link1);
            this.links.push(element.link2);
        }
    }

    resetFields() {
        this.circuits = [];
        this.elements = [];
        this.links = [];
        this.editing = null;
        this.dragging = null;
        this.selection = new Selection();
    }
}

class GraphContainer extends Container {
    constructor(id) {
        super(id);
        this.height_scale = 0;
        this.height_increment = 2;
        this.num_times = 1000;
        this.spacing = this.canvas.width / this.num_times;
        this.display_current = "";
    }

    updateScale(limit) {
        if (limit === 0) {
            this.height_scale = 1;
        } else if (limit < this.height_increment) {
            this.height_scale = 1 / ( Math.pow(2, Math.ceil( Math.log2( limit ) ) ) );
        } else {
            this.height_scale = 1 / ( Math.ceil( limit / this.height_increment ) * this.height_increment );
        }
    }
}

class Selection {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.isActive = false;
        this.objects = [];
    }

    setPosition(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        this.x = x;
        this.y = y;
        for (const object of this.objects) {
            object.setPosition(object.x + dx, object.y + dy);
        }
    }

    containsPoint(x, y) {
        let inXRange = false;
        let inYRange = false;
    
        if (x >= Math.min(this.x, this.x + this.w) && x <= Math.max(this.x, this.x + this.w)) {
            inXRange = true;
        }
        if (y >= Math.min(this.y, this.y + this.h) && y <= Math.max(this.y, this.y + this.h)) {
            inYRange = true;
        }

        if (inXRange && inYRange) {
            return true;
        }
        return false;
    }

    draw(ctx) {
        if (this.objects.length != 0 || this.isActive) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.fillStyle = "rgb(255 255 255 / 10%)";
            ctx.strokeStyle = 'white';
            ctx.beginPath();
            ctx.fillRect(0, 0, this.w, this.h);
            ctx.rect(0, 0, this.w, this.h);
            ctx.stroke();
            ctx.restore();
        }
    }
}

export { SimContainer, GraphContainer, Selection };
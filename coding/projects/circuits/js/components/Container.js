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
        if (limit < this.height_increment) {
            this.height_scale = 1 / ( Math.pow(2, Math.ceil( Math.log2( limit ) ) ) );
        } else {
            this.height_scale = 1 / ( Math.ceil( limit / this.height_increment ) * this.height_increment );
        }
    }
}

export { SimContainer, GraphContainer };
export class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    flip() {
        this.scale(-1);
    }

    _flip() {
        return new Vector(this.x * -1, this.y * -1);
    }

    scale(c) {
        this.x *= c;
        this.y *= c;
    }

    _scale(c) {
        return new Vector(this.x * c, this.y * c);
    }

    dot(v) {
        return ( this.x * v.x ) + ( this.y * v.y );
    }

    magnitude() {
        return Math.hypot(this.x, this.y);
    }

    asArray() {
        return [this.x, this.y];
    }

    asString() {
        return "[" + this.x + ", " + this.y + "]";
    }
}
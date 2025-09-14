import { Vector } from "./Vector.js";

export class Matrix {
    constructor(a11 = 0, a12 = 0, a21 = 0, a22 = 0) {
        this.a11 = a11;
        this.a12 = a12;
        this.a21 = a21;
        this.a22 = a22;
    }

    scale(c) {
        this.a11 *= c;
        this.a12 *= c;
        this.a21 *= c;
        this.a22 *= c;
    }

    multiply(v) {
        const v1 = ( this.a11 * v.x ) + ( this.a12 * v.y );
        const v2 = ( this.a21 * v.x ) + ( this.a22 * v.y );
        return new Vector(v1, v2);
    }

    multiplyMatrix(M) {
        const a11 = this.a11;
        const a12 = this.a12;
        const a21 = this.a21;
        const a22 = this.a22;

        const x11 = (a11 * M.a11) + (a12 * M.a21);
        const x12 = (a11 * M.a12) + (a12 * M.a22);
        const x21 = (a21 * M.a11) + (a22 * M.a21);
        const x22 = (a21 * M.a12) + (a22 * M.a22);

        return new Matrix(x11, x12, x21, x22);
    }

    rank() {
        if (this.determinant() != 0) {
            return 2;
        }
        
        if (this.a11 == 0 && this.a12 == 0 && this.a21 == 0 && this.a22 == 0) {
            return 0;
        }

        return 1;
    }

    trace() {
        return ( this.a11 + this.a22 );
    }

    determinant() {
        return ( this.a11 * this.a22 ) - ( this.a12 * this.a21 );
    }

    characteristicPolynomial() {
        const b = this.trace() >= 0 ? " - " + this.trace() : " + " + (-1 * this.trace());
        const c = this.determinant() >= 0 ? " + " + this.determinant() : " - " + (-1 * this.determinant());
        return "(λ^2)" + b + "(λ)" + c;
    }

    eigenvalues() {
        const a = 1;
        const b = -this.trace();
        const c = this.determinant();

        const eigenvalue_1 = ( -b + Math.sqrt( Math.pow(b, 2) - (4 * a * c) ) ) / ( 2 * a );
        const eigenvalue_2 = ( -b - Math.sqrt( Math.pow(b, 2) - (4 * a * c) ) ) / ( 2 * a );

        return [eigenvalue_1, eigenvalue_2];
    }

    eigenvector(eigenvalue) {
        const a11 = this.a11 - eigenvalue;
        const a12 = this.a12;
        const a21 = this.a21;
        const a22 = this.a22 - eigenvalue;

        let x = 0;
        let y = 0;

        if (a11 != 0 || a12 != 0) {
            if (a12 != 0) {
                x = 1;
                y = -(a11 / a12);
            } else {
                y = 1;
            }
        } else if (a21 != 0 || a22 != 0) {
            if (a22 != 0) {
                x = 1;
                y = -(a21 / a22);
            } else {
                y = 1;
            }
        } else {
            x = 1;
            y = 1;
        }

        return new Vector(x, y);
    }

    transpose() {
        const a12 = this.a12;
        const a21 = this.a21;

        this.a12 = a21;
        this.a21 = a12;
    }

    invert() {
        const det = this.determinant();

        if (det == 0) return null;

        const a11 = this.a11;
        const a22 = this.a22;

        this.a11 = a22;
        this.a12 *= -1;
        this.a21 *= -1;
        this.a22 = a11;

        this.scale(1 / det);
    }

    getInverse() {
        const det = this.determinant();

        if (det == 0) return null;

        const M = new Matrix(this.a22, this.a12 * -1, this.a21 * -1, this.a11)
        M.scale(1 / det);

        return M;
    }

    asString() {
        return `[${this.a11} ${this.a12}; ${this.a21} ${this.a22}]`
    }
}
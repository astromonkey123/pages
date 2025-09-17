import { GridContainer} from "../components/Container.js"

import { Matrix } from "../components/Matrix.js";
import { Vector } from "../components/Vector.js";

import { pixelsToCoords, coordsToPixels, hexToRGB } from "../util/conversions.js";
import { log, colorLerp } from "../util/utilities.js";
import { rainbow, highlight, light, dark } from "../util/colors.js";

export const gridContainer = new GridContainer('canvas');
export const dt = 1e-2;

const canvas = gridContainer.canvas;
const ctx = gridContainer.ctx;

const a11_input = document.getElementById('a11');
const a12_input = document.getElementById('a12');
const a21_input = document.getElementById('a21');
const a22_input = document.getElementById('a22');

const e11_input = document.getElementById('e11');
const e12_input = document.getElementById('e12');
const e21_input = document.getElementById('e21');
const e22_input = document.getElementById('e22');

const v1_input = document.getElementById('v1');
const v2_input = document.getElementById('v2');

const invert_input = document.getElementById('invert');
const transpose_input = document.getElementById('transpose');
const rank_output = document.getElementById('rank');
const trace_output = document.getElementById('trace');
const determinant_output = document.getElementById('determinant');
const polynomial_output = document.getElementById('characteristic-polynomial');
const eigval_1_output = document.getElementById('eigenvalue-1');
const eigval_2_output = document.getElementById('eigenvalue-2');
const eigvec_1_output = document.getElementById('eigenvector-1');
const eigvec_2_output = document.getElementById('eigenvector-2');

function drawGrid(v1, v2, color, width) {
    const lowerLeftBound = pixelsToCoords(0, canvas.height);
    const upperRightBound = pixelsToCoords(canvas.width, 0);

    const threshold = 5
    const gridSpacing = Math.pow(threshold, Math.ceil(log(50 / gridContainer.coordScale, threshold)));

    const [x_min, y_min] = lowerLeftBound;
    const [x_max, y_max] = upperRightBound;

    const M = new Matrix(v1.x, v2.x, v1.y, v2.y);
    const b1 = new Vector(x_min, y_min);
    const b2 = new Vector(x_min, y_max);
    const b3 = new Vector(x_max, y_min);
    const b4 = new Vector(x_max, y_max);

    const M_inv = M.getInverse();
    const w1 = M_inv.multiply(b1);
    const w2 = M_inv.multiply(b2);
    const w3 = M_inv.multiply(b3);
    const w4 = M_inv.multiply(b4);

    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.font = "18px serif";

    const xs = [w1.x, w2.x, w3.x, w4.x];
    const ys = [w1.y, w2.y, w3.y, w4.y];

    for (let x = Math.floor(Math.min(...xs) / gridSpacing) * gridSpacing; x <= Math.max(...xs); x += gridSpacing) {
        for (let y = Math.floor(Math.min(...ys) / gridSpacing) * gridSpacing; y <= Math.max(...ys); y += gridSpacing) {
            const position = M.multiply(new Vector(x, y));

            ctx.save();
            ctx.translate(...coordsToPixels(position.x, position.y));
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(v1.x * gridContainer.coordScale * gridSpacing, -v1.y * gridContainer.coordScale * gridSpacing)
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(v2.x * gridContainer.coordScale * gridSpacing, -v2.y * gridContainer.coordScale * gridSpacing)
            ctx.stroke();

            if (x == 0) {
                ctx.fillText(y.toFixed(0), 5, 20);
                ctx.beginPath();
                ctx.arc(0, 0, 3, 0, Math.PI * 2)
                ctx.fill();
            } else if (y == 0) {
                ctx.fillText(x.toFixed(0), 5, 20);
                ctx.beginPath();
                ctx.arc(0, 0, 3, 0, Math.PI * 2)
                ctx.fill();
            }

            ctx.restore();
        }
    }
}

function drawVector(v, color, width, drawArrow) {
    const [w_0, h_0] = coordsToPixels(0, 0);
    const [w, h] = coordsToPixels(...v.asArray());
    
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.font = "18px serif";
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(w_0, h_0);
    ctx.lineTo(w, h);
    ctx.stroke();
    ctx.restore();

    if (drawArrow) {
        ctx.save();
        ctx.translate(w, h);
        ctx.rotate(Math.atan2(v.x, v.y) + Math.PI);
        ctx.moveTo(-5, -5);
        ctx.lineTo(0, 0);
        ctx.lineTo(5, -5);
        ctx.stroke();
        ctx.restore();
    }
}

function appPeriodic() {
    gridContainer.matrix.a11 = parseFloat(a11_input.value);
    gridContainer.matrix.a12 = parseFloat(a12_input.value);
    gridContainer.matrix.a21 = parseFloat(a21_input.value);
    gridContainer.matrix.a22 = parseFloat(a22_input.value);

    const e11 = parseFloat(e11_input.value);
    const e12 = parseFloat(e12_input.value);
    const e21 = parseFloat(e21_input.value);
    const e22 = parseFloat(e22_input.value);

    const v1 = parseFloat(v1_input.value);
    const v2 = parseFloat(v2_input.value);

    const [c1, u1, c2, u2] = updateProperties();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = light;
    ctx.strokeStyle = light;
    ctx.font = "12px serif";

    const e1 = new Vector(e11, e12);
    const e2 = new Vector(e21, e22);

    const v = new Vector(v1, v2);
    const vbar = gridContainer.matrix.multiply(v);

    const ebar_1 = gridContainer.matrix.multiply(e1);
    const ebar_2 = gridContainer.matrix.multiply(e2);

    drawGrid(e1, e2, "white", 0.5);
    drawGrid(ebar_1, ebar_2, "#7c98ff", 1);

    drawVector(e1, "white", 2, true);
    drawVector(e2, "white", 2, true);

    drawVector(ebar_1, "#7c98ff", 4, true);
    drawVector(ebar_2, "#7c98ff", 4, true);

    drawVector(u1, "#7cff98", 3, true);
    drawVector(u2, "#7cff98", 3, true);

    drawVector(u1._scale(c1), "#7cff98", 1, true);
    drawVector(u2._scale(c2), "#7cff98", 1, true);

    drawVector(v, "#ff987c", 3, true);
    drawVector(vbar, "#ff987c", 1, true);
}

function updateValues() {
    a11_input.value = gridContainer.matrix.a11;
    a12_input.value = gridContainer.matrix.a12;
    a21_input.value = gridContainer.matrix.a21;
    a22_input.value = gridContainer.matrix.a22;
}

function updateProperties() {
    const [eigval_1, eigval_2] = gridContainer.matrix.eigenvalues();

    rank_output.innerHTML = gridContainer.matrix.rank();
    trace_output.innerHTML = gridContainer.matrix.trace();
    determinant_output.innerHTML = gridContainer.matrix.determinant();
    polynomial_output.innerHTML = gridContainer.matrix.characteristicPolynomial();
    eigval_1_output.innerHTML = "λ1 = " + eigval_1;
    eigval_2_output.innerHTML = "λ2 = " + eigval_2;
    const u1 = gridContainer.matrix.eigenvector(eigval_1);
    const u2 = gridContainer.matrix.eigenvector(eigval_2);
    eigvec_1_output.innerHTML = "<span style=\"color:#7cff98\">u1</span> = " + u1.asString();
    eigvec_2_output.innerHTML = "<span style=\"color:#7cff98\">u2</span> = " + u2.asString();

    return [eigval_1, u1, eigval_2, u2];
}

canvas.addEventListener('mousedown', (e) => { gridContainer.isDragging = true; });
canvas.addEventListener('mousemove', (e) => gridContainer.dragGrid(e));
canvas.addEventListener('mouseup', () => { gridContainer.isDragging = false; })
canvas.addEventListener('wheel', (e) => gridContainer.zoomGrid(e));

invert_input.addEventListener('click', () => {
    gridContainer.matrix.invert();
    updateValues();
});
transpose_input.addEventListener('click', () => {
    gridContainer.matrix.transpose();
    updateValues();
});

document.addEventListener('keypress', (e) => {
    if (e.key == 'r') {
        gridContainer.resetFields();
        e11_input.value = 1;
        e12_input.value = 0;
        e21_input.value = 0;
        e22_input.value = 1;
    }
});

setInterval(appPeriodic, 10);
import { Circuit } from './circuit.js';
import { Battery, Wire, Resistor, Capacitor, Inductor } from './element.js';
import { Connection } from './connection.js';
import { simulate_periodic } from './circuit_sim.js';
import { graphAll, resetGraph } from './graphing.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

export let circuits = [];
export let objects = [];
export let connections = [];
let edit_object = null;
let dragging = null;
let offsetX = 0;
let offsetY = 0;
let offsetRot = 0;

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addBattery').addEventListener('click', () => {
        new Battery(canvas.width/2, canvas.height/2 + 100, 1);
    });
    document.getElementById('addResistor').addEventListener('click', () => {
        new Resistor(canvas.width/2, canvas.height/2 + 50, 1);
    });
    document.getElementById('addCapacitor').addEventListener('click', () => {
        new Capacitor(canvas.width/2, canvas.height/2, 0.001, 0);
    });
    document.getElementById('addInductor').addEventListener('click', () => {
        new Inductor(canvas.width/2, canvas.height/2 - 50, 1);
    });
    document.getElementById('addWire').addEventListener('click', () => {
        new Wire(canvas.width/2, canvas.height/2 - 100);
    });
    document.getElementById('clearCanvas').addEventListener('click', () => {
        const clear_text = document.getElementById('clearText');

        if (clear_text.innerHTML === "Clear") {
            clear_text.innerHTML = "Confirm?"
            setTimeout(() => {clear_text.innerHTML = "Clear"}, 2000); // Cancel after 2000ms
        } else if (clear_text.innerHTML === "Confirm?") {
            clear_text.innerHTML = "Clear"
            clearCanvas();
        }
    });
});

function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let obj of objects) {
        obj.draw(ctx);
    }
    for (let connection of connections) {
        connection.draw(ctx);
        connection.checkLinks();
    }
}

function clearCanvas() {
    circuits = [];
    objects = [];
    connections = [];
    dragging = null;
    resetGraph();
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (let object of objects) {
        if (object.type == 'wire') {
            if (object.connection1.contains(mouseX, mouseY)) {
                dragging = object.connection1;
            } else if (object.connection2.contains(mouseX, mouseY)) {
                dragging = object.connection2;
            }
        } else {
            if (object.contains(mouseX, mouseY)) {
                dragging = object;
                offsetX = mouseX - dragging.x;
                offsetY = mouseY - dragging.y;
                offsetRot = Math.atan2(offsetX, offsetY) + dragging.rotation;
            }
        }
    }
});

canvas.addEventListener('dblclick', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (let object of objects) {
        if (object.type == 'wire') continue;

        if (object.contains(mouseX, mouseY)) {
            if (object.type == 'capacitor') {
                showInputBox(object, 1);
            } else {
                showInputBox(object, 2);
            }
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    if (dragging instanceof Connection) {
        dragging.move(e.clientX - rect.left, e.clientY - rect.top);
    } else {
        if (e.shiftKey) {
            offsetX = e.clientX - rect.left - dragging.x;
            offsetY = e.clientY - rect.top - dragging.y;
            dragging.rotate(-Math.atan2(offsetX, offsetY) +  offsetRot);
        } else {
            dragging.move(e.clientX - rect.left - offsetX, e.clientY - rect.top - offsetY);
        }
    }
    drawAll();
});

canvas.addEventListener('mouseup', () => {
    dragging = null;
});

function display_info() {
    if (circuits.length === 0) return;

    let circuit = circuits[0];
    document.getElementById("current").innerHTML = "Current: " + "<br>" + circuit.I.toFixed(3) + "A";
    document.getElementById("integral").innerHTML = "Integral: " + "<br>" + circuit.integral_Idt.toFixed(3) + "As";
    document.getElementById("derivative").innerHTML = "Derivative: " + "<br>" + circuit.dIdt.toFixed(3) + "A/s";
    document.getElementById("time").innerHTML = "Time: " + "<br>" + circuit.elapsed_time.toFixed(3) + "s";
}

const input_box = document.getElementById('input-box');
const input_type = document.getElementById('input-type');
const input_field = document.getElementById('input-field');
const accept_button = document.getElementById('accept');
const cancel_button = document.getElementById('cancel');

function showInputBox(object) {
    input_box.style.visibility = "visible";

    edit_object = object;

    if (object.type == 'battery') {
        input_type.innerHTML = "Voltage";
        input_field.value = object.emf;

    } else if (object.type == 'resistor') {
        input_type.innerHTML = "Resistance";
        input_field.value = object.resistance;

    } else if (object.type == 'capacitor') {
        input_type.innerHTML = "Capacitance";
        input_field.value = object.capacitance;

    } else if (object.type == 'inductor') {
        input_type.innerHTML = "Inductance";
        input_field.value = object.inductance;

    }
}

accept_button.addEventListener('click', () => {
    input_box.style.visibility = "hidden";

    if (edit_object.type == 'battery') {
        edit_object.emf = parseFloat(input_field.value);

    } else if (edit_object.type == 'resistor') {
        edit_object.resistance = parseFloat(input_field.value);

    } else if (edit_object.type == 'capacitor') {
        edit_object.capacitance = parseFloat(input_field.value);

    } else if (edit_object.type == 'inductor') {
        edit_object.inductance = parseFloat(input_field.value);

    }
});

cancel_button.addEventListener('click', () => {
    input_box.style.visibility = "hidden";
});

setInterval(drawAll, 30);
setInterval(simulate_periodic, 5);
setInterval(display_info, 5);
setInterval(graphAll, 5);
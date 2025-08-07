import { Circuit, CircuitData } from '../components/Circuit.js';
import { SimContainer, GraphContainer } from '../components/Container.js';
import { Battery, Wire, Resistor, Capacitor, Inductor } from '../components/Element.js';
import { Link } from '../components/Link.js';

import { addSeries, addParallel, addRC, addRL, addRLC } from '../utils/presets.js';
import { drawGraph } from './graph.js';
import { simulate_periodic } from './sim.js';

export const simContainer = new SimContainer('canvas');
export const graphContainer = new GraphContainer('graph');
export const dt = 1e-3;

const canvas = simContainer.canvas;
const ctx = simContainer.ctx;

const input_box = document.getElementById('input-box');
const input_type = document.getElementById('input-type');
const input_field = document.getElementById('input-field');
const accept_button = document.getElementById('accept');
const cancel_button = document.getElementById('cancel');

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addBattery').addEventListener('click', () => {
        simContainer.elements.push(new Battery(
            canvas.width/2,
            canvas.height/2 + 100,
            1));
        simContainer.updateLinks();
    });
    document.getElementById('addResistor').addEventListener('click', () => {
        simContainer.elements.push(new Resistor(
            canvas.width/2,
            canvas.height/2 + 50,
            1));
        simContainer.updateLinks();
    });
    document.getElementById('addCapacitor').addEventListener('click', () => {
        simContainer.elements.push(new Capacitor(
            canvas.width/2,
            canvas.height/2,
            0.001,
            0));
        simContainer.updateLinks();
    });
    document.getElementById('addInductor').addEventListener('click', () => {
        simContainer.elements.push(new Inductor(
            canvas.width/2, 
            canvas.height/2 - 50, 
            1));
        simContainer.updateLinks();
    });
    document.getElementById('addWire').addEventListener('click', () => {
        simContainer.elements.push(new Wire(
            canvas.width/2 - 50,
            canvas.height/2 - 100,
            canvas.width/2 + 50,
            canvas.height/2 - 100));
        simContainer.updateLinks();
    });
    document.getElementById('addSeries').addEventListener('click', () => {
        addSeries(simContainer);
        simContainer.updateLinks();
    });
    document.getElementById('addParallel').addEventListener('click', () => {
        addParallel(simContainer);
        simContainer.updateLinks();
    });
    document.getElementById('addRC').addEventListener('click', () => {
        addRC(simContainer);
        simContainer.updateLinks();
    });
    document.getElementById('addRL').addEventListener('click', () => {
        addRL(simContainer);
        simContainer.updateLinks();
    });
    document.getElementById('addRLC').addEventListener('click', () => {
        addRLC(simContainer);
        simContainer.updateLinks();
    });
    document.getElementById('clearCanvas').addEventListener('click', () => {
        const clear_text = document.getElementById('clearText');
        const slider_cover = document.getElementById('slider-cover');

        if (clear_text.innerHTML === "Clear") {
            clear_text.innerHTML = "Confirm?"
            slider_cover.style.width = "80%";
            setTimeout(() => {
                clear_text.innerHTML = "Clear";
                slider_cover.style.width = "85%";
            }, 2000); // Cancel after 2000ms

        } else if (clear_text.innerHTML === "Confirm?") {
            clear_text.innerHTML = "Clear"
            slider_cover.style.width = "85%";
            clearCanvas();

        }
    });
});

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (let element of simContainer.elements) {
        if (element.type == 'wire') {
            if (element.link1.containsPoint(mouseX, mouseY)) {
                simContainer.dragging = element.link1;
            } else if (element.link2.containsPoint(mouseX, mouseY)) {
                simContainer.dragging = element.link2;
            }
        } else {
            if (element.containsPoint(mouseX, mouseY)) {
                simContainer.dragging = element;
                simContainer.offsets.x = mouseX - simContainer.dragging.x;
                simContainer.offsets.y = mouseY - simContainer.dragging.y;
                simContainer.offsets.rotation = Math.atan2(simContainer.offsets.x, simContainer.offsets.y) + simContainer.dragging.rotation;
            }
        }
    }
});

canvas.addEventListener('dblclick', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (let element of simContainer.elements) {
        if (element.type == 'wire') continue;

        if (element.containsPoint(mouseX, mouseY)) {
            if (element.type == 'capacitor') {
                showInputBox(element, 1);
            } else {
                showInputBox(element, 2);
            }
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!simContainer.dragging) return;
    const rect = canvas.getBoundingClientRect();
    if (simContainer.dragging instanceof Link) {
        simContainer.dragging.setPosition(e.clientX - rect.left, e.clientY - rect.top);
    } else {
        if (e.shiftKey) {
            simContainer.offsets.x = e.clientX - rect.left - simContainer.dragging.x;
            simContainer.offsets.y = e.clientY - rect.top - simContainer.dragging.y;
            simContainer.dragging.setRotation(-Math.atan2(simContainer.offsets.x, simContainer.offsets.y) +  simContainer.offsets.rotation);
        } else {
            simContainer.dragging.setPosition(e.clientX - rect.left - simContainer.offsets.x, e.clientY - rect.top - simContainer.offsets.y);
        }
    }
    drawAll();
});

canvas.addEventListener('mouseup', () => {
    simContainer.dragging = null;
});

accept_button.addEventListener('click', () => {
    input_box.style.visibility = "hidden";

    if (simContainer.editing.type == 'battery') {
        simContainer.editing.emf = parseFloat(input_field.value);

    } else if (simContainer.editing.type == 'resistor') {
        simContainer.editing.resistance = parseFloat(input_field.value);

    } else if (simContainer.editing.type == 'capacitor') {
        simContainer.editing.capacitance = parseFloat(input_field.value);

    } else if (simContainer.editing.type == 'inductor') {
        simContainer.editing.inductance = parseFloat(input_field.value);

    }
});

cancel_button.addEventListener('click', () => {
    input_box.style.visibility = "hidden";
});

function appPeriodic() {
    drawAll();
    simulate_periodic();
    display_info();
    drawGraph();
}

function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let element of simContainer.elements) {
        element.draw(ctx);
    }
    for (let link of simContainer.links) {
        link.draw(ctx);
        link.findLinks(simContainer);
    }
}

function clearCanvas() {
    simContainer.resetFields();
}

function display_info() {
    if (simContainer.circuits.length === 0) return;

    let circuit = simContainer.circuits[0];
    document.getElementById("current").innerHTML = "Current: " + "<br>" + circuit.current.toFixed(3) + "A";
    document.getElementById("integral").innerHTML = "Integral: " + "<br>" + circuit.current_idt.toFixed(3) + "As";
    document.getElementById("derivative").innerHTML = "Derivative: " + "<br>" + circuit.current_ddt.toFixed(3) + "A/s";
    document.getElementById("time").innerHTML = "Time: " + "<br>" + circuit.elapsed_time.toFixed(3) + "s";
}

function showInputBox(element) {
    input_box.style.visibility = "visible";

    simContainer.editing = element;

    if (element.type == 'battery') {
        input_type.innerHTML = "Voltage";
        input_field.value = element.emf;

    } else if (element.type == 'resistor') {
        input_type.innerHTML = "Resistance";
        input_field.value = element.resistance;

    } else if (element.type == 'capacitor') {
        input_type.innerHTML = "Capacitance";
        input_field.value = element.capacitance;

    } else if (element.type == 'inductor') {
        input_type.innerHTML = "Inductance";
        input_field.value = element.inductance;

    }
}

setInterval(appPeriodic, 10);
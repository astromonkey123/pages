import { Circuit, CircuitData } from '../components/Circuit.js';
import { SimContainer, GraphContainer, Selection } from '../components/Container.js';
import { Battery, Wire, Resistor, Capacitor, Inductor, Switch } from '../components/Element.js';
import { Link } from '../components/Link.js';

import { addElement } from '../utils/elements.js';
import { addPreset } from '../utils/presets.js';
import { drawGraph } from './graph.js';
import { simulatePeriodic } from './sim.js';

export const simContainer = new SimContainer('canvas');
export const graphContainer = new GraphContainer('graph');
export const dt = 1e-3;

const canvas = simContainer.canvas;
const ctx = simContainer.ctx;

const input_box = document.getElementById('input-box');
const input_entry1 = document.getElementById('input-entry-1');
const input_entry2 = document.getElementById('input-entry-2');
const input_type1 = document.getElementById('input-type-1');
const input_type2 = document.getElementById('input-type-2');
const input_field1 = document.getElementById('input-field-1');
const input_field2 = document.getElementById('input-field-2');
const input_unit1 = document.getElementById('input-unit-1');
const input_unit2 = document.getElementById('input-unit-2');
const accept_button = document.getElementById('accept');
const cancel_button = document.getElementById('cancel');

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addBattery').addEventListener('click', () => {
        addElement(simContainer, 'battery');
    });
    document.getElementById('addResistor').addEventListener('click', () => {
        addElement(simContainer, 'resistor');
    });
    document.getElementById('addCapacitor').addEventListener('click', () => {
        addElement(simContainer, 'capacitor');
    });
    document.getElementById('addInductor').addEventListener('click', () => {
        addElement(simContainer, 'inductor');
    });
    document.getElementById('addWire').addEventListener('click', () => {
        addElement(simContainer, 'wire');
    });
    document.getElementById('addSwitch').addEventListener('click', () => {
        addElement(simContainer, 'switch');
    });
    document.getElementById('addSeries').addEventListener('click', () => {
        addPreset(simContainer, 'series');
    });
    document.getElementById('addParallel').addEventListener('click', () => {
        addPreset(simContainer, 'parallel');
    });
    document.getElementById('addSeriesSwitch').addEventListener('click', () => {
        addPreset(simContainer, 'switch');
    });
    document.getElementById('addRC').addEventListener('click', () => {
        addPreset(simContainer, 'rc');
    });
    document.getElementById('addRL').addEventListener('click', () => {
        addPreset(simContainer, 'rl');
    });
    document.getElementById('addLC').addEventListener('click', () => {
        addPreset(simContainer, 'lc');
    });
    document.getElementById('addRLC').addEventListener('click', () => {
        addPreset(simContainer, 'rlc');
    });
    document.getElementById('clearCanvas').addEventListener('click', () => {
        const clear_text = document.getElementById('clearCanvasText');
        const slider_cover = document.getElementById('slider-cover');

        if (clear_text.innerHTML === "Clear") {
            clear_text.innerHTML = "Confirm?"
            slider_cover.style.width = "82%";
            setTimeout(() => {
                clear_text.innerHTML = "Clear";
                slider_cover.style.width = "87%";
            }, 2000); // Cancel after 2000ms

        } else if (clear_text.innerHTML === "Confirm?") {
            clear_text.innerHTML = "Clear"
            slider_cover.style.width = "87%";
            simContainer.resetFields();
        }
    });
    document.getElementById('showData').addEventListener('click', () => {
        const show_text = document.getElementById('showDataText');

        if (show_text.innerHTML === "Hide Details") {
            show_text.innerHTML = "Show Details"
            simContainer.showData = false;
        } else if (show_text.innerHTML === "Show Details") {
            show_text.innerHTML = "Hide Details"
            simContainer.showData = true;
        }
    });
    document.getElementById('runSimulation').addEventListener('click', () => {
        const run_text = document.getElementById('runSimulationText');

        if (run_text.innerHTML === "Pause Simulation") {
            run_text.innerHTML = "Play Simulation"
            simContainer.isSimulating = false;
        } else if (run_text.innerHTML === "Play Simulation") {
            run_text.innerHTML = "Pause Simulation"
            simContainer.isSimulating = true;
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key == 'b') {
            addElement(simContainer, 'battery');
        } else if (e.key == 'r') {
            addElement(simContainer, 'resistor');
        } else if (e.key == 'c') {
            addElement(simContainer, 'capacitor');
        } else if (e.key == 'l') {
            addElement(simContainer, 'inductor');
        } else if (e.key == 'w') {
            addElement(simContainer, 'wire');
        } else if (e.key == 's') {
            addElement(simContainer, 'switch');
        }
    });
});

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (simContainer.selection.objects.length != 0 && simContainer.selection.containsPoint(mouseX, mouseY)) {
        simContainer.dragging = simContainer.selection;
        simContainer.offsets.x = mouseX - simContainer.dragging.x;
        simContainer.offsets.y = mouseY - simContainer.dragging.y;
        simContainer.offsets.rotation = 0;
        return null;
    }

    for (let element of simContainer.elements) {
        if (element.type == 'wire') {
            if (element.link1.containsPoint(mouseX, mouseY)) {
                simContainer.dragging = element.link1;
                return null;
            } else if (element.link2.containsPoint(mouseX, mouseY)) {
                simContainer.dragging = element.link2;
                return null;
            }
        } else {
            if (element.containsPoint(mouseX, mouseY)) {
                simContainer.dragging = element;
                simContainer.offsets.x = mouseX - simContainer.dragging.x;
                simContainer.offsets.y = mouseY - simContainer.dragging.y;
                simContainer.offsets.rotation = Math.atan2(simContainer.offsets.x, simContainer.offsets.y) + simContainer.dragging.rotation;
                return null;
            }
        }
    }

    if (simContainer.selection.objects.length == 0) {
        simContainer.selection.isActive = true;
        simContainer.selection.objects = [];
        simContainer.selection.x = mouseX;
        simContainer.selection.y = mouseY;
        simContainer.selection.w = 0;
        simContainer.selection.h = 0;
        return null;
    }

    if (!simContainer.selection.containsPoint(mouseX, mouseY)) {
        simContainer.selection.isActive = false;
        simContainer.selection.objects = [];
        simContainer.selection.x = 0;
        simContainer.selection.y = 0;
        simContainer.selection.w = 0;
        simContainer.selection.h = 0;
    }
});

canvas.addEventListener('dblclick', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (let element of simContainer.elements) {
        if (element.type == 'wire') { continue }
        
        if (element.containsPoint(mouseX, mouseY)) {
            if (element.type == 'switch') {
                element.state = !element.state;
            } else {
                showInputBox(element);
            }
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (simContainer.dragging instanceof Selection) {
        simContainer.dragging.setPosition(mouseX - simContainer.offsets.x, mouseY - simContainer.offsets.y);
    } else if (simContainer.dragging instanceof Link) {
        simContainer.dragging.setPosition(mouseX, mouseY);
    } else if (simContainer.dragging != null) {
        if (e.shiftKey) {
            simContainer.offsets.x = mouseX - simContainer.dragging.x;
            simContainer.offsets.y = mouseY - simContainer.dragging.y;
            simContainer.dragging.setRotation(-Math.atan2(simContainer.offsets.x, simContainer.offsets.y) +  simContainer.offsets.rotation);
        } else {
            simContainer.dragging.setPosition(mouseX - simContainer.offsets.x, mouseY - simContainer.offsets.y);
        }
    }

    if (simContainer.selection.isActive) {
        simContainer.selection.w = mouseX - simContainer.selection.x;
        simContainer.selection.h = mouseY - simContainer.selection.y;
    }
});

canvas.addEventListener('mouseup', () => {
    simContainer.dragging = null;
    if (simContainer.selection.isActive) {
        for (const element of simContainer.elements) {
            if (element.type == 'wire') {
                if (simContainer.selection.containsPoint(element.link1.x, element.link1.y)) {
                    simContainer.selection.objects.push(element.link1);
                }
                if (simContainer.selection.containsPoint(element.link2.x, element.link2.y)) {
                    simContainer.selection.objects.push(element.link2);
                }
            } else {
                if (simContainer.selection.containsPoint(element.x, element.y)) {
                    simContainer.selection.objects.push(element);
                }
            }
        }
        simContainer.selection.isActive = false;
    }
});

accept_button.addEventListener('click', () => {
    input_box.style.visibility = "hidden";
    input_entry2.style.visibility = "hidden";

    if (simContainer.editing.type == 'battery') {
        simContainer.editing.emf = parseFloat(input_field1.value);

    } else if (simContainer.editing.type == 'resistor') {
        simContainer.editing.resistance = parseFloat(input_field1.value);

    } else if (simContainer.editing.type == 'capacitor') {
        simContainer.editing.capacitance = parseFloat(input_field1.value);
        simContainer.editing.current_idt = parseFloat(input_field2.value)

    } else if (simContainer.editing.type == 'inductor') {
        simContainer.editing.inductance = parseFloat(input_field1.value);

    }
});

cancel_button.addEventListener('click', () => {
    input_box.style.visibility = "hidden";
    input_entry2.style.visibility = "hidden";
});

function appPeriodic() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawObjects();
    if (simContainer.isSimulating) {
        simulatePeriodic();
    }
    display_info();
    drawGraph();
}

function drawObjects() {
    for (let element of simContainer.elements) {
        element.draw(ctx, simContainer.showData);
    }
    for (let link of simContainer.links) {
        link.draw(ctx);
        link.findLinks(simContainer);
    }
    simContainer.selection.draw(ctx);
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
        input_type1.innerHTML = "Voltage";
        input_field1.value = element.emf;
        input_unit1.innerHTML = "V";

        input_entry2.style.visibility = "hidden";

        input_box.style.height = "100px";

    } else if (element.type == 'resistor') {
        input_type1.innerHTML = "Resistance";
        input_field1.value = element.resistance;
        input_unit1.innerHTML = "Ω";

        input_entry2.style.visibility = "hidden";

        input_box.style.height = "100px";

    } else if (element.type == 'capacitor') {
        input_type1.innerHTML = "Capacitance";
        input_field1.value = element.capacitance;
        input_unit1.innerHTML = "F";

        input_type2.innerHTML = "Stored Charge";
        input_field2.value = element.current_idt;
        input_unit2.innerHTML = "C";

        input_entry2.style.visibility = "visible";

        input_box.style.height = "150px";

    } else if (element.type == 'inductor') {
        input_type1.innerHTML = "Inductance";
        input_field1.value = element.inductance;
        input_unit1.innerHTML = "H";

        input_entry2.style.visibility = "hidden";

        input_box.style.height = "100px";

    }
}

setInterval(appPeriodic, 10);
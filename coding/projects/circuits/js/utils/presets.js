import { Battery, Wire, Resistor, Capacitor, Inductor, Switch } from '../components/Element.js';

function addSeries(simContainer) {
    simContainer.elements.push(new Battery(
        canvas.width/2,
        canvas.height/2 + 50,
        10
    ));
    simContainer.elements.push(new Resistor(
        canvas.width/2,
        canvas.height/2 - 50,
        1
    ));
    simContainer.elements.push(new Wire(
        canvas.width/2 - 50,
        canvas.height/2 - 50,
        canvas.width/2 - 50,
        canvas.height/2 + 50
    ));
    simContainer.elements.push(new Wire(
        canvas.width/2 + 50,
        canvas.height/2 - 50,
        canvas.width/2 + 50,
        canvas.height/2 + 50
    ));
}

function addParallel(simContainer) {
    simContainer.elements.push(new Battery(
        canvas.width/2,
        canvas.height/2 + 100,
        10
    ));
    simContainer.elements.push(new Resistor(
        canvas.width/2,
        canvas.height/2, 1
    ));
    simContainer.elements.push(new Resistor(canvas.width/2,
        canvas.height/2 - 100,
        1
    ));
    simContainer.elements.push(new Wire(
        canvas.width/2 - 50,
        canvas.height/2 + 100,
        canvas.width/2 - 50,
        canvas.height/2
    ));
    simContainer.elements.push(new Wire(
        canvas.width/2 + 50,
        canvas.height/2 + 100,
        canvas.width/2 + 50,
        canvas.height/2
    ));
    simContainer.elements.push(new Wire(
        canvas.width/2 - 50,
        canvas.height/2 - 100,
        canvas.width/2 - 50,
        canvas.height/2
    ));
    simContainer.elements.push(new Wire(
        canvas.width/2 + 50,
        canvas.height/2 - 100,
        canvas.width/2 + 50,
        canvas.height/2
    ));
}

function addSeriesSwitch(simContainer) {
    simContainer.elements.push(new Battery(
        canvas.width/2,
        canvas.height/2 + 50,
        10
    ));
    simContainer.elements.push(new Resistor(
        canvas.width/2 + 50,
        canvas.height/2 - 50,
        1
    ));
    simContainer.elements.push(new Switch(
        canvas.width/2 - 50,
        canvas.height/2 - 50,
    ));
    simContainer.elements.push(new Wire(
        canvas.width/2 - 100,
        canvas.height/2 - 50,
        canvas.width/2 - 100,
        canvas.height/2 + 50
    ));
    simContainer.elements.push(new Wire(
        canvas.width/2 + 100,
        canvas.height/2 - 50,
        canvas.width/2 + 100,
        canvas.height/2 + 50
    ));
    simContainer.elements.push(new Wire(
        canvas.width/2 - 100,
        canvas.height/2 + 50,
        canvas.width/2 - 50,
        canvas.height/2 + 50
    ));
    simContainer.elements.push(new Wire(
        canvas.width/2 + 100,
        canvas.height/2 + 50,
        canvas.width/2 + 50,
        canvas.height/2 + 50
    ));
}

function addRC(simContainer) {
    simContainer.elements.push(new Battery(
        canvas.width/2,
        canvas.height/2 + 50,
        10
    ));
    simContainer.elements.push(new Resistor(
        canvas.width/2 + 50,
        canvas.height/2 - 50,
        1
    ));
    simContainer.elements.push(new Capacitor(
        canvas.width/2 - 50,
        canvas.height/2 - 50,
        0.1,
        0
    ));
    simContainer.elements.push(new Wire(
        canvas.width/2 - 100,
        canvas.height/2 - 50,
        canvas.width/2 - 100,
        canvas.height/2 + 50
    ));
    simContainer.elements.push(new Wire(
        canvas.width/2 + 100,
        canvas.height/2 - 50,
        canvas.width/2 + 100,
        canvas.height/2 + 50
    ));
    simContainer.elements.push(new Wire(
        canvas.width/2 - 100,
        canvas.height/2 + 50,
        canvas.width/2 - 50,
        canvas.height/2 + 50
    ));
    simContainer.elements.push(new Wire(
        canvas.width/2 + 100,
        canvas.height/2 + 50,
        canvas.width/2 + 50,
        canvas.height/2 + 50
    ));
}

function addRL(simContainer) {
    simContainer.elements.push(new Battery(
        canvas.width/2,
        canvas.height/2 + 50,
        10
    ));
    simContainer.elements.push(new Resistor(
        canvas.width/2 + 50,
        canvas.height/2 - 50,
        1
    ));
    simContainer.elements.push(new Inductor(
        canvas.width/2 - 50,
        canvas.height/2 - 50,
        0.5
    ));
    simContainer.elements.push(new Wire(
        canvas.width/2 - 100,
        canvas.height/2 - 50,
        canvas.width/2 - 100,
        canvas.height/2 + 50
    ));
    simContainer.elements.push(new Wire(
        canvas.width/2 + 100,
        canvas.height/2 - 50,
        canvas.width/2 + 100,
        canvas.height/2 + 50
    ));
    simContainer.elements.push(new Wire(
        canvas.width/2 - 100,
        canvas.height/2 + 50,
        canvas.width/2 - 50,
        canvas.height/2 + 50
    ));
    simContainer.elements.push(new Wire(
        canvas.width/2 + 100,
        canvas.height/2 + 50,
        canvas.width/2 + 50,
        canvas.height/2 + 50
    ));
}

function addRLC(simContainer) {
    simContainer.elements.push(new Battery(
        canvas.width/2,
        canvas.height/2 + 50,
        10
    ));
    simContainer.elements.push(new Resistor(
        canvas.width/2 + 100,
        canvas.height/2 - 50,
        1
    ));
    simContainer.elements.push(new Inductor(
        canvas.width/2,
        canvas.height/2 - 50,
        0.5
    ));
    simContainer.elements.push(new Capacitor(
        canvas.width/2 - 100,
        canvas.height/2 - 50,
        0.01,
        0
    ));
    simContainer.elements.push(new Wire(
        canvas.width/2 - 150,
        canvas.height/2 - 50,
        canvas.width/2 - 150,
        canvas.height/2 + 50
    ));
    simContainer.elements.push(new Wire(
        canvas.width/2 + 150,
        canvas.height/2 - 50,
        canvas.width/2 + 150, 
        canvas.height/2 + 50
    ));
    simContainer.elements.push(new Wire(
        canvas.width/2 - 50,
        canvas.height/2 + 50,
        canvas.width/2 - 150,
        canvas.height/2 + 50
    ));
    simContainer.elements.push(new Wire(
        canvas.width/2 + 50,
        canvas.height/2 + 50,
        canvas.width/2 + 150,
        canvas.height/2 + 50
    ));
}

export { addSeries, addParallel, addSeriesSwitch, addRC, addRL, addRLC };
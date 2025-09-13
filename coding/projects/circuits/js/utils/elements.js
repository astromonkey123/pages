import { Battery, Wire, Resistor, Capacitor, Inductor, Switch } from '../components/Element.js';

function addElement(simContainer, type) {
    if (type == 'battery') {
        addBattery(simContainer);
    } else if (type == 'resistor') {
        addResistor(simContainer);
    } else if (type == 'capacitor') {
        addCapacitor(simContainer);
    } else if (type == 'inductor') {
        addInductor(simContainer);
    } else if (type == 'wire') {
        addWire(simContainer);
    } else if (type == 'switch') {
        addSwitch(simContainer);
    }
    simContainer.updateLinks();
}

function addBattery(simContainer) {
    simContainer.elements.push(new Battery(
        canvas.width/2,
        canvas.height/2 + 100,
        1
    ));
}

function addWire(simContainer) {
    simContainer.elements.push(new Wire(
        canvas.width/2 - 50,
        canvas.height/2 - 100,
        canvas.width/2 + 50,
        canvas.height/2 - 100
    ));
}

function addResistor(simContainer) {
    simContainer.elements.push(new Resistor(
        canvas.width/2,
        canvas.height/2 + 50,
        1
    ));
}

function addCapacitor(simContainer) {
    simContainer.elements.push(new Capacitor(
        canvas.width/2,
        canvas.height/2,
        0.001,
        0
    ));
}

function addInductor(simContainer) {
    simContainer.elements.push(new Inductor(
        canvas.width/2, 
        canvas.height/2 - 50, 
        1
    )); 
}

function addSwitch(simContainer) {
    simContainer.elements.push(new Switch(
        canvas.width/2,
        canvas.height/2
    ));
}

export { addElement };
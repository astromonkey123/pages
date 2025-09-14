import { Circuit, CircuitData } from '../components/Circuit.js';
import { SimContainer, GraphContainer } from '../components/Container.js';
import { Battery, Wire, Resistor, Capacitor, Inductor, Switch } from '../components/Element.js';
import { Link } from '../components/Link.js';

import { simContainer, graphContainer, dt } from './app.js';

function simulatePeriodic() {
    updateCircuits();
    updateMemberCircuits();
    simulateTimeStep()

    for (const element of simContainer.elements) {
        stepElement(element);
    }
}

function updateCircuits() {
    const found_circuits = findCircuits(simContainer.elements);

    const revised_circuits = removeDuplicates(found_circuits, simContainer.circuits);

    simContainer.circuits = revised_circuits
}

function findCircuits(elements) {
    let circuits = [];
    
    for (let start_element of elements) {        
        let circuit = findLoop([start_element], [false], start_element.link1, 0);

        if (circuit !== null) circuits.push(circuit);
    }

    return circuits;
}

function findLoop(loop, directions, current_node, iter) {
    if (iter > 10) return null;
    if (current_node.links.length == 0) return null;

    // Base case
    if (loop.length > 0) {
        if (current_node.links.includes(loop[0].link2)) {
            return new Circuit(loop, directions);
        }
    }

    const next_node = current_node.links[0].sibling;
    const next_direction = (next_node == next_node.parent.link2);

    const new_loop = [...loop, next_node.parent];
    const new_directions = [...directions, next_direction];

    // Recursion
    return findLoop(new_loop, new_directions, next_node, iter+1);
}

function removeDuplicates(found_circuits, existing_circuits) {
    let circuits = [];

    // Add existing circuits that have been found
    for (const existing_circuit of existing_circuits) {
        let isFound = false;

        for (const found_circuit of found_circuits) {
            isFound = isFound || hasSameElements(found_circuit, existing_circuit);
        }

        if (isFound) circuits.push(existing_circuit);
    }

    // Add new circuits that don't previously exist
    for (const found_circuit of found_circuits) {
        let alreadyExists = false;

        for (const circuit of circuits) {
            alreadyExists = alreadyExists || hasSameElements(found_circuit, circuit);
        }

        if (!alreadyExists) circuits.push(found_circuit);
    }

    return circuits;
}

function hasSameElements(circuit_1, circuit_2) {
    const checkContainment = (loop_1, loop_2) => {
        for (let element of loop_1) {
            if (!loop_2.includes(element)) return false;
        }

        return true;
    };

    return checkContainment(circuit_1.elements, circuit_2.elements) && checkContainment(circuit_2.elements, circuit_1.elements);
}

function updateMemberCircuits() {
    // Go through each element and reset it's circuit list
    for (const element of simContainer.elements) {
        element.circuits = [];
    }

    // Go through each circuit and add itself to the circuit list of each element
    for (const circuit of simContainer.circuits) {
        for (const element of circuit.elements) {
            element.circuits.push(circuit);
        }
    }
}

function simulateTimeStep() {
    let previous_currents = [];
    let previous_integrals = [];
    for (let circuit of simContainer.circuits) {
        previous_currents.push(circuit.current);
        previous_integrals.push(circuit.current_idt);
    }

    // Recalculate current five times for accuracy
    for (let i = 0; i < simContainer.circuits.length; i++) {
        let circuit = simContainer.circuits[i];   
        let current = stepCircuit(circuit);

        circuit.current = current;
        circuit.current_ddt = (current - previous_currents[i]) / dt;
        circuit.current_idt = previous_integrals[i] + ( current * dt );
    }

    for (let circuit of simContainer.circuits) {
        circuit.elapsed_time = (Math.round(circuit.elapsed_time / dt) * dt) + dt;
        circuit.data.currents.push(circuit.current);
        circuit.data.times.push(circuit.elapsed_time);
    }
}

function stepCircuit(circuit){
    let delta_v_functions = [];

    for (let i = 0; i < circuit.elements.length; i++) {
        const element = circuit.elements[i];
        const direction = circuit.directions[i];
        if (element.type == 'battery') {
            
            if (direction) {
                delta_v_functions.push(current => -element.emf);
            } else {
                delta_v_functions.push(current => element.emf);
            }

        } else if (element.type == 'resistor') {
            let other_currents = 0;

            for (let other_circuit of element.circuits) {
                if (circuit == other_circuit) { continue }
                other_currents += other_circuit.current;
            }

            delta_v_functions.push(current => -(other_currents + current) * element.resistance);

        } else if (element.type == 'inductor') {
            let other_derivatives = 0;

            for (let other_circuit of element.circuits) {
                if (circuit == other_circuit) { continue }
                other_derivatives += other_circuit.current_ddt;
            }

            delta_v_functions.push(current => -( other_derivatives + ( (current - circuit.current) / dt ) ) * element.inductance);
        
        } else if (element.type == 'capacitor') {

            delta_v_functions.push(current => -element.current_idt / element.capacitance);
    
        } else if (element.type == 'switch') {
            
            if (!element.state) return 0;
        
        }
    }

    function delta_v(current) {
        let total_delta_v = 0;
        for (let delta_v_function of delta_v_functions) {
            total_delta_v += delta_v_function(current);
        }
        return total_delta_v;
    }

    const slope = (delta_v(1) - delta_v(0));
    const current = delta_v(0) / -slope;

    return current
}

function stepElement(element) {
    if (element.circuits.length == 0) {
        if (element.type == 'resistor') {
            element.current = 0;
        } else if (element.type == 'inductor') {
            element.current_ddt = 0;
        } else if (element.type == 'capacitor') {
            element.current_idt = element.current_idt;
        }
        return null;
    }

    if (element.type == 'resistor') {
        element.current = 0;
        for (let circuit of element.circuits) {
            element.current += circuit.current;
        }

    } else if (element.type == 'inductor') {
        element.current_ddt = 0;
        for (let circuit of element.circuits) {
            element.current_ddt += circuit.current_ddt;
        }

    } else if (element.type == 'capacitor') {
        // element.current_idt = 0;
        for (let circuit of element.circuits) {
            element.current_idt += circuit.current * dt;
        }

    }
}

export { simulatePeriodic }
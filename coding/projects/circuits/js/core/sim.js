import { Circuit, CircuitData } from '../components/Circuit.js';
import { SimContainer, GraphContainer } from '../components/Container.js';
import { Battery, Wire, Resistor, Capacitor, Inductor } from '../components/Element.js';
import { Link } from '../components/Link.js';

import { simContainer, graphContainer, dt } from './app.js';

export function simulate_periodic() {
    let found_circuits = find_circuits(simContainer.elements);

    let revised_circuits = filter_circuits(simContainer.circuits, found_circuits)

    simContainer.circuits = revised_circuits;

    for (let element of simContainer.elements) {
        element.circuits = [];
    }

    for (let circuit of simContainer.circuits) {
        for (let element of circuit.elements) {
            element.circuits.push(circuit);
        }
    }
    
    let previous_currents = [];
    let previous_integrals = [];
    for (let circuit of simContainer.circuits) {
        previous_currents.push(circuit.current);
        previous_integrals.push(circuit.current_idt);
    }

    // Recalculate current five times for accuracy
    for (let n = 1; n < 5; n++) {
        for (let i = 0; i < simContainer.circuits.length; i++) {
            let circuit = simContainer.circuits[i];   
            let current = step_sim(circuit);

            circuit.current = current;
            circuit.current_ddt = (current - previous_currents[i]) / dt;
            circuit.current_idt = previous_integrals[i] + ( current * dt );
        }
    }

    for (let circuit of simContainer.circuits) {
        circuit.elapsed_time = (Math.round(circuit.elapsed_time / dt) * dt) + dt;
        circuit.data.currents.push(circuit.current);
        circuit.data.times.push(circuit.elapsed_time);
    }

    for (let element of simContainer.elements) {
        step_object(element);
    }
}

function filter_circuits(existing_circuits, found_circuits) {
    if (existing_circuits.length === 0) {
        return found_circuits;
    }

    let revised_circuits = [];

    for (let existing_circuit of existing_circuits) {
        let discovered = false; // Does the circuit still exist?

        for (let found_circuit of found_circuits) {
            if (check_equality(existing_circuit.elements, found_circuit.elements)) {
                discovered = true;
            }
        }
        // If it has been discovered, add it to the new list of circuits
        if (discovered) {
            revised_circuits.push(existing_circuit)
        }
    }

    let new_circuits = [];

    for (let found_circuit of found_circuits) {
        let already_exists = false;

        for (let existing_circuit of existing_circuits) {
            if (check_equality(existing_circuit.elements, found_circuit.elements)) {
                already_exists = true;
            }
        }

        // If it doesn't already exist, add it to the new list of circuits
        if (!already_exists) {
            new_circuits.push(found_circuit);
        }
    }

    revised_circuits.push(...new_circuits);

    return revised_circuits
}
                         
function check_equality(loop1, loop2) {
    const check_containment = (loop1, loop2) => {
        for (let element of loop1) {
            if (!loop2.includes(element)) { return false; }
        }

        return true;
    };

    return check_containment(loop1, loop2) && check_containment(loop2, loop1);
}

function find_circuits(elements) {
    let loops = [];

    for (let start_element of elements) {        
        let acting_loop = find_loop([start_element], start_element.link1, 0);

        if (acting_loop === null) { continue; }

        let is_unique = true;
        for (let loop of loops) {
            if (check_equality(acting_loop, loop)) { is_unique = false; }
        }

        if (is_unique) { loops.push(acting_loop) }
    }

    // Convert loops to circuits
    let circuits = [];

    for (let loop of loops) {
        circuits.push(new Circuit(loop));
    }

    return circuits;
}

function find_loop(loop, current_node, iter) {
    if (iter > 10) { return null; } // Prevent recursion overflow

    if (current_node.links.length === 0) { return null; } // If there are no more links, there is no complete loop

    // If the current node is linked to the first element's other connection
    if (current_node.links.includes(loop[0].link2)) {
        return loop;
    }

    // Follow the first link and hop to its sibling
    const next_node = current_node.links[0].sibling;
    return find_loop([...loop, next_node.parent], next_node, iter + 1);
}

function step_sim(circuit) {
    let delta_v_functions = [];

    for (let element of circuit.elements) {
        if (element.type == 'battery') {
            delta_v_functions.push(current => element.emf);
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
            delta_v_functions.push(current => -(element.current_idt + (circuit.current * dt)) / element.capacitance);
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

function step_object(element) {
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
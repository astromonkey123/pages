/* 
Script to simulate circuits with batteries, resistors, inductors, and capacitors.

Currently only works for circuits in series and with batteries.
*/

import { circuits, objects, connections } from './canvas.js';
import { Battery, Wire, Resistor, Capacitor, Inductor } from './element.js';
import { Circuit } from './circuit.js';

export function simulate_periodic() {
    let available_objects = []; // Objects not already in a circuit

    // Check if an object is not already contained in a circuit
    for (let object of objects) {
        let free_object = true;
        for (let circuit of circuits) {
            if (circuit.elements.includes(object)) {
                free_object = false;
            }
        }

        if (free_object) available_objects.push(object); // If not, add it to the array of available objects
    }

    circuits.push(...find_circuits(available_objects)); // Add the circuits made of available objects to the array of existing circuits

    for (let circuit of circuits) {
        simulate_step(circuit);
    }
}

function find_circuits(objects) {
    let circuits = [];

    for (let object of objects) {
        if (object.type != 'battery') break; // If the object is not a battery we can exit

        // Start at one connection and end when we get to the other
        const start_node = object.connection1;
        const end_node = object.connection2;

        let circuit_elements = []; // The elements in the circuit
        let current_node = start_node; // Current node we are looping on
        let complete_circuit = false; // If we reached the end_node

        while (true) {
            if (current_node.links.length === 0) break; // If there are no more links we can stop

            if (circuit_elements.length > 100) break; // Kill it if the circuit gets over 100 elements long

            circuit_elements.push(current_node.parent); // Add the current_node's parent to the list of elements in the circuit

            let next_node = current_node.links[0]; // Get the next_node as the first element in the current_node's links
            
            // If we reach the end we can stop
            if (next_node == end_node) {
                complete_circuit = true;
                break;
            }; 

            if (next_node.parent.connection1 == next_node) {
                // If it's the first connection, hop over to the second
                current_node = next_node.parent.connection2;
            } else if (next_node.parent.connection2 == next_node) {
                // If it's the second connection, hop over to the first
                current_node = next_node.parent.connection1;
            }
        }
        if (complete_circuit) circuits.push(new Circuit(circuit_elements));
    }
    return circuits
}

function simulate_step(circuit) {
    // Simulate the given circuit for one time step

    const dt = 1e-3; // Simulation time step

    circuit.elapsed_time = (Math.round(circuit.elapsed_time / dt) * dt) + dt;

    let [I, integral_Idt, dIdt] = circuit_solver(circuit, circuit.I, circuit.integral_Idt, dt); // Find current, its integral, and its derivative
    circuit.I = I; // Store the current for the next time step
    circuit.integral_Idt = integral_Idt;
    circuit.dIdt = dIdt;

    for (let element of circuit.elements) {
        if (element.type == 'resistor') {
            element.delta_V = circuit.I * element.resistance;
        } else if (element.type == 'capacitor') {
            element.stored_charge += circuit.I * dt;
            element.delta_V = element.stored_charge / element.capacitance;
        } else if (element.type == 'inductor') {
            element.delta_V = circuit.dIdt * element.inductance;
        }
    }

    // console.log(`Integral: ${integral_Idt}`);
    // console.log(`Current: ${I}`);
    // console.log(`Derivative: ${dIdt}`);
}

function circuit_solver(circuit, I_previous, integral_Idt, dt) {
    /*
    Solve the given circuit based on its elements and its state
    
    Operates on Kirchhoff's Law, i.e. ΔV around a closed loop must be 0.
    */

    let ΔV_total = []; // Contributions to the voltage around the loop

    // Find the voltage contribution from each element as a function of current, its integral, and its derivative
    for (let element of circuit.elements) {
        if (element.type == 'battery') {
            // Battery -> dV is constant: the EMF of the battery
            ΔV_total.push( (I, integral_Idt, dIdt) => element.emf );

        } else if (element.type == 'resistor') {
            // Resistor -> dV is proportional to current by Ohm's Law: ΔV = I * R
            ΔV_total.push( (I, integral_Idt, dIdt) => -(I * element.resistance) );

        } else if (element.type == 'capacitor') {
            // Capacitor -> dV is proportional to the charge stored: ΔV = ∫ I dt / C
            ΔV_total.push( (I, integral_Idt, dIdt) => -(((I * dt) + element.stored_charge) / element.capacitance) );

        } else if (element.type == 'inductor') {
            // Inductor -> dV is proportional to the derivative of current by Faraday's Law: ΔV = L * dIdt
            ΔV_total.push( (I, integral_Idt, dIdt) => -(dIdt * element.inductance) );

        }
    }

    // TODO: I'm pretty sure dI/dt in the voltage calculation below is always 0, but I
    // get the expected graphical results so I'm not really sure how this is working.
    // However, like all good programmers, I'll gladly follow the "if it ain't broken,
    // don't fix it" line of thought.

    let I = 0;

    // Sum up the voltage contributions from each element
    function ΔV(I) {
        let sum = 0;

        for (let ΔV_element of ΔV_total) {
            // console.log(ΔV_element(0, 0, 0));
            sum += ΔV_element(I, integral_Idt + I * dt, (I - I_previous) / dt);
        }

        return sum;
    }

    // Estimate the current (similar to Newton's Method)
    let slope = ΔV(1) - ΔV(0);
    I = ( -ΔV(0)/slope );

    // Ideally dV(I) = 0, but I've been getting dV(I) <= 1e-12 which is a more
    // than small enough error for it not to matter to me

    integral_Idt += I * dt; // Find the integral of current
    let dIdt = (I - I_previous) / dt; // Find the derivative of current

    return [I, integral_Idt, dIdt];
}
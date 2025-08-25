import { Circuit, CircuitData } from '../components/Circuit.js';
import { SimContainer, GraphContainer } from '../components/Container.js';
import { Battery, Wire, Resistor, Capacitor, Inductor, Switch } from '../components/Element.js';
import { Link } from '../components/Link.js';

import { simContainer, graphContainer, dt } from './app.js';
import { formatValue } from '../utils/prefixes.js';
import { rainbow, highlight, light, dark } from '../utils/colors.js';

function drawGraph() {
    const graph = graphContainer.canvas;
    const ctx = graphContainer.ctx;

    for (const circuit of simContainer.circuits) {
        while (circuit.data.currents.length > graphContainer.num_times * ( 3/4 )) {
            circuit.data.currents.shift();
            circuit.data.times.shift();
        }
    }

    if (simContainer.circuits.length == 0) {
        graphContainer.height_scale = 0;
    } else {
        let limits = [];
        for (const circuit of simContainer.circuits) {
            const max_current = Math.max( ...circuit.data.currents );
            const min_current = Math.min( ...circuit.data.currents );
            limits.push( Math.max( Math.abs( max_current ), Math.abs( min_current ) ) );
        }
        graphContainer.updateScale( Math.max( ...limits ) );
    }
    
    // Clear the graph
    ctx.clearRect(0, 0, graph.width, graph.height);

    // Draw the horizontal lines
    ctx.fillStyle = light;
    ctx.strokeStyle = light;
    ctx.save();
    ctx.translate(0, graph.height/2);
    for (let h = -graph.height/3; h <= graph.height/3; h += graph.height/6) {
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(graph.width * (3/4), h);
        ctx.stroke();
    }
    ctx.restore();

    const max_width = graph.width * 3/4;

    for (let i = 0; i < simContainer.circuits.length; i++) {
        const circuit = simContainer.circuits[i];
        plot(ctx, circuit.data.times, circuit.data.currents, max_width, i);
    }

    // Plot the time increments
    ctx.save();
    ctx.translate(0, graph.height/2);
    ctx.beginPath();
    ctx.fillStyle = light;
    ctx.strokeStyle = light;
    ctx.font = "18px serif";
    for (let time_step = 0; time_step < 4; time_step ++) {
        const position = time_step * 250 * graphContainer.spacing;
        if (time_step != 3) {
            ctx.beginPath();
            ctx.moveTo(max_width - position, graph.height/2);
            ctx.lineTo(max_width - position, -graph.height/2);
            ctx.stroke();
        }
        ctx.fillText("t+" + (time_step * 250 * dt).toFixed(2) + "s", max_width - position + 4, graph.height/2 - 4);
    }

    ctx.restore();

    const display_current = 1 / graphContainer.height_scale;
    const display_text = formatCurrent(display_current);

    ctx.save();
    ctx.translate(0, graph.height/2);
    ctx.fillStyle = light;
    ctx.strokeStyle = light;
    ctx.font = "18px serif";
    ctx.fillText( display_text, 6, -graph.height/2 + 18 );
    ctx.restore();
}

function plot(ctx, times, currents, max_width, i) {
    const getHeight = (current) => -(2/3) * current * graphContainer.height_scale * graph.height/2;

    // Plot the current
    ctx.fillStyle = rainbow[i % rainbow.length];
    ctx.strokeStyle = rainbow[i % rainbow.length];
    ctx.lineWidth = 2;
    ctx.save();
    ctx.translate(0, graph.height/2);
    ctx.beginPath();
    ctx.moveTo( max_width,  getHeight( currents.at(-1) ) );
    for (let x = 1; x < currents.length; x++) {
        ctx.lineTo(max_width - ((x + 1) * graphContainer.spacing), getHeight( currents.at(-x) ));
    }
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(max_width, getHeight( currents.at(-1) ));
    ctx.font = "18px serif";
    ctx.fillText(formatValue(currents.at(-1), "A", 3), 6, graph.height/2 + 5);
    ctx.restore();
    ctx.lineWidth = 1;
}

function formatCurrent(current) {
    let display_text = "";

    if (current == Infinity) {
        display_text = "0A";
    } else if (current <= 1e12 && current >= 1e-12) {
        display_text = formatValue(current, "A", null);
    } else {
        const scaling = ( 1 / (graphContainer.height_scale *  (Math.pow(10, Math.floor( Math.log10( current ) ) ) ) ) ).toFixed(3)
        const exponential = Math.floor( Math.log10( current ) );
        display_text = scaling + "e" + exponential + "A";
    }

    return display_text;
}

export { drawGraph };
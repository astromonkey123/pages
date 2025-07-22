import { circuits, objects, connections } from './canvas.js';

const graph = document.getElementById('graph');
const ctx = graph.getContext('2d');

let currents = [0];
let times = [0]

export function resetGraph() {
    currents = [0];
    times = [0];
}

export function graphAll() {
    if (circuits.length !== 0) {
        currents.push(circuits[0].I);
        times.push(circuits[0].elapsed_time);

    }

    ctx.clearRect(0, 0, graph.width, graph.height);

    let height_increment = 2;
    let height_scale = 1 / ( ( Math.ceil(Math.max(...currents) / height_increment) ) * height_increment );

    let num_times = 1000;
    let spacing = graph.width / num_times;

    while (currents.length > num_times) {
        currents.shift();
        times.shift();
    }

    draw_grid();

    // Draw current graph
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.save();
    ctx.translate(0, graph.height/2);
    ctx.beginPath();
    ctx.moveTo(0, -(2/3) * currents[0] * height_scale * graph.height/2);
    for (let x = 1; x < currents.length; x++) {
        ctx.lineTo((x + 1) * spacing, -(2/3) * currents[x] * height_scale * graph.height/2);
    }
    ctx.stroke();

    // Draw time lines
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.font = "18px serif";
    for (let x = 0; x < currents.length; x++) {
        if (times[x] % 0.25 == 0) {
            ctx.moveTo(x * spacing, graph.height/2);
            ctx.lineTo(x * spacing, -graph.height/2);
            ctx.fillText(times[x].toFixed(3) + "s", x * spacing + 4, graph.height/2 - 4);
        }
    }
    ctx.fillText((1/height_scale) + "A", 6, -graph.height/2 + 18);
    ctx.stroke();

    ctx.restore();
}

function draw_grid() {
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.save();
    ctx.translate(0, graph.height/2);
    for (let h = -graph.height/3; h <= graph.height/3; h += graph.height/6) {
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(graph.width, h);
        ctx.stroke();
    }
    ctx.restore();
}
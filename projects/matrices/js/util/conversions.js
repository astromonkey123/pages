import { gridContainer } from '../core/app.js';

// Convert a pixel position to coordinates
function pixelsToCoords(w, h) {
    const x_0 = (w - gridContainer.canvas.width/2) / gridContainer.coordScale;
    const y_0 = -(h - gridContainer.canvas.height/2) / gridContainer.coordScale;

    return [x_0 - gridContainer.offsetX, y_0 - gridContainer.offsetY];
}

// Convert coordinates to a pixel position
function coordsToPixels(x, y) {
    const w_0 = (x + gridContainer.offsetX) * gridContainer.coordScale;
    const h_0 = -(y + gridContainer.offsetY) * gridContainer.coordScale

    return [w_0 + gridContainer.canvas.width/2, h_0 + gridContainer.canvas.height/2];
}

// Convert hex color codes to RGB
function hexToRGB(hex) {
    const chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];

    let red = ( 16 * chars.indexOf(hex[1]) ) + chars.indexOf(hex[2]);
    let green = ( 16 * chars.indexOf(hex[3]) ) + chars.indexOf(hex[4]);
    let blue = ( 16 * chars.indexOf(hex[5]) ) + chars.indexOf(hex[6]);

    return [red, green, blue];
}

export { pixelsToCoords, coordsToPixels, hexToRGB };
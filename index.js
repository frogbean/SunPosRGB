const {pClock} = require("PigeonClock");

let colors;

function hexUse(colors_to_use) {
    colors = colors_to_use;
}

function hexNow(time = new Date()) {
    const pclk = globalThis?.debug ? 1.9 : pClock(time);

    let start, next;
    let startPos, nextPos;
    for(const color of colors) {

        if(start) {
            next = color.color;
            nextPos = color.start;
            break;
        }

        if(pclk >= color.start || pclk >= color?.end) {
            start = color.color;
            startPos = color.start;
            if(color.end) {
                next = color.color;
                nextPos = color.end;
                break;
            }
        }
    }

    if(globalThis?.debug) {
        console.log("start", start);
        console.log("next", next);
        console.log("startPos", startPos);
        console.log("nextPos", nextPos);
        console.log("pclk", pclk);
    }

    return hex_gradient(start, next, startPos, nextPos, pclk);
}

function hex_gradient(startHex, endHex, startPos, endPos, currentPos) {

    if(!startHex || !endHex || !startPos || !endPos || !currentPos) return '#0000E1'

    if(startPos === endPos) return startHex;
    // Convert hexadecimal color strings to integers
    startHex = startHex.replace('#', '');
    endHex = endHex.replace('#', '');

    if(endPos <= startPos) {
        if(globalThis?.debug) console.log("Adjusting positions...");
        endPos += 2;
        if(globalThis?.debug) console.log("endPos:", endPos);
        if(currentPos <= startPos) {
            currentPos += 2;
            if(globalThis?.debug) console.log("currentPos:", currentPos);
        }
    }

    const startColor = {
        R:parseInt(startHex.slice(0, 2), 16),
        G:parseInt(startHex.slice(2, 4), 16),
        B:parseInt(startHex.slice(4, 6), 16),
    };
    const endColor = {
        R:parseInt(endHex.slice(0, 2), 16),
        G:parseInt(endHex.slice(2, 4), 16),
        B:parseInt(endHex.slice(4, 6), 16),
    };
    const phase = (currentPos - startPos) / (endPos - startPos);
    // Calculate the interpolated color
    let hexCode = "#";
    for(const C in startColor) {
        const sc = startColor[C], ec = endColor[C];
        const fc = sc - ((sc-ec) * phase);
        hexCode += Math.round(fc).toString(16).toUpperCase().padStart(2, '0');
    }
    return hexCode;
}

module.exports = { hexNow, hexUse, pClock }
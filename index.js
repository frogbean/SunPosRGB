const {pClock} = require("PigeonClock");
let colors = require("./colors.json");

function hexUse(dir) {
    try {
        colors = require(dir);
    } catch (err) {
        console.error(err);
    }
}

function hexNow(time = new Date()) {
    const pclk = pClock(time);

    let start, next, getNext = false;
    let startPos, nextPos;
    for(const color of colors) {

        if(getNext) {
            getNext = false;
            next = color.color;
            nextPos = color.start;
        }

        if(pclk >= color.start) {
            start = color.color;
            startPos = color.start;
            if(color.end) {
                next = color.color;
                nextPos = color.end;
            } else {
                getNext = true;
            }
        }
    }
    return hex_gradient(start, next, startPos, nextPos, pclk);
}

function hex_gradient(startHex, endHex, startPos, endPos, currentPos) {

    if(startPos === endPos) return startHex;
    // Convert hexadecimal color strings to integers
    startHex = startHex.replace('#', '');
    endHex = endHex.replace('#', '');

    if(endPos <= startPos) {
        endPos += 2;
        if(currentPos <= startPos)
        currentPos += 2;
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

module.exports = { hexNow, hexUse }
"use strict";

// Query String Resolver
var params = {};
window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,
  function (str, key, value) {
    params[key] = value;
});

/**
 * Field variables
 */
const clockCanvas = document.getElementById("clockface");
const context = clockCanvas.getContext("2d");
const ClockFaceOffset = Object.freeze({
  "ONE":    { x: 5, y: -2, deg: 30 },
  "TWO":    { x: 7, y: -2, deg: 60 },
  "THREE":  { x: 9, y: 3, deg: 90 },
  "FOUR":   { x: 9, y: 7, deg: 120 },
  "FIVE":   { x: 5, y: 11, deg: 150 },
  "SIX":    { x: 0, y: 13, deg: 180 },
  "SEVEN":  { x: -5, y: 11, deg: 210 },
  "EIGHT":  { x: -9, y: 10, deg: 240 },
  "NINE":   { x: -9, y: 4, deg: 270 },
  "TEN":    { x: -7, y: -2, deg: 300 },
  "ELEVEN": { x: -5, y: -2, deg: 330 },
  "TWELVE": { x: 0, y: -4, deg: 0 }
});

/**
 * Functions
 */

/**
 * Draws red clock foreground.
 * @param {HTMLElement} canvas Canvas to get width and height
 * @param {CanvasRenderingContext2D} context Context to draw into
 * @param {Number} centerLocX Clock center X position
 * @param {Number} centerLocY Clock center Y position
 * @param {Number} radius Clock radius
 * @param {Number} arc_degree Clock arc degree
 */
function drawRedClockForeground(canvas, context, centerLocX, centerLocY, radius, arc_degree) {
  let beginDegrees = 0
  let endDegrees = arc_degree

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "red";
  context.beginPath();
  
  // Begins from center
  if(endDegrees != 360)
    context.moveTo(centerLocX, centerLocY);

  // Center point -> Arc -> Arc Endpoint
  context.arc(centerLocX, centerLocY, radius, (beginDegrees - 90) / 180 * Math.PI, (endDegrees - 90) / 180 * Math.PI, false);
  context.fill();
  
  // Arc Endpoint -> Center
  if(endDegrees != 360)
    context.lineTo(centerLocX, centerLocY);
  context.stroke();
}

/**
 * Draws clock face into given clock time location.
 * @param {CanvasRenderingContext2D} context Context to draw into
 * @param {Number} centerLocX Clock center X position
 * @param {Number} centerLocY Clock center Y position
 * @param {Number} radius Clock radius
 * @param {Number} direction Clock radius
 * @param {String} text Text to draw into
 */
function drawClockFace(context, centerLocX, centerLocY, radius, direction, text) {
  let faceOffset = ClockFaceOffset[direction];
  let clockSpitPosition = getClockspitLocation(centerLocX, centerLocY, radius, faceOffset.deg);

  // Set font and draw at (Clock spit pos + affset pos)
  context.font = "12px Arial";
  context.fillStyle = "black";
  context.textAlign = "center";
  context.fillText(
    text,
    clockSpitPosition.x + faceOffset.x,
    clockSpitPosition.y + faceOffset.y
  );
}

/**
 * Get clock spit position on given degree.
 * @param {Number} centerLocX Clock center X position
 * @param {Number} centerLocY Clock center Y position
 * @param {Number} radius Clock radius
 * @param {Number} degree Clock spit location degree
 */
function getClockspitLocation(centerLocX, centerLocY, radius, degree) {
  return {
    x: centerLocX + Math.cos((degree - 90) * Math.PI / 180) * radius,
    y: centerLocY + Math.sin((degree - 90) * Math.PI / 180) * radius
  }
}


/**
 * Main execution
 */
const ClockInfo = Object.freeze({
  Center: {
    X: clockCanvas.width / 2,
    Y: clockCanvas.height / 2
  },
  Radius: 90
});

let clockTime = parseInt(params.time);
let clockTimeEachSpit = clockTime / 12;

drawRedClockForeground(
  clockCanvas,
  context,
  ClockInfo.Center.X,
  ClockInfo.Center.Y,
  ClockInfo.Radius,
  360
);

let clockSpitText = clockTimeEachSpit;
Object.keys(ClockFaceOffset).forEach((offsetName, offsetIndex) => {
  drawClockFace(
    context,
    ClockInfo.Center.X,
    ClockInfo.Center.Y,
    ClockInfo.Radius,
    offsetName,
    clockSpitText.toString()
  );

  clockSpitText += clockTimeEachSpit;
});

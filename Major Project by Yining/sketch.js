let canvasWidth, canvasHeight;
const canvasRatio = 2 / 3; // The aspect ratio of the canvas is set to be 2:3.

let dayDuration = 480;  // Duration of each phase in frames, e.g., 480 frames per phase.
let phase = 1;  // Current phase indicator.
let timer = 0;  // Timer variable for tracking time or frame count.

// Apple size variables
let appleSize = 200;
let appleRadius = appleSize / 2;
let bigAppleScale = 1;
let smallAppleScale = 0.6;

// Array of coordinates for the center of the apples, each object contains an x and y coordinate.
let bigAppleCenters = [
  { x: 400, y: 324 },
  { x: 300, y: 500 },
  { x: 400, y: 841 },
  { x: 500, y: 1020 },
  { x: 850, y: 1000 },
  { x: 900, y: 1314 },
  { x: 1330, y: 810 },
  { x: 1700, y: 765 },
];

let smallAppleCenters = [
  { x: 400, y: 628 },
  { x: 500, y: 694 },
  { x: 559, y: 800 },
  { x: 530, y: 1180 },
  { x: 628, y: 1250 },
  { x: 750, y: 1250 },
  { x: 750, y: 735 },
  { x: 800, y: 846 },
  { x: 850, y: 1160 },
  { x: 950, y: 870 },
  { x: 1050, y: 1250 },
  { x: 1050, y: 800 },
  { x: 1210, y: 1070 },
  { x: 1140, y: 1170 },
  { x: 1263, y: 960 },
  { x: 1450, y: 700 },
  { x: 1530, y: 610 },
  { x: 1820, y: 655 },
  { x: 1650, y: 610 },
  { x: 1910, y: 572 },
];


// Set up the canvas.
function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateCanvasSize();
}


// Draw the elements on the canvas.
function draw() {
  // Call the function corresponding to the current phase.
  switch (phase) {
    case 1:
      dayPhase();
      break;
    case 2:
      sunsetPhase();
      break;
    case 3:
      nightPhase();
      break;
    case 4:
      dawnPhase();
      break;
  }

  // Update the timer and phase.
  updateTimerAndPhase();

  // Draw the static elements.
  drawBackground();

  // Draw apples.
  drawApples(bigAppleCenters, bigAppleScale);
  drawApples(smallAppleCenters, smallAppleScale);
}


// A function to draw the day phase with the sun at its brightest.
function dayPhase() {
  const dayColor = color(243, 240, 231); // Daytime color
  const dayPlanet = new Planet(1, lerp(0, 255, timer / dayDuration), 245, 135, 26);
  drawPhase(dayColor, dayPlanet);
}


// A function to draw the sunset phase with the sun setting.
function sunsetPhase() {
  const sunsetColor = lerpColor(color(243, 240, 231), color(18, 24, 46), timer / dayDuration);
  const sunsetPlanet = new Planet(2, lerp(255, 0, timer / dayDuration), 245, 135, 26);
  drawPhase(sunsetColor, sunsetPlanet);
}


// A function to draw the night phase with the moon and stars.
function nightPhase() {
  const nightColor = color(18, 24, 46); // Nighttime color
  const nightPlanet = new Planet(1, lerp(0, 255, timer / dayDuration), 255, 255, 204);
  drawPhase(nightColor, nightPlanet);
  drawStars(); // Additional stars for the night phase
}


// A function to draw the dawn phase with the moon fading and stars still visible.
function dawnPhase() {
  const dawnColor = lerpColor(color(18, 24, 46), color(243, 240, 231), timer / dayDuration);
  const dawnPlanet = new Planet(2, lerp(255, 0, timer / dayDuration), 255, 255, 204);
  drawPhase(dawnColor, dawnPlanet);
  drawStars(); // Additional stars for the dawn phase
}


// Abstracted function to draw the background color and the celestial body.
function drawPhase(backgroundColor, planet) {
  background(backgroundColor); // Set the background to the phase color
  planet.draw(); // Draw the sun or moon based on the phase
}


// A function to draw the stars on the top half of the canvas.
function drawStars() {
  let numStars = 10;
  for (let i = 0; i < numStars; i++) {
    let starX = random(width);
    let starY = random(height / 2);
    let starSize = random(1, 3);
    let starColor = color(255, 255, 255, random(150, 255));

    noStroke();
    fill(starColor);
    ellipse(starX, starY, starSize, starSize);
  }
}


// A function to draw concentric circular background lines.
function drawBackgroundLines() {
  const numLines = 23;
  const circleCenter = createVector(canvasWidth / 2, canvasHeight / 2); // Center point for circles.

  // Radii for the three groups of lines.
  const radiuses = [scaledElement(900), scaledElement(1200), scaledElement(1500)];
  const gap = scaledElement(220); // Initial offset for the first line.
  const interval = scaledElement(80); // Distance between each line.

  // Draw lines for each group of radius
  radiuses.forEach((radius, index) => {
    const strokeWidth = scaledElement(6 + 12 * index); // Increase stroke weight for each group.
    drawLines(numLines, gap, interval, radius, circleCenter.x, circleCenter.y, strokeWidth);
  });
}


// A function to draw lines that create the circular pattern.
function drawLines(numLines, gap, interval, radius, centerX, centerY, strokeW) {
  strokeWeight(strokeW);
  stroke(151, 183, 176);

  for (let i = 0; i < numLines; i++) {
    const xPosition = gap + i * interval;
    const yStart = canvasHeight; // Start from the bottom of the canvas.
    const distanceFromCenter = xPosition - centerX; // Horizontal distance from the line to the circle center.

    // Only draw the line if it intersects with the circle.
    if (abs(distanceFromCenter) <= radius) {
      const distanceFromEdge = sqrt(radius * radius - distanceFromCenter * distanceFromCenter); // Vertical distance from the line to the circle edge.
      const yEnd = centerY + distanceFromEdge - scaledElement(800); // Calculate y-coordinate for the top of the line.
      line(xPosition, yStart, xPosition, yEnd);
    }
  }
}


// A function to draw the ground.
function drawGround() {
  noStroke();
  const rectHeight = scaledElement(600);
  const baseRectColor = color(54, 54, 54);
  fill(baseRectColor);
  rect(0, canvasHeight - rectHeight, canvasWidth, rectHeight); // Draw the ground rectangle.
}


// A function to draw the tree trunk.
function drawTreeTrunk() {
  const trunkHeight = scaledElement(600);
  fill(1, 166, 180);

  // Define the dimensions and positions of the trunk sections.
  const trunkSections = [
    { width: scaledElement(120), height: scaledElement(450) },
    { width: scaledElement(80), height: scaledElement(850) },
    { width: scaledElement(40), height: scaledElement(1100) },
  ];

  // Draw each section of the trunk.
  trunkSections.forEach(section => {
    const trunkXPos = width / 2 - section.width / 2;
    const trunkYPos = height - (trunkHeight + section.height);
    rect(trunkXPos, trunkYPos, section.width, section.height);
  });
}


// A function to draw the roots of the tree.
function drawRoots() {
  noStroke();
  let rectHeight = scaledElement(600);
  let rectRootX1 = scaledElement(300);
  let rectRootY1 = scaledElement(50);
  let rectRootX2 = scaledElement(600);
  let rectRootY2 = scaledElement(30);
  let rectRootX3 = scaledElement(900);
  let rectRootY3 = scaledElement(10);
  fill(245, 209, 17);
  
  for (i = 0; i < 3; i++) {
    rect(width / 2 - (rectRootX1 - i * scaledElement(50)) / 2, height - (rectHeight - (rectRootY1 + i * scaledElement(70))), rectRootX1 - (i * scaledElement(50)), rectRootY1);
    rect(width / 2 - (rectRootX2 - i * scaledElement(50)) / 2, height - (rectHeight - (rectRootY2 + i * scaledElement(70)) - scaledElement(30)), rectRootX2 - (i * scaledElement(50)), rectRootY2);
    rect(width / 2 - (rectRootX3 - i * scaledElement(50)) / 2, height - (rectHeight - (rectRootY3 + i * scaledElement(70)) - scaledElement(60)), rectRootX3 - (i * scaledElement(50)), rectRootY3);
  }
}


// A function to draw a group of concentric semicircles above a filled arc.
function drawCircleGroup(x, y, radius, scale) {
  let numCircles = 5;  // Numbers of concentric circles.
  let circleSpacing = 20;
  let strokeWidth = 6;
  // Calculate the radius of the semicircle so that it is equal to the radius of the outermost concentric circle.
  let halfappleRadius = radius * scale;

  push();
  translate(x, y); // Translate to specified coordinates.
  rotate(-PI / 2); // Rotate 90 degrees counterclockwise.

  for (let i = 0; i < numCircles; i++) {
    let currentRadius = halfappleRadius - i * circleSpacing;
    noFill();
    stroke(15);
    strokeWeight(strokeWidth * scale); // Stroke width, adjusted according to scaling.
    arc(0, 0, currentRadius * 2 * scale, currentRadius * 2 * scale, 0, PI);
  }

  fill(15);
  noStroke();
  arc(0, 0, halfappleRadius * 2 + strokeWidth * scale, halfappleRadius * 2 + strokeWidth * scale, PI, TWO_PI);

  pop();
}


// A function to draw apples, both big and small ones.
function drawApples(centers, circleScale) {
  for (let center of centers) {
    stroke(15);
    strokeWeight(scaledElement(6));
    fill(255);
    // Draw the apple as a circle with a scaled position and size.
    circle(
      scaledElement(center.x + 200), 
      scaledElement(center.y + 200), 
      scaledElement(appleSize * circleScale)
    );
    // Draw the group of circles that form the apple pattern.
    drawCircleGroup(
      scaledElement(center.x + 200), 
      scaledElement(center.y + 200), 
      scaledElement(appleRadius), 
      scaledElement(circleScale)
    );
  }
}


// A function to draw all background patterns.
function drawBackground() {
  drawBackgroundLines();
  drawGround();
  drawTreeTrunk();
  drawRoots();
}


// A function to update the timer and phase.
function updateTimerAndPhase() {
  timer++;
  if (timer > dayDuration) {
    timer = 0;
    phase = phase < 4 ? phase + 1 : 1;
  }
}


class Planet {
  constructor(status, brightness, r, g, b) {
    this.status = status; // Status of the planet (1 or 2 for different positions).
    this.brightness = brightness; // Brightness of the planet's glow.
    this.color = color(r, g, b); // p5.js color object for the planet.
  }

  // Draw the planet with its layers.
  draw() {
    const angle = this.calculateAngle(); // Current angle based on status and timer.
    const planetCenter = this.calculatePosition(angle); // Get the planet's center x, y coordinates.

    // Draw the planet's layers
    this.drawLayers(planetCenter.x, planetCenter.y);
  }

  // Calculate the angle based on the planet's status and the timer.
  calculateAngle() {
    if (this.status === 1) {
      return map(timer, 0, dayDuration, 0, PI / 2);
    } else if (this.status === 2) {
      return map(timer, 0, dayDuration, PI / 2, PI);
    }
    return 0; // Default to 0 if status is not 1 or 2.
  }

  // Calculate the planet's position based on the given angle.
  calculatePosition(angle) {
    let x, y;
    if (this.status === 1) {
      x = map(cos(angle), -1, 1, 0, width);
      y = map(sin(angle), 0, 1, height, 0);
    } else if (this.status === 2) {
      x = map(cos(angle), 1, -1, width, 0);
      y = map(sin(angle), 1, 0, 0, height);
    }
    return { x, y };
  }

  // Draw the layers of the planet, including the glow effect.
  drawLayers(x, y) {
    const numLayers = 8; // Number of layers for the glow effect.

    for (let i = numLayers; i > 0; i--) {
      // Size of each layer.
      const planetSize = scaledElement(300 + i * 100);
      // Opacity for the glow effect, diminishing with each outer layer.
      const alpha = this.brightness * (1 - i / numLayers);
      // Set the fill color with the appropriate alpha for the layer.
      fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], alpha);

      noStroke();
      ellipse(x, y, planetSize, planetSize);
    }
  }
}


// A function to adjust the value of an element based on the window size.
function scaledElement(inputElement) {
  return inputElement * min(canvasWidth, canvasHeight) / 2200;
}


// This function calculates an appropriate size for the canvas based on the current window size,
// ensuring that the canvas maintains a specific aspect ratio (defined by `canvasRatio`).
function calculateCanvasSize() {
  // Check if the aspect ratio of the window is greater than the canvas ratio.
  if (windowWidth / windowHeight > canvasRatio) {
    canvasHeight = windowHeight;
    canvasWidth = windowHeight * canvasRatio;
  } else {
    // If not, adjust the canvas width to fit the window width while maintaining the canvas ratio.
    canvasWidth = windowWidth;
    canvasHeight = windowWidth / canvasRatio;
  }
  resizeCanvas(canvasWidth, canvasHeight); // Resize the canvas with the calculated dimensions.
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Adjust the canvas to match the window size.
  calculateCanvasSize(); // Recalculate and set the canvas size to maintain the desired ratio.
}

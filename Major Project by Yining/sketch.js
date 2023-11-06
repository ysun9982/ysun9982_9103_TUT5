let breatheDirection = 1; // Direction control for sun's brightness, 1 for brighter, -1 for dimmer
let breatheSpeed = 0.5; // Speed of the sun's brightness change
let isDay = true;  // Boolean to check if it is currently day time

let dayNightCycle = 'day';  // Initially set to day

let sunBrightness = 255;  // Initial brightness of the sun
let dayDuration = 480;  // Duration of each phase, for example, 480 frames
let phase = 1;  // Current phase
let timer = 0;  // Timer for phase changes

let circleSize = 200;
let circleRadius = circleSize / 2;
let bigCircleScale = 1;
let smallCircleScale = 0.6;

// Coordinates for big and small circles representing the Apple's locations
let bigcircleCenters = [
  { x: 400, y: 324 },
  { x: 300, y: 500 },
  { x: 400, y: 841 },
  { x: 500, y: 1020 },
  { x: 850, y: 1000 },
  { x: 900, y: 1314 },
  { x: 1330, y: 810 },
  { x: 1700, y: 765 },
];

let smallcircleCenters = [
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

let canvasWidth, canvasHeight;
const canvasRatio = 2 / 3; // Make sure the canvas ratio is always 2:3


function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateCanvasSize();
  
  // noLoop();
}


function draw() {
  // background(243, 240, 231);

  // Call the function corresponding to the current stage
  if (phase === 1) {
    dayPhase();
  } else if (phase === 2) {
    sunsetPhase();
  } else if (phase === 3) {
    nightPhase();
  } else if (phase === 4) {
    dawnPhase();
  }

  // Update timer and phase
  timer++;
  if (timer > dayDuration) {
    timer = 0;
    phase = phase < 4 ? phase + 1 : 1;
  }

  drawBackgroundLines();
  drawGround();
  drawTreeTrunk();
  for (let center of bigcircleCenters) {
    stroke(15);
    strokeWeight(scaledElement(6));
    fill(255);
    circle(scaledElement(center.x + 200), scaledElement(center.y + 200), scaledElement(circleSize * bigCircleScale));
    drawCircleGroup(scaledElement(center.x + 200), scaledElement(center.y + 200), scaledElement(circleRadius), scaledElement(bigCircleScale));
  }

  for (let center of smallcircleCenters) {
    stroke(15);
    strokeWeight(scaledElement(6));
    fill(255);
    circle(scaledElement(center.x + 200), scaledElement(center.y + 200), scaledElement(circleSize * smallCircleScale));
    drawCircleGroup(scaledElement(center.x + 200), scaledElement(center.y + 200), scaledElement(circleRadius), scaledElement(smallCircleScale));
  }

  drawRoots();

  
}




// A function to adjust the value of an element based on the window size.
function scaledElement(inputElement) {
  return inputElement * min(canvasWidth, canvasHeight) / 2200;
}


// Functions for different phases of the day
function dayPhase() {
  let dayColor = color(243, 240, 231);
  background(dayColor);
  drawSun(255); // The sun is the brightest
}

// Functions for different phases of the sunset
function sunsetPhase() {
  let sunsetColor = lerpColor(color(243, 240, 231), color(18, 24, 46), timer / dayDuration);
  background(sunsetColor);
  drawSun(lerp(255, 0, timer / dayDuration *2)); // The sun is getting darker
}

// Functions for different phases of the night
function nightPhase() {
  let nightColor = color(18, 24, 46);  // Dark Blue night
  background(nightColor);
  drawStars(); // draw stars
}

// Functions for different phases of the dawn
function dawnPhase() {
  let dawnColor = lerpColor(color(18, 24, 46), color(243, 240, 231), timer / dayDuration);
  background(dawnColor);
  // drawSun(lerp(0, 255, timer / dayDuration)); // The sun is getting brighter
  if (timer > dayDuration / 2) {
    // The third parameter of lerp here is calculated based on the remaining time, ensuring that the sun's brightness gradually changes from 0 to 255
    drawSun(lerp(0, 255, (timer - dayDuration / 2) / (dayDuration / 2)));
  }
}

// Function to draw the sun with varying brightness
function drawSun(sunBrightness) {
  let numSuns = 8;  // Solar layers, including halos
  let sunCenterX = width / 2;
  let sunCenterY = 0; 

  for (let i = numSuns; i > 0; i--) {
    // Calculate the size of each layer, the inner layer is small and the outer layer is large
    let sunSize = scaledElement(1000 + i * 100);
    // Calculate transparency for each layer, high for inner layers and low for outer layers
    let alpha = sunBrightness * (1 - i / numSuns);

    // Use translucent white to add brightness to the sun
    let sunColor = color(245, 135, 26, alpha);
    
    fill(sunColor);
    noStroke();
    ellipse(sunCenterX, sunCenterY, sunSize, sunSize);
  }
}


// Function to draw stars during the night phase
function drawStars() {
  let stars = 100; 
  for (let i = 0; i < stars; i++) {
    let x = random(width);
    let y = random(height / 2); // Draw stars only in the top half of the screen
    let size = random(1, 3);
    let starColor = color(255, 255, 255, random(150, 255));

    noStroke();
    fill(starColor);
    ellipse(x, y, size, size);
  }
}

// Function to draw background lines that provide a sense of depth
function drawBackgroundLines() {
  // Draw the background lines
  let numLines = 23;
  let circleCenterX = canvasWidth / 2;
  let circleCenterY = canvasHeight / 2;

  //3 groups of lines to create the circle trend
  let radius1 = scaledElement(900);
  let radius2 = scaledElement(1200);
  let radius3 = scaledElement(1500);
  let gap = scaledElement(220);
  let interval = scaledElement(80); // distance between each two lines

  // Draw lines for each radius
  drawLines(numLines, gap, interval, radius1, circleCenterX, circleCenterY, scaledElement(6));
  drawLines(numLines, gap, interval, radius2, circleCenterX, circleCenterY, scaledElement(18));
  drawLines(numLines, gap, interval, radius3, circleCenterX, circleCenterY, scaledElement(30));
}


// Function to draw multiple lines with specified parameters
function drawLines(numLines, gap, interval, inputRadius, centerX, centerY, strokeW) {
  strokeWeight(strokeW)
  stroke(151, 183, 176)

  for (let i = 0; i < numLines; i++) {
    let x = gap + i * interval
    let y1 = canvasHeight; //Start from the bottom of canvas
    let dx = x - centerX; //length of the Xdistance between circle center and the line ends

    //Calculate Y position to draw plumb lines
    //check if the line could intersect with the circle
    if (abs(dx) <= inputRadius) {
      let dy = sqrt(inputRadius * inputRadius - dx * dx)  // Calculate the dy, Pythagorean theorem
      let y2 = centerY + dy - scaledElement(800);
      line(x, y1, x, y2)
    }
  }
}

// Function to draw the ground/base
function drawGround() {
  noStroke();
  let rectHeight = scaledElement(600);
  let baserectColor = color(54, 54, 54);
  fill(baserectColor);
  rect(0, canvasHeight - rectHeight, canvasWidth, rectHeight);
}

// Function to draw the tree trunk
function drawTreeTrunk() {
  let rectHeight = scaledElement(600);
  let rectX1 = scaledElement(120);
  let rectY1 = scaledElement(450);
  let rectX2 = scaledElement(80);
  let rectY2 = scaledElement(850);
  let rectX3 = scaledElement(40);
  let rectY3 = scaledElement(1100);
  fill(1, 166, 180);
  rect(width / 2 - rectX1 / 2, height - (rectHeight + rectY1), rectX1, rectY1);
  rect(width / 2 - rectX2 / 2, height - (rectHeight + rectY2), rectX2, rectY2);
  rect(width / 2 - rectX3 / 2, height - (rectHeight + rectY3), rectX3, rectY3);
}

// Function to draw the roots of the tree
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

// Function to draw a group of circles arranged in a particular pattern
function drawCircleGroup(x, y, radius, scale) {
  let numCircles = 5;  // Numbers of concentric circles
  let circleSpacing = 20;
  let strokeWidth = 6;
  // Calculate the radius of the semicircle so that it is equal to the radius of the outermost concentric circle
  let halfCircleRadius = radius * scale;

  push();
  translate(x, y); // Translate to specified coordinates
  rotate(-PI / 2); // Rotate 90 degrees counterclockwise

  for (let i = 0; i < numCircles; i++) {
    let currentRadius = halfCircleRadius - i * circleSpacing;
    noFill();
    stroke(15);
    strokeWeight(strokeWidth * scale); // Line width, adjusted according to scaling
    arc(0, 0, currentRadius * 2 * scale, currentRadius * 2 * scale, 0, PI);
  }

  fill(15);
  noStroke();
  arc(0, 0, halfCircleRadius * 2 + strokeWidth * scale, halfCircleRadius * 2 + strokeWidth * scale, PI, TWO_PI);

  pop();
}


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
  resizeCanvas(canvasWidth, canvasHeight);// Resize the canvas with the calculated dimensions.
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Adjust the canvas to match the window size.
  calculateCanvasSize(); // Recalculate and set the canvas size to maintain the desired ratio.
}
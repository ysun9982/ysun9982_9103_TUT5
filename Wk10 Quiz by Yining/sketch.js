let song;
let cnv;
let fft;
let audioStarted = false;
let spectralCentroid = 0;
let nyquist = 22050;

// An array to store the positions and properties of stars.
let stars = [];

// Initialize the size of the visualization.
let scale = 0.6;

// Three variables representing the spectral centroid color.
let changeR = 0;
let changeG = 0;
let changeB = 220;


function preload() {
  song = loadSound("audio/sample-visualisation.mp3");
}


function setup() {
  // Create the canvas and center it.
  cnv = createCanvas(windowWidth, windowHeight);
  centerCanvas();

  fft = new p5.FFT();
  song.connect(fft);

  // Generate the positions and properties of stars.
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height);
    let radius = random(1, 5);
    let starColor = color(random(200, 255), random(200, 255), random(200, 255));
    stars.push({ x, y, radius, starColor });
  }
}


function draw() {
  // If the audio context is not running, display a prompt.
  if (getAudioContext().state !== 'running') {
    background(0);
    textAlign(CENTER, CENTER);
    textSize(20);
    fill(255);
    text('1. Tap here to play some sound! \n 2. Click to toggle sound playback. \n 3. Adjust size of the visualization by moving your mouse. \n 4. Change spectral centroid color with the spacebar.', width / 2, height / 2);
    return;
  }

  background(0);
  let spectrum = fft.analyze();

  // Update 'scale'(the size of the visualization) based on distance from mouse to center.
  let distToCenter = dist(width / 2, height / 2, mouseX, mouseY);
  scale = map(distToCenter, 0, min(width, height) / 2, 0.1, 1.0);

  // 'numCircles' represents the number of frequency components in the spectrum.
  let numCircles = spectrum.length;

  // 'maxRadius' represents the maximum radius of visualization. 
  // Make sure that it does not exceed the boundaries of the screen.
  let maxRadius = min(width, height) * scale;

  // Draw the stars.
  for (let star of stars) {
    fill(star.starColor);
    noStroke();
    ellipse(star.x, star.y, star.radius, star.radius);
  }

  // Properties of concentric circles.
  noFill();
  strokeWeight(1);
  stroke(255);

  // Draw the concentric circles.
  // The radii of these concentric circles are mapped based on the values in the spectrum array.
  for (let i = 0; i < numCircles; i++) {
    let radius = map(spectrum[i], 0, 255, 0, maxRadius);
    ellipse(width / 2, height / 2, radius, radius);
  }

  // Calculate the spectral centroid and map it to the radius of a circle.
  spectralCentroid = fft.getCentroid();
  let centroidRadius = map(spectralCentroid, 0, nyquist, 0, maxRadius);
  noFill();
  strokeWeight(3);

  // The stroke color of the spectrum centroid circle changes with user interaction.
  stroke(changeR, changeG, changeB);
  ellipse(width / 2, height / 2, centroidRadius, centroidRadius);
}


// Mouse click event to control music play and pause.
function mousePressed() {
  if (song.isPlaying()) {
    song.stop();
  } else {
    song.play();
  }
}


// Key press event to change the spectral centroid color.
function keyPressed() {
  if (key === ' ') {
    changeR = random(255);
    changeG = random(255);
    changeB = random(255);
  }
}


// Center the canvas on the web page.
function centerCanvas() {
  cnv.position((windowWidth - width) / 2, (windowHeight - height) / 2);
}
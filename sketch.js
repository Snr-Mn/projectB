// save as picture at the end
// name your creature
// add background eyecandy
// too much prompts
// humanoid drawings



let gameState = "title";
let startButton;

let currentPlacingPart;
let buildReady = false;

let prompts = ['BODY', 'LEGS', 'HEAD', 'ARMS'];
let currentPrompt = "";

let drawingArea = { x: 200, y: 100, w: 400, h: 300 };
let drawnPoints = [];
let savedDrawing = []; // Array of DrawingPart
let placedParts = [];  // Array of PlacedPart
let saveButton, clearButton, showButton;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  startButton = new Button(width / 2 - 200, height / 2 + 90, 400, 100, "Begin Construction!");

  saveButton = new Button(580, 420, 120, 40, "Save");
  clearButton = new Button(100, 420, 120, 40, "Clear");
  showButton = new Button(340, 420, 120, 40, "Show Saved");
}

function draw() {
  background(180, 220, 255); // Light sky-blue

  // Some stars or clouds
  for (let i = 0; i < 50; i++) {
    fill(255, 255, 255, 150);
    ellipse(random(width), random(height), random(2, 6));
  }

  if (gameState === "title") {
    drawTitleScreen();
  } else if (gameState === "game") {
    drawGameScreen();
  } else if (gameState === "build") {
    drawBuildScreen();
  }
}

function drawBuildScreen() {
  // draw sky
  background(135, 206, 235); //blue color

  // draw grass
  noStroke();
  fill(100, 200, 100);
  rect(0, height * 0.6, width, height * 0.4);

  //draw clouds
  drawSkyDecorations();

  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Click to build your creature!", width / 2, 40);

  text("Press S to save a picture!", width / 2, height / 1.1);

  // show placed body parts
  for (let part of placedParts) {
    part.show();
  }

  // select body parts to be placed
  if (!currentPlacingPart && savedDrawing.length > 0) {
    let randomIndex = floor(random(savedDrawing.length));
    currentPlacingPart = savedDrawing[randomIndex];
  }

  if (currentPlacingPart) {
    fill(0);
    textSize(20);
    textAlign(LEFT, BOTTOM);
    text("Placing: " + currentPlacingPart.prompt, mouseX + 15, mouseY - 10);
  }


}


function drawTitleScreen() {
  textAlign(CENTER, CENTER);
  textSize(36);
  fill(0);
  text("Build a Creature!", width / 2, 50);
  startButton.show();
}

function drawGameScreen() {
  startButton.hide();
  fill(0);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Draw the " + currentPrompt, width / 2, 50);

  noFill();
  stroke(0);
  strokeWeight(2);
  rect(drawingArea.x, drawingArea.y, drawingArea.w, drawingArea.h);

  noStroke();
  fill(0);
  for (let pt of drawnPoints) {
    ellipse(pt.x, pt.y, 4, 4);
  }

  saveButton.show();
  clearButton.show();
  // showButton.show();
}

class DrawingPart {
  constructor(prompt, drawing) {
    this.prompt = prompt;
    this.drawing = drawing;
  }

  copy() {
    return new DrawingPart(this.prompt, [...this.drawing]);
  }
}


class Button {
  constructor(x, y, width, height, label) {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
    this.label = label;
    this.visible = true;
    this.targetScale = 1;
    this.currentScale = 1;
    this.targetAngle = 0;
    this.currentAngle = 0;
    this.hoverDuration = 0;
    this.isShaking = false;
  }

  show() {
    this.visible = true;
    if (!this.visible) return;

    let isHovering = this.isMouseHover();

    // Animate hover state
    this.targetScale = isHovering ? 1.15 : 1.0;
    this.targetAngle = isHovering ? radians(5) : 0;
    this.currentScale = lerp(this.currentScale, this.targetScale, 0.1);
    this.currentAngle = lerp(this.currentAngle, this.targetAngle, 0.1);

    if (isHovering) {
      this.hoverDuration += deltaTime / 1000;
    } else {
      this.hoverDuration = 0;
      this.isShaking = false;
    }

    if (this.hoverDuration > 0.45 && !this.isShaking) {
      this.isShaking = true;
    }

    let shakeX = this.isShaking ? random(-5, 5) : 0;
    let shakeY = this.isShaking ? random(-5, 5) : 0;

    // button colors
    let baseColors = [
      color(255, 102, 178), // hot pink
      color(102, 255, 204), // mint
      color(255, 255, 102), // lemon
      color(204, 153, 255), // lavender
      color(255, 153, 102)  // coral
    ];
    let btnColor = baseColors[(this.label.length + this.x + this.y) % baseColors.length];
    let hoverColor = color(red(btnColor) + 20, green(btnColor) + 20, blue(btnColor) + 20);

    push();
    translate(this.x + this.w / 2 + shakeX, this.y + this.h / 2 + shakeY);
    rotate(this.currentAngle);
    scale(this.currentScale);
    rectMode(CENTER);
    noStroke();
    fill(isHovering ? hoverColor : btnColor);
    rect(0, 0, this.w, this.h, 12);
    fill(30);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(this.label, 0, 0);
    pop();
  }


  hide() {
    this.visible = false;
  }

  isMouseHover() {
    return (
      this.visible &&
      mouseX > this.x && mouseX < this.x + this.w &&
      mouseY > this.y && mouseY < this.y + this.h
    );
  }

  onClick() {
    gameState = "game";
    currentPrompt = getNextPrompt();
  }
}

function getNextPrompt() {
  if (prompts.length == 0) {
    buildReady = true;
    gameState = "build";
    return "";
  }
  let index = floor(random(prompts.length));
  let next = prompts[index];
  prompts.splice(index, 1);
  return next;
}


function mouseDragged() {
  if (gameState === "game") {
    if (
      mouseX > drawingArea.x && mouseX < drawingArea.x + drawingArea.w &&
      mouseY > drawingArea.y && mouseY < drawingArea.y + drawingArea.h
    ) {
      let dx = mouseX - pmouseX;
      let dy = mouseY - pmouseY;
      let distSteps = max(abs(dx), abs(dy));
      for (let i = 0; i < distSteps; i++) {
        let x = lerp(pmouseX, mouseX, i / distSteps);
        let y = lerp(pmouseY, mouseY, i / distSteps);
        drawnPoints.push({ x: x, y: y });
      }
    }
  }
}

function keyPressed() {
  if (gameState === "build" && key === 's') {
    saveCanvas('myCreature', 'png');
  }
}


function mousePressed() {
  if (gameState === "title" && startButton.isMouseHover()) {
    startButton.onClick();
  }

  if (gameState === "game") {
    if (saveButton.isMouseHover()) {
      let drawingCopy = drawnPoints.map(p => ({ x: p.x, y: p.y }));
      savedDrawing.push(new DrawingPart(currentPrompt, drawingCopy));
      drawnPoints = [];
      currentPrompt = getNextPrompt();
    }
    if (clearButton.isMouseHover()) {
      drawnPoints = [];
    }
    if (showButton.isMouseHover()) {
      if (!currentPlacingPart && savedDrawing.length > 0) {
        drawnPoints = [...savedDrawing[savedDrawing.length - 1].drawing];
      }
      console.log(savedDrawing);
    }
  }

  if (gameState === "build" && buildReady) {
    if (currentPlacingPart) {
      placedParts.push(new PlacedPart(currentPlacingPart, mouseX, mouseY));

      // Remove used part from savedDrawing so it's not placed again
      let index = savedDrawing.indexOf(currentPlacingPart);
      if (index !== -1) {
        savedDrawing.splice(index, 1);
      }

      currentPlacingPart = null;
    }
  }





}
class PlacedPart {
  constructor(drawingPart, x, y) {
    let sumX = 0, sumY = 0;
    for (let pt of drawingPart.drawing) {
      sumX += pt.x;
      sumY += pt.y;
    }
    let centerX = sumX / drawingPart.drawing.length;
    let centerY = sumY / drawingPart.drawing.length;

    this.drawing = drawingPart.drawing.map(pt => ({
      x: pt.x - centerX,
      y: pt.y - centerY
    }));

    this.offsetX = x;
    this.offsetY = y;
  }

  show() {
    push();
    translate(this.offsetX, this.offsetY);
    noStroke();
    fill(50);
    for (let part of this.drawing) {
      ellipse(part.x, part.y, 4, 4);
    }
    pop();
  }
}

function drawSkyDecorations() {
  // Sun
  fill(255, 255, 100);
  ellipse(80, 80, 80, 80);

  // Clouds
  fill(255, 255, 255, 230);
  drawCloud(200, 100);
  drawCloud(500, 70);
  drawCloud(650, 130);
}

function drawCloud(x, y) {
  ellipse(x, y, 60, 60);
  ellipse(x + 30, y + 10, 50, 50);
  ellipse(x - 30, y + 10, 50, 50);
}

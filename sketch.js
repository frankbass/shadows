let greys = [];

function setup() {
  createCanvas(400, 400);
  noStroke();
  arrays();
  dots();

  lines(50, 50, 25, 150, 285, 300, 250, 25);
}

function draw() {

}

function arrays() {
  let n = 0;
  let x = 0;
  let y = 0;
  let noiseVal;
  let noiseScale = .01;
  let noiseArray = [];
  let noiseScale2 = .15;
  let thresh = .3;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      noiseVal = noise(j * noiseScale, i * noiseScale);
      let grey = noise(x, y);
      if (grey > (thresh)) {
        grey = grey * 1.9;
      }
      grey = (grey + noiseVal) / 2;
      grey = grey * 256;
      greys[n] = grey;
      x += .3;
      y += .2;
      n++;
    }
  }
}

function dots() {
  let n = 0;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      stroke(greys[n]);
      point(i, j);
      n++;
    }
  }
}

function lines(long) {
  let length = long;
  for (let j = 0; j < 30; j++) {
    stroke(0, 12 + j);
    //from .99 to .95
    let fade = .99;
    long *= fade;
    for (let i = 0; i < 400; i++) {
      length = long + random(15);
      line(0, i, length, i + 10);
    }
  }
}

function lines(ax, ay, bx, by, cx, cy, dx, dy) {
  let numLines = dist(ax, ay, bx, by);

  let changeXab = bx - ax;
  let dXab = changeXab / numLines;
  let changeYab = by - ay;
  let dYab = changeYab / numLines;

  let changeXdc = cx - dx;
  let dXdc = changeXdc / numLines;
  let changeYdc = cy - dy;
  let dYdc = changeYdc / numLines;

  let fade = 1.
  let iterations = 30;
  for (let j = 0; j < iterations; j++) {
    stroke(255, 12 +j);

    for (let i = 0; i < numLines; i++) {
      let rand = random(iterations - j + 10);
      let wobbleX = random(4);
      let wobbleY = random(4);
      line(ax + (dXab * i) + wobbleX, ay + (dYab * i) + wobbleY,
        (dx + (dXdc * i))* fade + rand , dy + (dYdc * i))
    }
    fade *= .99
  }

  // stroke(0);
  // fill(255, 0, 255);
  // text("a", ax, ay);
  // text("b", bx, by);
  // text("c", cx, cy);
  // text("d", dx, dy);
}

function keyPressed() {
  if (keyCode == 32) {
    let ax = random(width*2)-width;
    let ay = random(height*2)-height;
    let bx = random(width*2)-width;
    let by = random(height*2)-height;
    let cx = random(width*2)-width;
    let cy = random(height*2)-height;
    let dx = random(width*2)-width;
    let dy = random(height*2)-height;
    dots();
    // background(255);
    lines(ax, ay, bx, by, cx, cy, dx, dy);
  }
}


//fade in with a stored pixel array of calculated image

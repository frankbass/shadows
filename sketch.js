let greys = [];
let polyCorners = [];
let screenCorners = [];
let quadCorners = [];
let dispQuad = [];

let timeLength = 180;

let v;
let vGoal;

let test;

function setup() {
  createCanvas(400, 400);
  // noStroke();
  noiseArrays();
  dots();
  makeQuad();
  arrayCopy(quadCorners, 0, dispQuad, 0, quadCorners.length);

  lines();

  test = new displayQuad;
  // test.testFunc();
  test.increment();
  test.drawing();
}

function draw() {
  background(255);
  if (frameCount % timeLength == 0) {
    makeQuad();
    test.amountReset();
  }
  test.increment();
  lines();
  // noLoop();
}

function makeQuad() {
  quadCorners = randomCorners();
  //poly[2]=A, poly[1]=C
  polyCorners[1] = quadCorners[2];
  polyCorners[2] = quadCorners[0];
  triangleABC();
  pointD();
}

class displayQuad {
  constructor() {
    this.amount = .005;
    this.step = 1.01;
  }
  increment() {
    for (let i = 0; i < 4; i ++) {
      this.oldX = dispQuad[i].x;
      this.newX = quadCorners[i].x;
      this.lerpX = lerp(this.oldX, this.newX, this.amount);
      this.oldY = dispQuad[i].y;
      this.newY = quadCorners[i].y;
      this.lerpY = lerp(this.oldY, this.newY, this.amount);

      dispQuad[i].x = this.lerpX;
      dispQuad[i].y = this.lerpY;
    }
    this.amount *= this.step;
    if (this.amount > 1) {
      this.amount = 1;
    }
  }
  // testFunc() {
  //   for (let i = 0; i < 4; i ++) {
  //     this.oldX = dispQuad[i].x;
  //     this.newX = quadCorners[i].x;
  //     this.lerpX = lerp(this.oldX, this.newX, this.amount);
  //     this.oldY = dispQuad[i].y;
  //     this.newY = quadCorners[i].y;
  //     this.lerpY = lerp(this.oldY, this.newY, this.amount);
  //
  //     dispQuad[i].x = this.lerpX;
  //     dispQuad[i].y = this.lerpY;
  //   }
  // }
  drawing() {
    fill(255, 0, 255);
    for (let i = 0; i < 4; i ++) {
      this.temp = dispQuad[i];
      ellipse(this.temp.x, this.temp.y, 5, 5);
    }

  }
  amountReset() {
    this.amount = .005;
  }
}

function noiseArrays() {
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

function lines() {
  let ax = dispQuad[0].x;
  let ay = dispQuad[0].y;
  let bx = dispQuad[1].x;
  let by = dispQuad[1].y;
  let cx = dispQuad[2].x;
  let cy = dispQuad[2].y;
  let dx = dispQuad[3].x;
  let dy = dispQuad[3].y;

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
    stroke(0, 12 + j);

    for (let i = 0; i < numLines; i++) {
      let rand = random(iterations - j + 10);
      let wobbleX = random(4);
      let wobbleY = random(4);
      line(ax + (dXab * i) + wobbleX, ay + (dYab * i) + wobbleY,
        (dx + (dXdc * i)) * fade + rand, dy + (dYdc * i))
    }
    fade *= .99
  }
}

function randomCorners() {
  let buffer = 20;

  let ax = floor(random(width - buffer * 2) + buffer);
  let ay = floor(random(height - buffer * 2) + buffer);
  let a = createVector(ax, ay);
  let bx = floor(random(width - buffer * 2) + buffer);
  let by = floor(random(height - buffer * 2) + buffer);
  let b = createVector(bx, by);
  let cx = floor(random(width - buffer * 2) + buffer);
  let cy = floor(random(height - buffer * 2) + buffer);
  let c = createVector(cx, cy);

  return [a, b, c];
}

function triangleABC() {

  let ax = quadCorners[0].x;
  let ay = quadCorners[0].y;
  let bx = quadCorners[1].x;
  let by = quadCorners[1].y;
  let cx = quadCorners[2].x;
  let cy = quadCorners[2].y;

  let slopeBA = (ay - by) / (ax - bx);
  let slopeBC = (cy - by) / (cx - bx);

  let mBA = degrees(atan2(ay - by, ax - bx));
  let mBC = degrees(atan2(cy - by, cx - bx));

  let bcQuad = quadrants(mBC);
  let baQuad = quadrants(mBA);

  let m = endPoint(ax, ay, slopeBA, baQuad);
  let n = endPoint(cx, cy, slopeBC, bcQuad);

  fourCorners(m, n, baQuad, bcQuad);

  // strokeWeight(1);
  // line(ax, ay, bx, by);
  // line(bx, by, cx, cy);
  // line(ax, ay, cx, cy);
  // strokeWeight(.5);
  // line(ax, ay, m.x, m.y);
  // line(cx, cy, n.x, n.y);
  //
  // noStroke();
  // fill(255, 0, 0);
  // ellipse(ax, ay, 5, 5);
  // ellipse(bx, by, 5, 5);
  // ellipse(cx, cy, 5, 5);
  //
  // fill(255, 0, 255);
  // stroke(0);
  // text("A", ax, ay);
  // text("B", bx, by);
  // text("C", cx, cy);
}

//determine where A and C are in relation to B, quad 0-3
function quadrants(theta) {
  let quadNum;
  if (theta <= 0 && theta > -90) {
    quadNum = 0;
  } else if (theta <= -90 && theta < 180) {
    quadNum = 1;
  } else if (theta > 90 && theta <= 180) {
    quadNum = 2;
  } else {
    quadNum = 3;
  }
  return quadNum;
}

//extend BA and BC to create vector m and n
function endPoint(x2, y2, slope, quadNum) {
  let x, y;
  switch (quadNum) {
    case 0:
      x = solveForX(x2, y2, slope, 0);
      y = solveForY(x2, y2, slope, width);
      break;
    case 1:
      x = solveForX(x2, y2, slope, 0);
      y = solveForY(x2, y2, slope, 0);
      // text("D", dx, dy);

      break;
    case 2:
      x = solveForX(x2, y2, slope, height);
      y = solveForY(x2, y2, slope, 0);

      break;
    case 3:
      x = solveForX(x2, y2, slope, height);
      y = solveForY(x2, y2, slope, width);

      break;
    default:
  }

  x = floor(x);
  y = floor(y);

  // fill(0);
  // ellipse(x, y, 5, 5);

  let vector = createVector(x, y);
  return vector;

  function solveForY(x2, y2, slope, x) {
    let y = slope * (x - x2) + y2;
    if (y < 0) {
      y = 0;
    } else if (y > height) {
      y = height;
    }
    return y;
  }

  function solveForX(x2, y2, slope, y) {
    let x = (y - y2 + (slope * x2)) / slope;
    if (x > width) {
      x = width;
    } else if (x < 0) {
      x = 0;
    }
    return x;
  }
}

//this should be an class with a constructor
function fourCorners(mVec, nVec, qBA, qBC) {
  let m = mVec;
  let n = nVec;
  let mQuad = qBA;
  let nQuad = qBC;

  polyCorners[3] = m;
  polyCorners[0] = n;

  let c0 = createVector(width, 0);
  let c1 = createVector(0, 0);
  let c2 = createVector(0, height);
  let c3 = createVector(width, height);
  screenCorners = [c0, c1, c2, c3];

  let orientation = orientations();

  function orientations() {
    let ax = quadCorners[0].x;
    let ay = quadCorners[0].y;
    let bx = quadCorners[1].x;
    let by = quadCorners[1].y;
    let cx = quadCorners[2].x;
    let cy = quadCorners[2].y;

    let orient = (by - ay) * (cx - bx) - (bx - ax) * (cy - by);
    if (orient > 0) {
      orient = 1;
    } else if (orient == 0) {
      orient = 0;
    } else {
      orient = -1;
    }
    return orient;
  };

  let mCorner = null;
  let nCorner = null;
  let pCorner = null;

  if (m.x == n.x || m.y == n.y) {} else {
    let mO = orientation;
    let nO = orientation * -1;
    mCorner = cornerCalculator(m, mO);
    nCorner = cornerCalculator(n, nO);
    pCorner = mCorner;

    polyCorners[4] = mCorner;
    polyCorners[5] = pCorner;
    polyCorners[6] = nCorner;

    function cornerCalculator(vector, orient) {
      let corner;
      if (orient == 1) {
        if (vector.x == 0) {
          corner = screenCorners[1];
        }
        if (vector.x == width) {
          corner = screenCorners[3];
        }
        if (vector.y == 0) {
          corner = screenCorners[0];
        }
        if (vector.y == height) {
          corner = screenCorners[2];
        }
      } else if (orient == -1) {
        if (vector.x == 0) {
          corner = screenCorners[2];
        }
        if (vector.x == width) {
          corner = screenCorners[0];
        }
        if (vector.y == 0) {
          corner = screenCorners[1];
        }
        if (vector.y == height) {
          corner = screenCorners[3];
        }
      }
      return corner;
    }

    if (mCorner.x == nCorner.x || mCorner.y == nCorner.y) {
      //m and n are on same edge
    } else {
      let b = quadCorners[1];
      let longestDist = 0;
      let tempIndex;
      for (let i = 0; i < 4; i++) {
        let tempDist = b.dist(screenCorners[i])
        if (tempDist > longestDist) {
          longestDist = tempDist;
          tempIndex = i;
        }
      }
      pCorner = screenCorners[tempIndex];
      polyCorners[5] = pCorner;
    }
  }
}

function pointD() {

  let minVect = minVector();
  let maxVect = maxVector();
  let d = new dVector(minVect, maxVect);
  guessPoint(d);
}

class dVector {
  constructor(minVect, maxVect) {
    this.min = minVect;
    this.max = maxVect;
  }
  createD() {
    this.x = floor(random(this.max.x - this.min.x) + this.min.x);
    this.y = floor(random(this.max.y - this.min.y) + this.min.y);
    this.d = createVector(this.x, this.y);
  }
  // pinkRect() {
  //   noFill();
  //   strokeWeight(1);
  //   stroke(255, 0, 255);
  //   rect(this.min.x, this.min.y, this.max.x - this.min.x, this.max.y - this.min.y);
  // }
  // cyanSpot() {
  //   noStroke();
  //   fill(0, 255, 255);
  //   ellipse(this.x, this.y, 5, 5);
  // };
}

function inside(polyCorners, dx, dy) {
  let inside = false;
  let next = 0;
  for (let current = 0; current < polyCorners.length; current++) {
    // last vertex == first vertex
    next = current + 1;
    if (next == polyCorners.length) next = 0;

    let vc = polyCorners[current];
    let vn = polyCorners[next];

    if (((vc.y >= dy && vn.y < dy) || (vc.y < dy && vn.y >= dy)) &&
      (dx < (vn.x - vc.x) * (dy - vc.y) / (vn.y - vc.y) + vc.x)) {
      inside = !inside;
    }
  }
  return inside;
}

function minVector() {
  let minX = width;
  let minY = height;

  for (let v of polyCorners) {
    if (v.x < minX) {

      minX = v.x;
    }
    if (v.y < minY) {
      minY = v.y;
    }
  }
  return createVector(minX, minY);
}

function maxVector() {
  let maxX = 0;
  let maxY = 0;

  for (let v of polyCorners) {
    if (v.x > maxX) {
      maxX = v.x;
    }
    if (v.y > maxY) {
      maxY = v.y;
    }
  }
  return createVector(maxX, maxY);
}

function guessPoint(d) {
  let hit = false;
  for (let i = 0; i < 100; i++) {
    d.createD();
    // d.cyanSpot();
    let hit = inside(polyCorners, d.x, d.y);
    if (hit) {
      quadCorners[3] = d;
      break;
    }
  }
}

// function drawShape1() {
//   fill(0, 150, 255);
//   noStroke();
//   beginShape();
//   for (let v of polyCorners) {
//     vertex(v.x, v.y);
//   }
//   endShape();
// }

// function drawShape() {
//   fill(0, 25);
//   noStroke();
//   beginShape();
//   for (let v of quadCorners) {
//     vertex(v.x, v.y);
//   }
//   endShape();
// }

//fade in with a stored pixel array of calculated image

let greys = [];
let polyCorners = [];
let screenCorners = [];

function setup() {
  createCanvas(400, 400);
  // noStroke();
  // arrays();
  // dots();

  // lines(50, 50, 25, 150, 285, 300, 250, 25);

  polyCorners = randomCorners();
  boxes();


}

function draw() {
  // boxes();
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

// function lines(long) {
//   let length = long;
//   for (let j = 0; j < 30; j++) {
//     stroke(0, 12 + j);
//     //from .99 to .95
//     let fade = .99;
//     long *= fade;
//     for (let i = 0; i < 400; i++) {
//       length = long + random(15);
//       line(0, i, length, i + 10);
//     }
//   }
// }

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

// function mousePressed() {
//   boxes();
// }

function keyPressed() {
  // console.log(keyCode);

  //enter
  if (keyCode == 13) {

  }
  // space
  if (keyCode == 32) {
    console.clear();
    polyCorners = randomCorners();
    boxes();
    // randomCorners();

    // dots();
    // background(255);
    // lines(ax, ay, bx, by, cx, cy, dx, dy);
  }
}

function randomCorners() {
  let buffer = 20;
  //if by == ay regenerate one of them...
  let ax = floor(random(width - buffer * 2) + buffer);
  let ay = floor(random(height - buffer * 2) + buffer);
  let a = createVector(ax, ay);
  let bx = floor(random(width - buffer * 2) + buffer);
  let by = floor(random(height - buffer * 2) + buffer);
  let b = createVector(bx, by);
  let cx = floor(random(width - buffer * 2) + buffer);
  let cy = floor(random(height - buffer * 2) + buffer);
  let c = createVector(cx, cy);
  // let dx = floor(random(width));
  // let dy = floor(random(height));

  // boxes(ax, ay, bx, by, cx, cy);

  return [a, b, c];
}

function boxes() {
  background(255);
  noFill();
  rect(0, 0, width - 1, height - 1);
  let ax = polyCorners[0].x;
  let ay = polyCorners[0].y;
  let bx = polyCorners[1].x;
  let by = polyCorners[1].y;
  let cx = polyCorners[2].x;
  let cy = polyCorners[2].y;
  // let cx = mouseX;
  // let cy = mouseY;

  let slopeBA = (ay - by) / (ax - bx);
  let slopeBC = (cy - by) / (cx - bx);

  let mBA = degrees(atan2(ay - by, ax - bx));
  let mBC = degrees(atan2(cy - by, cx - bx));

  let bcQuad = quadrants(mBC);
  let baQuad = quadrants(mBA);

  let m = endPoint(ax, ay, slopeBA, baQuad);
  let n = endPoint(cx, cy, slopeBC, bcQuad);

  fourCorners(m, n, baQuad, bcQuad);

  strokeWeight(1);
  line(ax, ay, bx, by);
  line(bx, by, cx, cy);
  // line(cx, cy, dx, dy);
  // line(dx, dy, ax, ay);
  line(ax, ay, cx, cy);
  strokeWeight(.5);
  line(ax, ay, m.x, m.y);
  line(cx, cy, n.x, n.y);

  noStroke();
  fill(255, 0, 0);
  ellipse(ax, ay, 5, 5);
  ellipse(bx, by, 5, 5);
  ellipse(cx, cy, 5, 5);
  // ellipse(dx, dy, 5, 5);

  beginShape();
  fill(150);
  // noStroke();
  vertex(ax, ay);
  vertex(m.x, m.y);
  vertex(n.x, n.y);
  vertex(cx, cy);
  endShape(CLOSE);

  fill(255, 0, 255);
  stroke(0);
  text("A", ax, ay);
  text("B", bx, by);
  text("C", cx, cy);
  // text("D", dx, dy);

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
  fill(0);
  x = floor(x);
  y = floor(y);
  ellipse(x, y, 5, 5);
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

  let c0 = createVector(width, 0);
  let c1 = createVector(0, 0);
  let c2 = createVector(0, height);
  let c3 = createVector(width, height);
  screenCorners = [c0, c1, c2, c3];

  let orientation = orientations();

  function orientations() {
    let ax = polyCorners[0].x;
    let ay = polyCorners[0].y;
    let bx = polyCorners[1].x;
    let by = polyCorners[1].y;
    let cx = polyCorners[2].x;
    let cy = polyCorners[2].y;

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

    console.log("m " + m.x + ", " + m.y + ", n " + n.x + ", " + n.y);
    if (mCorner.x == nCorner.x || mCorner.y == nCorner.y) {
      //m and n are on same edge
    } else {
      let tempB = polyCorners[1];
      // let tempB = createVector(polyCorners[2], polyCorners[3]);
      let longestDist = 0;
      let tempIndex;
      for (let i = 0; i < 4; i++) {
        let tempDist = tempB.dist(screenCorners[i])
        if (tempDist > longestDist) {
          longestDist = tempDist;
          tempIndex = i;
        }
      }
      pCorner = screenCorners[tempIndex];
      // console.log("p " + pCorner.x + ", " + pCorner.y);
    }
    poly5(m, n, mCorner, nCorner, pCorner);
  }

  // let d = pointD(m, n, mCorner, nCorner, pCorner);
  // console.log("d " + d);
}

function poly5(m, n, mCorner, nCorner, pCorner) {
  fill(100);
  beginShape();
  vertex(m.x, m.y);
  vertex(mCorner.x, mCorner.y);
  vertex(pCorner.x, pCorner.y);
  vertex(nCorner.x, nCorner.y);
  vertex(n.x, n.y);
  endShape(CLOSE);
}

function pointD(m, n, mCorner, nCorner, pCorner) {

  let minVect = minVector();
  let maxVect = maxVector();

  let p = new pVector(minVect, maxVect);
  p.createP();
  p.pinkRect();
  guessPoint(p);


  // let test = m.x;
// let xArray = [m, n, mCorner, nCorner, pCorner];
// let xMin = width;
// let xMax = 0;
//
// for (let i = 0; i < xArray.length; i++) {
//   if (xArray[i] != null) {
//     let tempX = xArray[i].x;
//
//     if (xMin > tempX) {
//       xMin = tempX;
//     }
//     if (xMax < tempX) {
//       xMax = tempX;
//     }
//   }
//
// }
  //   console.log("xMin, xMax " +xMin +", " + xMax);
  // let randX = floor(random(xMax - xMin) + xMin);
  // let d = randX;
  // fill(255, 0, 0);
  // noStroke();
  // ellipse(randX, 100, 5, 5);
  // stroke(.5);
  // fill(255, 0, 255);
  // text("D", randX, 100);
  return d;
}

class pVector {
  constructor(minVect, maxVect) {
    this.min = minVect;
    this.max = maxVect;
  }
  createP() {
    this.x = floor(random(this.max.x - this.min.x) + this.min.x);
    this.y = floor(random(this.max.y - this.min.y) + this.min.y);
    this.p = createVector(this.x, this.y);
  }
  pinkRect() {
    noFill();
    strokeWeight(1);
    stroke(255, 0, 255);
    rect(this.min.x, this.min.y, this.max.x - this.min.x, this.max.y - this.min.y);
  }
  cyanSpot() {
    noStroke();
    fill(0, 255, 255);
    ellipse(this.x, this.y, 5, 5);
  };
}

function inside(polyCorners, px, py) {
  let inside = false;
  let next = 0;
  for (let current = 0; current < polyCorners.length; current++) {
    // last vertex == first vertex
    next = current + 1;
    if (next == polyCorners.length) next = 0;

    let vc = polyCorners[current];
    let vn = polyCorners[next];

    // let vc = createVector(polyCorners[current].x, polyCorners[current].y);
    // let vn = createVector(polyCorners[next].x, polyCorners[next].y);

    if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) &&
      (px < (vn.x - vc.x) * (py - vc.y) / (vn.y - vc.y) + vc.x)) {
      inside = !inside;
    }
  }
  console.log(inside);
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

function guessPoint(p) {
  let hit = false;
  for (let i = 0; i < 100; i++) {
    p.createP();
    p.cyanSpot();
    let hit = inside(polyCorners, p.x, p.y);
    if (hit) {
      break;
    }
  }
}

function drawShape() {
  fill(0, 150, 255);
  noStroke();
  beginShape();
  for (let v of polyCorners) {
    vertex(v.x, v.y);
  }
  endShape();
}

//fade in with a stored pixel array of calculated image

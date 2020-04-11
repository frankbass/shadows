let greys = [];
let corners = [];

function setup() {
  createCanvas(400, 400);
  // noStroke();
  // arrays();
  // dots();

  // lines(50, 50, 25, 150, 285, 300, 250, 25);

  corners = randomCorners();
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

  // stroke(0);
  // fill(255, 0, 255);
  // text("a", ax, ay);
  // text("b", bx, by);
  // text("c", cx, cy);
  // text("d", dx, dy);
}

function mousePressed() {
  boxes();
}

function keyPressed() {
  // console.log(keyCode);
  if (keyCode == 13) {
    boxes();
  }
  if (keyCode == 32) {

    let ax = random(width * 2) - width;
    let ay = random(height * 2) - height;
    let bx = random(width * 2) - width;
    let by = random(height * 2) - height;
    let cx = random(width * 2) - width;
    let cy = random(height * 2) - height;
    let dx = random(width * 2) - width;
    let dy = random(height * 2) - height;
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
  let bx = floor(random(width - buffer * 2) + buffer);
  let by = floor(random(height - buffer * 2) + buffer);
  let cx = floor(random(width - buffer * 2) + buffer);
  let cy = floor(random(height - buffer * 2) + buffer);
  // let dx = floor(random(width));
  // let dy = floor(random(height));

  // boxes(ax, ay, bx, by, cx, cy);

  return [ax, ay, bx, by, cx, cy];
}

function boxes() {
  background(255);
  noFill();
  rect(0, 0, width - 1, height - 1);
  let ax = corners[0];
  let ay = corners[1];
  let bx = corners[2];
  let by = corners[3];
  // let cx = corners[4];
  // let cy = corners[5];
  let cx = mouseX;
  let cy = mouseY;
  // console.log("cx, cy: " + cx + ", " + cy);
  let slopeBA = (ay - by) / (ax - bx);
  let slopeBC = (cy - by) / (cx - bx);
  //
  // console.log("BA "+slopeBA);
  // console.log("BC "+slopeBC);


  let mBA = degrees(atan2(ay - by, ax - bx));
  let mBC = degrees(atan2(cy - by, cx - bx));

  let bcQuad = quadrants(mBC);
  let baQuad = quadrants(mBA);

  let m = endPoint(ax, ay, slopeBA, baQuad);
  let n = endPoint(cx, cy, slopeBC, bcQuad);

  fourCorners(m, n, baQuad, bcQuad);

  // let diffAng = abs(slopeBA - slopeBC);
  // let diffAng = (abs(mBA - mBC));
  // if (diffAng > 180) {
  //   let temp = diffAng % 180;
  //   diffAng = 180 - temp;
  // }

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
  // missing corner? vertex
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
  let cornerArray = [c0, c1, c2, c3];

  let orientation = orientations();
  function orientations() {
    let ax = corners[0];
    let ay = corners[1];
    let bx = corners[2];
    let by = corners[3];
    // let cx = corners[4];
    // let cy = corners[5];
    let cx = mouseX;
    let cy = mouseY;

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

  if (m.x == n.x || m.y == n.y) {
  } else {
    let mO = orientation;
    let nO = orientation * -1;
    let mCorner = cornerCalculator(m, mO);
    let nCorner = cornerCalculator(n, nO);

    // console.log(mCorner.x +", "+ mCorner.y);
    // console.log(nCorner.x +", "+ nCorner.y);
    function cornerCalculator(vector, orient) {
      let corner;
      if (orient == 1) {
        if (vector.x == 0) {
          corner= cornerArray[1];
        }
        if (vector.x == width) {
          corner= cornerArray[3];
        }
        if (vector.y == 0) {
          corner= cornerArray[0];
        }
        if (vector.y == height) {
          corner= cornerArray[2];
        }
      } else if (orient == -1) {
        if (vector.x == 0) {
          corner= cornerArray[2];
        }
        if (vector.x == width) {
          corner= cornerArray[0];
        }
        if (vector.y == 0) {
          corner= cornerArray[1];
        }
        if (vector.y == height) {
          corner= cornerArray[3];
        }
      }
      return corner;
    }

    trapazoid(m, n, mCorner, nCorner);
  }


}

function trapazoid(m, n, mCorner, nCorner) {
  fill(100);
  beginShape();
  vertex(m.x, m.y);
  vertex(mCorner.x, mCorner.y);
  vertex(nCorner.x, nCorner.y);
  vertex(n.x, n.y);
  endShape(CLOSE);
}

//fade in with a stored pixel array of calculated image

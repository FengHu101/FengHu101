let pageIndex = 0;

let img = [];
let img1;
let img2;
let imgPosX = [];
let imgPosY = [];
let song;
function preload() {
  for (let i = 0; i < 5; i++) {
    img[i] = loadImage(i + ".png");
  }
  img1 = loadImage("6.png");
  img2 = loadImage("22.png");
  song = loadSound("1.mp3");
}

// Initiating
function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 5; i++) {
    imgPosX[i] = random(width);
    imgPosY[i] = random(height);
  }
  img2.resize(width, height);
}

function draw() {
  background(255);
  switch (pageIndex) {
    case 0:
      startPage();
      break;
    case 1:
      Page1();
      break;
    case 2:
      Page2();
      break;
    case 3:
      Page3();
      break;
    case 4:
      Page4();
      break;
    case 5:
      Page5();
      break;
    case 6:
      Page6();
      break;
    case 7:
      Page7();
      break;
    case 8:
      Page8();
      break;
    case 9:
      Page9();
      break;
    case 10:
      Page10();
      break;
    default:
      startPage();
      break;
  }
}

function keyPressed() {
  pageIndex = 0;
  song.stop();
}

function mousePressed() {
  console.log("mousePressed");
  if (pageIndex == 0) {
    for (let i = 0; i < 5; i++) {
      if (dist(((i + 1) * width) / 6, height * 0.3, mouseX, mouseY) < 70) {
        pageIndex = i + 1;
      }
    }

    for (let i = 0; i < 5; i++) {
      if (dist(((i + 1) * width) / 6, height * 0.7, mouseX, mouseY) < 70) {
        pageIndex = i + 6;
      }
    }
  } else if (pageIndex == 5) {
    let cTm = song.currentTime();
    if (cTm > 1) {
      song.jump(cTm - 1);
    }
  }

  console.log(pageIndex);
  loop();
}

function startPage() {
  push();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(16);
  stroke(0);
  noFill();
  for (let i = 0; i < 5; i++) {
    rect(((i + 1) * width) / 6, height * 0.3, 100, 50);
  }

  fill(0);
  for (let i = 1; i < 6; i++) {
    text("PAGE" + i, (i * width) / 6, height * 0.3);
  }

  stroke(0);
  noFill();
  for (let i = 0; i < 5; i++) {
    rect(((i + 1) * width) / 6, height * 0.7, 100, 50);
  }

  fill(0);
  for (let i = 6; i < 11; i++) {
    text("PAGE" + i, ((i - 5) * width) / 6, height * 0.7);
  }
  pop();
}

// Four Corners
function Page1() {
  push();
  fill(255, 0, 0);
  for (let i = 0; i < 4; i++) {
    ellipse(floor(i % 2) * width, floor(i / 2) * height, 100, 100);
  }
  pop();
}
// Four Corner Conditional
function Page2() {
  fill(255, 0, 0);
  for (let i = 0; i < 4; i++) {
    // ellipse(floor(i % 2) * width, floor(i / 2) * height, 100, 100);
    if (i == 0) {
      ellipse(50, 50, 100, 100);
    } else if (i == 1) {
      rect(width - 100, 0, 100, 100);
    } else if (i == 2) {
      triangle(50, height - 100, 0, height, 100, height);
    } else {
      arc(width - 50, height - 50, 100, 100, 0, PI);
    }
  }
  pop();
}
// N Corner
let aX = [];
let aY = [];
function Page3() {
  aX = [];
  aY = [];
  let N = floor(random(5, 15));
  push();
  noFill();
  stroke(0);
  beginShape();
  for (let i = 0; i < N; i++) {
    let angle = random((i * 2 * PI) / N, ((i + 1) * 2 * PI) / N);
    let x = width * 0.5 + 400 * sin(angle);
    let y = height * 0.5 + 400 * cos(angle);
    vertex(x, y);
    aX.push(x);
    aY.push(y);
  }
  endShape(CLOSE);

  for (let i = 0; i < aX.length; i++) {
    push();
    beginShape();
    let n = floor(random(3, 10));
    fill(255, 0, 0);
    for (let j = 0; j < n; j++) {
      let angle1 = random((j * 2 * PI) / n, ((j + 1) * 2 * PI) / n);
      let x1 = aX[i] + 20 * sin(angle1);
      let y1 = aY[i] + 20 * cos(angle1);
      vertex(x1, y1);
    }
    endShape(CLOSE);
    pop();
  }

  pop();
  noLoop();
}
// Rule of Thirds
function Page4() {
  image(img2, 0, 0);
  push();
  stroke(0);
  for (let i = 0; i < 3; i++) {
    let x = (width / 3) * i;
    let y = 0;
    let x1 = (width / 3) * i;
    let y1 = height;
    line(x, y, x1, y1);
  }

  for (let i = 0; i < 3; i++) {
    let x = 0;
    let y = (i * height) / 3;
    let x1 = width;
    let y1 = (i * height) / 3;
    line(x, y, x1, y1);
  }
  pop();
}
// Reverse Audio
function Page5() {
  if (song.isPlaying()) {
  } else {
    song.play();
  }

  push();
  fill(0);
  textSize(36);
  text("CLICK TO BACKWARDS AUDIO", width * 0.5, height * 0.5);
  pop();
}
// Array of Images
function Page6() {
  push();
  for (let i = 0; i < 5; i++) {
    imgPosX[i] = imgPosX[i] + random(1, 3);
    imgPosY[i] = imgPosY[i] + random(1, 3);

    if (imgPosX[i] > width) {
      imgPosX[i] = 0;
    }

    if (imgPosY[i] > height) {
      imgPosY[i] = 0;
    }

    image(img[i], imgPosX[i], imgPosY[i]);
  }

  pop();
}

// Photo Filter
function Page7() {
  push();
  image(img1, 0, 0);
  if (frameCount % 100 < 10) {
    filter(INVERT);
    text("INVERT", 20, 20);
  } else if (frameCount % 100 < 20) {
    filter(THRESHOLD);
    text("THRESHOLD", 20, 20);
  } else if (frameCount % 100 < 30) {
    filter(GRAY);
    text("GRAY", 20, 20);
  } else if (frameCount % 100 < 40) {
    filter(DILATE);
    text("DILATE", 20, 20);
  } else if (frameCount % 100 < 50) {
    filter(ERODE);
    text("ERODE", 20, 20);
  } else if (frameCount % 100 < 60) {
    filter(POSTERIZE, 2);
    text("POSTERIZE 2", 20, 20);
  } else if (frameCount % 100 < 70) {
    filter(POSTERIZE, 4);
    text("POSTERIZE 4", 20, 20);
  } else if (frameCount % 100 < 80) {
    filter(BLUR, 3);
    text("BLUR 3", 20, 20);
  } else if (frameCount % 100 < 90) {
    filter(BLUR, 12);
    text("BLUR 12", 20, 20);
  }
  pop();
}

// Seal Text
function Page8() {
  push();
  let str = "Hello,P5JS!Welcome";
  translate(width * 0.5, height * 0.5);
  for (let i = 0; i < str.length; i++) {
    text(str.substring(i, i + 1), -100, 0);
    rotate(PI / str.length);
  }
  pop();
}

// Composite Bytes
function Page9() {
  let food = getFood();

  push();
  if (food.type == "img") {
    image(food.data, 0, 0);
  }

  if (food.type == "txt") {
    text(food.data, width * 0.5, height * 0.5);
  }

  if (food.type == "graphic") {
    image(food.data, 0, 0);
  }
  pop();
  noLoop();
}

function getFood() {
  let ret = {};
  let val = random(3);
  if (val < 1) {
    ret = {
      type: "img",
      data: img1,
    };
  } else if (val < 2) {
    ret = {
      type: "txt",
      data: "hello,world",
    };
  } else {
    let pg = createGraphics(100, 100);
    pg.background(100);
    pg.noStroke();
    pg.ellipse(pg.width / 2, pg.height / 2, 50, 50);
    ret = {
      type: "graphic",
      data: pg,
    };
  }
  return ret;
}

// Loose Leaf
let leafs = [];
function Page10() {
  leafs = [];
  for (let i = 0; i < 20; i++) {
    leafs[i] = new Leaf(random(width), random(height), random(2 * PI));
  }

  for (let i = 0; i < leafs.length; i++) {
    leafs[i].draw();
  }
  noLoop();
}

class Leaf {
  constructor(x_, y_, angle_) {
    this.x = x_;
    this.y = y_;
    this.angle = angle_;
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(0, 255, 0);
    quad(0, 0, -10, 10, 0, -20, 10, 10);
    line(0, 0, 0, 20);

    pop();
  }
}

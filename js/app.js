"use strict";
const maxDots = 2000;
const startRadius = 20;
const pallete = [];
let dots = []

let canvas = document.getElementById('schmear');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

let bounds = canvas.getBoundingClientRect();

let ctx = canvas.getContext("2d");

let randomInt = (max) => Math.floor(Math.random() * max);
let rgb = (r,g,b) => "rgb(" + [r,g,b] + ")";
let addDot = function(x, y, color) {
  ctx.beginPath();
    ctx.fillStyle = color; // "rgb(" + [r,g,b] + ")";
    ctx.arc(x, y, startRadius, 0, 2 * Math.PI, false);
  ctx.fill();
}

let position = (x, y, width) => 4 * (x * width + y);
let neighbors = (x, y, width) => [
  position(x-1, y-1, width),
  position(x-1, y  , width),
  position(x-1, y+1, width),
  position(x,   y+1, width),
//  position(x,   y  , width),
  position(x,   y-1, width),
  position(x+1, y-1, width),
  position(x+1, y  , width),
  position(x+1, y+1, width),
];

let convolve = function() {
  let imgData = ctx.getImageData(0,0,canvas.width, canvas.height);
  let pixelCount = canvas.width * canvas.height;
  let nextFrame = ctx.createImageData(imgData);

  for (let x = 1; x < imgData.height - 1; x++) {
    for (let y = 1; y < imgData.width - 1; y++) {
      let thisPosition = position(x,y,imgData.width);
      let myNeighbors = neighbors(x,y,imgData.width);
      let avgR = imgData.data[thisPosition];
      let avgG = imgData.data[thisPosition+1];
      let avgB = imgData.data[thisPosition+2];

      for (let i = 0; i < myNeighbors.length; i++) {
        avgR = avgR + imgData.data[myNeighbors[i]];
        avgG = avgG + imgData.data[myNeighbors[i]+1];
        avgB = avgB + imgData.data[myNeighbors[i]+2];
      }

      nextFrame.data[thisPosition] = avgR / 9;
      nextFrame.data[thisPosition+1] = avgG / 9;
      nextFrame.data[thisPosition+2] = avgB / 9;
      nextFrame.data[thisPosition+3] = 255;
    }
  }
  ctx.putImageData(nextFrame, 0,0);
}

let setup = function() {
  let startColor = "rgb(188, 190, 224)";
  ctx.fillStyle = "rgb(20%, 20%, 20%)";
  ctx.fillRect(0,0,bounds.width, bounds.height);
  addDot(randomInt(bounds.width), randomInt(bounds.height), startColor);
  addDot(randomInt(bounds.width), randomInt(bounds.height), startColor);
  addDot(randomInt(bounds.width), randomInt(bounds.height), startColor);
  addDot(randomInt(bounds.width), randomInt(bounds.height), startColor);
  addDot(randomInt(bounds.width), randomInt(bounds.height), startColor);
  addDot(randomInt(bounds.width), randomInt(bounds.height), startColor);
};

let frameCounter = 0;

let render = function() {
  frameCounter++;
  convolve();
//  if (frameCounter % 10 == 0) { convolve(); }
  requestAnimationFrame(render);
};

window.addEventListener('click', function() {
  let r = randomInt(256),
      g = randomInt(256),
      b = randomInt(256);

  addDot(event.clientX,event.clientY, rgb(r,g,b));
});

setup();
render();

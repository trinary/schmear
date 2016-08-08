"use strict";
function createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

// Get A WebGL context
let canvas = document.getElementById("main");
let gl = canvas.getContext("experimental-webgl");

// setup GLSL program
let vertexShader = createShader(gl, gl.VERTEX_SHADER,document.getElementById('vertexShader').textContent);
let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER,document.getElementById('fragmentShader').textContent);

let program = createProgram(gl, vertexShader, fragmentShader);
gl.useProgram(program);

// look up where the vertex data needs to go.
let positionLocation = gl.getAttribLocation(program, "a_position");

// Create a buffer and put a single clipspace rectangle in
// it (2 triangles)
let buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
   -1.0, -1.0,
    1.0, -1.0,
   -1.0,  1.0,
   -1.0,  1.0,
    1.0, -1.0,
    1.0,  1.0]), gl.STATIC_DRAW);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// draw
gl.drawArrays(gl.TRIANGLES, 0, 6);


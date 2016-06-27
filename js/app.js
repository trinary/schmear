"use strict";
const maxDots = 2000;
const startRadius = 20;
const pallete = [];
let dots = []

let canvas = document.getElementById('schmear');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

let gl = twgl.getWebGLContext(canvas);

let bounds = canvas.getBoundingClientRect();

var programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);

var arrays = {
  position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
};
var bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

function render(time) {
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  var uniforms = {
    time: time * 0.001,
    resolution: [gl.canvas.width, gl.canvas.height],
  };

  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, uniforms);
  twgl.drawBufferInfo(gl, gl.TRIANGLES, bufferInfo);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

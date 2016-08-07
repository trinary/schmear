"use strict";

/* global window, document, LumaGL */
/* eslint-disable no-var, max-statements, indent, no-multi-spaces */


window.webGLStart = function() {

  var createGLContext = LumaGL.createGLContext;
  var loadTextures = LumaGL.loadTextures;
  var getShadersFromHTML = LumaGL.addons.getShadersFromHTML;
  var PerspectiveCamera = LumaGL.PerspectiveCamera;
  var Fx = LumaGL.Fx;
  var Vec3 = LumaGL.Vec3;
  var Mat4 = LumaGL.Mat4;
  var Geometry = LumaGL.Geometry;
  var Model = LumaGL.Model;
  var Program = LumaGL.Program;

  var cubeGeometry = new Geometry({
    positions: new Float32Array([
      -1, -1,  1,
      1, -1,  1,
      1,  1,  1,
      -1,  1,  1,

      -1, -1, -1,
      -1,  1, -1,
      1,  1, -1,
      1, -1, -1,

      -1,  1, -1,
      -1,  1,  1,
      1,  1,  1,
      1,  1, -1,

      -1, -1, -1,
      1, -1, -1,
      1, -1,  1,
      -1, -1,  1,

      1, -1, -1,
      1,  1, -1,
      1,  1,  1,
      1, -1,  1,

      -1, -1, -1,
      -1, -1,  1,
      -1,  1,  1,
      -1,  1, -1
    ]),

    texCoords: new Float32Array([
      // Front face
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,

      // Back face
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      // Top face
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,

      // Bottom face
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      // Right face
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      // Left face
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0
    ]),

    indices: new Uint16Array([
      0, 1, 2, 0, 2, 3,
      4, 5, 6, 4, 6, 7,
      8, 9, 10, 8, 10, 11,
      12, 13, 14, 12, 14, 15,
      16, 17, 18, 16, 18, 19,
      20, 21, 22, 20, 22, 23
    ])
  });

  var canvas = document.getElementById('mainCanvas');
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  var gl = createGLContext({canvas});

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  loadTextures(gl, {
    urls: ['/data/blm.gif']
  })
  .then(function(textures) {

    var baseImage = textures[0];

    debugger;
    var program = new Program(gl, getShadersFromHTML({
      vs: 'vertexShader',
      fs: 'fragmentShader'
    }));

    var cube = new Model({
      geometry: cubeGeometry,
      program,
      uniforms: {
        u_image: baseImage
      }
    });

    var camera = new PerspectiveCamera({aspect: canvas.width / canvas.height});

    var rCube = 0;

    function drawScene() {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // get new view matrix out of element and camera matrices
      var view = new Mat4();
      view.mulMat42(camera.view, cube.matrix);
      // draw Cube
      rCube += 0.01;

      cube
        // update element matrix
        .setPosition(new Vec3(0, 0, -5))
        .setRotation(new Vec3(rCube, rCube, rCube))
        .updateMatrix()

        // set uniforms
        .setUniforms({
          uMVMatrix: view,
          uPMatrix: camera.projection
        })

        // draw triangles
        .render();

      // gl.drawElements(
      // gl.TRIANGLES, cube.getVertexCount(), gl.UNSIGNED_SHORT, 0
      // );
      // request new frame
      Fx.requestAnimationFrame(drawScene);
    }

    drawScene();
  });

};

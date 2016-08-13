/* global window, document, LumaGL */
/* eslint-disable no-var, max-statements, indent, no-multi-spaces */
window.webGLStart = function() {

  var createGLContext = LumaGL.createGLContext;
  var loadTextures = LumaGL.loadTextures;
  var getShadersFromHTML = LumaGL.addons.getShadersFromHTML;
  var OrthoCamera = LumaGL.OrthoCamera;
  var Fx = LumaGL.Fx;
  var Vec3 = LumaGL.Vec3;
  var Mat4 = LumaGL.Mat4;
  var Geometry = LumaGL.Geometry;
  var Model = LumaGL.Model;
  var Program = LumaGL.Program;

  var canvas = document.getElementById('lesson05-canvas');
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

    var nehe = textures[0];

    var program = new Program(gl, getShadersFromHTML({
      vs: 'shader-vs',
      fs: 'shader-fs'
    }));

    var planeGeometry = new LumaGL.PlaneGeometry({
      type: 'x,y',
      xlen: 10,
      ylen: 20,
      nx: 5,
      nz: 5,
      offset: 0,
      colors: [1, 0, 1, 1]
    });

    var plane = new Model({
      program: program,
      geometry: planeGeometry,
      uniforms: {
        uSampler: nehe
      }
    });

    var camera = new OrthoCamera({
      aspect: canvas.width / canvas.height,
      near: 0.1,
      far: 100,
      position: new Vec3(0, 0, 10),
      target: new Vec3(0,0,0)
    });

    function drawScene() {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // get new view matrix out of element and camera matrices
      // draw Cube

      plane.render();

      Fx.requestAnimationFrame(drawScene);
    }

    drawScene();
  });

};

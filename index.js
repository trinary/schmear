/* global window, document, LumaGL */
/* eslint-disable no-var, max-statements, indent, no-multi-spaces */

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

  var planeGeometry = new LumaGL.PlaneGeometry({
    type: 'x,y',
    xlen: 10,
    ylen: 20,
    nx: 5,
    nz: 5,
    offset: 0,
    colors: [1, 0, 1]
  });

  var canvas = document.getElementById('main');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
//  canvas.width = canvas.clientWidth;
//  canvas.height = canvas.clientHeight;

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

//    var program = new Program(gl, getShadersFromHTML({
//      vs: 'shader-vs',
//      fs: 'shader-fs',
//    }));
    var program = new Program(gl);

    var plane = new Model({
      program,
      geometry: planeGeometry,
      uniforms: {
        texture: nehe
      }
    });

    var camera = new OrthoCamera({
      fov: 45,
      aspect: canvas.width / canvas.height,
      near: 0.1,
      far: 100,
      target: new Vec3(0, 0, 0),
      position: new Vec3(0, 0, 10)});

    function drawScene() {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      plane.render();

      Fx.requestAnimationFrame(drawScene);
    }

    drawScene();
  });


"use strict";

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

let container, stats, svg, circle;
let camera, scene, renderer;
let uniforms, convolutionMaterial;

init();
animate();

function init() {
	container = document.getElementById('container');

	camera = new THREE.Camera();
	camera.position.z = 1;

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	container.appendChild(renderer.domElement);

	let geometry = new THREE.PlaneBufferGeometry( 2, 2 );

	uniforms = {
		time:       { value: 1.0 },
		resolution: { value: new THREE.Vector2() }
	};

//	let vertexSourceCode = document.getElementById('vertexShader').textContent;
//	let	fragmentSourceCode = document.getElementById('fragmentShader').textContent;
//  let gl = renderer.context;
//
//  let glVertexShader = new THREE.WebGLShader( gl, gl.VERTEX_SHADER, vertexSourceCode );
//  let glFragmentShader = new THREE.WebGLShader( gl, gl.FRAGMENT_SHADER, fragmentSourceCode );
//
//  let program = gl.createProgram();
//
//  gl.attachShader( program, glVertexShader );
//  gl.attachShader( program, glFragmentShader );
//
//  loadImage(program);
//
//  gl.linkProgram(program);
//
  let material = new THREE.RawShaderMaterial( {
    uniforms: uniforms,
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent
  } );

	let mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	stats = new Stats();
	container.appendChild(stats.dom);

	onWindowResize();

	window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize(event) {
	renderer.setSize(window.innerWidth, window.innerHeight);

	uniforms.resolution.value.x = renderer.domElement.width;
	uniforms.resolution.value.y = renderer.domElement.height;
}

function animate() {
	requestAnimationFrame( animate );

	render();
	stats.update();
}

function loadImage(program) {
  let url = "/data/blm.jpg";
  let img = new Image();
  img.src = url;
  img.onload = function() {
    let texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

    // provide texture coordinates for the rectangle.
    let texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
          0.0,  0.0,
          1.0,  0.0,
          0.0,  1.0,
          0.0,  1.0,
          1.0,  0.0,
          1.0,  1.0]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Create a texture.
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  }
}

function render() {
	uniforms.time.value += 0.05;
	renderer.render(scene, camera);
}

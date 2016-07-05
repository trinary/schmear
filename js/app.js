"use strict";

console.log("asdf");
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

let container, stats;
let camera, scene, renderer;
let uniforms;

init();
animate();

function init() {

	container = document.getElementById('container');

	camera = new THREE.Camera();
	camera.position.z = 1;
  let mouseDown = false;

	scene = new THREE.Scene();

	let geometry = new THREE.PlaneBufferGeometry( 2, 2 );

	uniforms = {
		time:       { value: 1.0 },
		resolution: { value: new THREE.Vector2() }
	};

	let material = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('fragmentShader').textContent

	} );

	let mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	container.appendChild(renderer.domElement);

	stats = new Stats();
	container.appendChild(stats.dom);

	onWindowResize();

	window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('mousedown', onMouseDown, false);

}

function onMouseDown(event) {
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

function render() {
	uniforms.time.value += 0.05;
	renderer.render(scene, camera);
}

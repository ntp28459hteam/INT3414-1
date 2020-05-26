import * as THREE from './node_modules/three/build/three.module.js';
import {
    OrbitControls
} from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import {
    OBJLoader
} from './node_modules/three/examples/jsm/loaders/OBJLoader.js';

import { MTLLoader } from './node_modules/three/examples/jsm/loaders/MTLLoader.js';
// Create scene
var scene = new THREE.Scene();

// Create renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 15;
camera.position.y = 11;
camera.position.z = 17;
scene.add(camera);

// create AmbientLight
var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
scene.add(ambientLight);

// create PointLight
var pointLight = new THREE.PointLight(0xffffff, 0.8);
camera.add(pointLight);

//create controls
var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;

controls.screenSpacePanning = false;

controls.maxPolarAngle = Math.PI / 2;
// instantiate a loader

var mtlLoader = new MTLLoader();

mtlLoader.load(
	'./objs/Kitchen.mtl',
	function (materials) {
		materials.preload();
		var objLoader = new OBJLoader( );
		objLoader.setMaterials( materials );
		objLoader.load(
			'./objs/Kitchen.obj',
			
			function (object) {
				scene.add(object);
			}
			
		);
	
	}
	
);

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
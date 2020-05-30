import * as THREE from './node_modules/three/build/three.module.js';
import {
	OrbitControls
} from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import {
	OBJLoader
} from './node_modules/three/examples/jsm/loaders/OBJLoader.js';
import {
	FresnelShader
} from './node_modules/three/examples/jsm/shaders/FresnelShader.js';
import {
	GUI
} from './node_modules/three/examples/jsm/libs/dat.gui.module.js';

// Create clock
var clock = new THREE.Clock()

GUI.prototype.removeFolder = function (name) {
	var folder = this.__folders[name];
	if (!folder) {
		return;
	}
	folder.close();
	this.__ul.removeChild(folder.domElement.parentNode);
	delete this.__folders[name];
	this.onResize();
}

function handleColorChange(color) {

	return function (value) {

		if (typeof value === 'string') {

			value = value.replace('#', '0x');

		}

		color.setHex(value);

	};

}


function guiMeshPhysicalMaterial(gui, material) {

	var data = {
		color: material.color.getHex(),
		emissive: material.emissive.getHex(),

	};

	var folder = gui.addFolder('MeshPhysicalMaterial');

	folder.addColor(data, 'color').onChange(handleColorChange(material.color));
	folder.addColor(data, 'emissive').onChange(handleColorChange(material.emissive));
}

var gui = new GUI();
var material = new THREE.MeshPhysicalMaterial({
	color: 0x2194CE
});
guiMeshPhysicalMaterial(gui, material);

// Create scene
var scene = new THREE.Scene();

// Create renderer
var renderer = new THREE.WebGLRenderer({
	antialias: true
});

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


var textureLoader = new THREE.TextureLoader();

var floorAO = textureLoader.load(
	'./objs/Kitchen/materials/concrete_floor_02_4k_jpg/concrete_floor_02_AO_4k.jpg');
var floorBump = textureLoader.load(
	'./objs/Kitchen/materials/concrete_floor_02_4k_jpg/concrete_floor_02_bump_4k.jpg');
var floorDiffuse = textureLoader.load(
	'./objs/Kitchen/materials/concrete_floor_02_4k_jpg/concrete_floor_02_diff_4k.jpg');
var floorDisplacement = textureLoader.load(
	'./objs/Kitchen/materials/concrete_floor_02_4k_jpg/concrete_floor_02_Disp_4k.jpg');
var floorNormal = textureLoader.load(
	'./objs/Kitchen/materials/concrete_floor_02_4k_jpg/concrete_floor_02_Nor_4k.jpg');
var floorRough = textureLoader.load(
	'./objs/Kitchen/materials/concrete_floor_02_4k_jpg/concrete_floor_02_rough_4k.jpg');
var floorSpecular = textureLoader.load(
	'./objs/Kitchen/materials/concrete_floor_02_4k_jpg/concrete_floor_02_spec_4k.jpg');

var wallAO = textureLoader.load(
	'./objs/Kitchen/materials/white_plaster_03_4k_jpg/white_plaster_03_ao_4k.jpg');
var wallDiffuse = textureLoader.load(
	'./objs/Kitchen/materials/white_plaster_03_4k_jpg/white_plaster_03_diff_4k.jpg');
var wallDisplacement = textureLoader.load(
	'./objs/Kitchen/materials/white_plaster_03_4k_jpg/white_plaster_03_disp_4k.jpg');
var wallNormal = textureLoader.load(
	'./objs/Kitchen/materials/white_plaster_03_4k_jpg/white_plaster_03_nor_4k.jpg');
var wallRough = textureLoader.load(
	'./objs/Kitchen/materials/white_plaster_03_4k_jpg/white_plaster_03_rough_4k.jpg');
var wallRoughAO = textureLoader.load(
	'./objs/Kitchen/materials/white_plaster_03_4k_jpg/white_plaster_03_rough_ao_4k.jpg');

var wallMaterial = new THREE.MeshStandardMaterial({
	aoMap: wallAO,
	aoMapIntensity: 0.5,
	map: wallDiffuse,
	displacementMap: wallDisplacement,
	displacementScale: 0.1,
	displacementBias: 0.0,
	normalMap: wallNormal,
	roughnessMap: wallRough,
	roughness: 0.5
});

var floorMaterial = new THREE.MeshStandardMaterial({
	aoMap: floorAO,
	aoMapIntensity: 0.5,
	map: floorDiffuse,
	displacementMap: floorDisplacement,
	displacementScale: 0.1,
	displacementBias: 0.0,
	normalMap: floorNormal,
	roughnessMap: floorRough,
	roughness: 0.5
});
var floorMaterial2 = new THREE.MeshStandardMaterial({
	color: 0xffffff,
	roughness: 0.1
});
var wallMaterial2 = new THREE.MeshStandardMaterial({
	color: 0xffffff,
	roughness: 0.0
});

var path = "./objs/textures/cube/Park2/";
var format = '.jpg';
var urls = [
	path + 'posx' + format, path + 'negx' + format,
	path + 'posy' + format, path + 'negy' + format,
	path + 'posz' + format, path + 'negz' + format
];

var textureCube = new THREE.CubeTextureLoader().load(urls);

// scene = new THREE.Scene();
scene.background = textureCube;

var shader = FresnelShader;
var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

uniforms["tCube"].value = textureCube;

var glassMaterial = new THREE.MeshBasicMaterial({
	color: 0xffffff,
	// opacity: 0.0,
	// transparent: true,
	// alphaMap: 0.1,
	envMap: scene.background
});

// var glassMaterial = new THREE.ShaderMaterial( {
// 	uniforms: uniforms,
// 	vertexShader: shader.vertexShader,
// 	fragmentShader: shader.fragmentShader
// } );

// var glassMaterial = new THREE.MeshLambertMaterial({
// 	color: 0xffffff,
// 	transparent: true,
// 	alphaMap: 0,
// 	opacity: 0.1
// });
var doorMaterial = new THREE.MeshStandardMaterial({
	color: 0xD1C7B9,
	roughness: 0.0
});
var material_assets = {
	'Floor_Balcony': floorMaterial,
	'Floor_Bedroom': floorMaterial,
	'Floor_Kitchen': floorMaterial,
	'Floor_LivingRoom': floorMaterial,
	'Floor_Bedroom.001': floorMaterial2,
	'Floor_Bedroom.002': floorMaterial2,
	'Wall_inner': wallMaterial2,
	'Wall_outer': wallMaterial,
	'Window.001': glassMaterial,
	'Window.002': glassMaterial,
	'Window.003': glassMaterial,
	'Window.004': glassMaterial,
	'Window.005': glassMaterial,
	'Door': doorMaterial,
	'Indoor': doorMaterial,
	'Indoor.001': doorMaterial,
	'Indoor.001': doorMaterial,
};

var objLoader = new OBJLoader();
objLoader.load(
	'./objs/Kitchen.obj',
	function (object) {
		var obj = object;
		obj.traverse(function (child) {
			console.log(child.name);
			var key = child.name.split('_Cube')[0]; // var key = child.name.substring(0,4).toLowerCase()
			if (material_assets.hasOwnProperty(key)) {
				// child.material.map = texture_assets[key]
				child.material = material_assets[key]
			}
		});
		obj.name = 'ROOM'
		console.log(obj);
		scene.add(obj);
	}

);
var objs = []

objLoader.load(
	'./objs/sofa_chair_.obj',
	function (object) {
		object.scale.set(0.02, 0.02, 0.02);
		object.position.x = -70
		object.position.z = -2
		object.name = 'SOFA'
		object.traverse(obj => objs.push(obj))

		scene.add(object);
	}

);

objLoader.load(
	'./objs/box.obj',
	function (object) {
		object.position.x = -70
		object.position.z = 42
		console.log(object);
		object.traverse(obj => objs.push(obj))

		scene.add(object);
	}

);


var tween = function (speed) {
	this.speed = speed;
	this.running = false;

	this.init = function (begin, end) {
		this.begin = begin;
		this.end = end;
		this.speed = speed;
		this.current = null
		this.time = 0;
		this.running = true

	}

	this.update = function (dt) {
		if (!this.running) return
		this.time += dt
		var begin = this.begin.clone()
		var end = this.end.clone()
		var ratio = this.time / (end.clone().sub(begin).length() / this.speed)
		this.current = begin.add(end.clone().sub(begin).multiplyScalar(ratio))

		if (ratio >= 1) {
			this.running = false;
			this.time = 0
		}
	}
}

var targetTween = new tween(20)
var cameraTween = new tween(0.5)

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onMouseUp(event) {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);

	var intersects = raycaster.intersectObjects(objs);

	if (intersects.length == 0) return
	var obj = intersects[0].object
	var objpos = obj.parent.position.clone()
	gui.removeFolder('MeshPhysicalMaterial')
	guiMeshPhysicalMaterial(gui, obj.material);
	targetTween.init(controls.target, objpos);
	var distance = camera.position.clone().sub(objpos).normalize()
	distance.y += 40
	distance.z += 5

	cameraTween.init(camera.position, objpos.clone().add(distance))

}
window.addEventListener('mouseup', onMouseUp, false);
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
	var dt = clock.getDelta()

	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);

	targetTween.update(dt)
	cameraTween.update(dt)

	if (cameraTween.running) {
		camera.position.copy(cameraTween.current)
	}


	if (targetTween.running) {
		camera.lookAt(targetTween.current);

		controls.target = targetTween.current
	}
}

animate();

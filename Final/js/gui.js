import {
    GUI
} from './node_modules/three/examples/jsm/libs/dat.gui.module.js';
import {
    Color,
    Float32BufferAttribute,
    RepeatWrapping,
    TextureLoader,
} from "./node_modules/three/build/three.module.js";

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
        map: diffuseMapKeys[0],

    };

    var folder = gui.addFolder('MeshPhysicalMaterial');

    folder.addColor(data, 'color').onChange(handleColorChange(material.color));
    folder.addColor(data, 'emissive').onChange(handleColorChange(material.emissive));
    folder.add(data, 'map', diffuseMapKeys).onChange(updateTexture(material, 'map', diffuseMaps));

}

function getObjectsKeys(obj) {
    var keys = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
        }

    }
    return keys;
}

var loadTexture = function (path) {
    var textureLoader = new TextureLoader();
    var texture = textureLoader.load(path);
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(15, 3);
    return texture;
}
var diffuseMaps = (function () {
    var folder_path = './objs/textures/sofa/';
    var files = [
        'texture_1.jpg',
        'texture_2.jpg',
        'texture_3.jpg',
        'texture_4.jpg',
        'texture_5.jpg',
        'texture_6.jpg',
        'texture_7.jpg',
        'texture_8.jpg',
    ];
    var textures = {};
    files.forEach( path => textures[path] = loadTexture(folder_path + path))
    
    return textures;

})();


var diffuseMapKeys = getObjectsKeys(diffuseMaps);

function updateTexture(material, materialKey, textures) {

    return function (key) {
        material[materialKey] = textures[key];

        material.needsUpdate = true;

    };
}
export {
    guiMeshPhysicalMaterial,
    GUI,
    handleColorChange
}
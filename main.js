import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { World } from './src/World.js';
import { Water } from './src/Water.js';
import { water_normal } from './src/water_normal.js';
import { createCinematicCamera } from './src/camera.js';
import { createTimeOfDay, createSmoke } from './src/effects.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);
scene.fog = new THREE.FogExp2(0x87CEEB, 0.01);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-32, 16, -32);

// Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector('#app'),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// World
const world = new World(scene);
world.generate();

// Water
const waterGeometry = new THREE.PlaneGeometry(100, 100);
const waterNormals = new THREE.TextureLoader().load(water_normal, (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
});

const water = new Water(
    waterGeometry,
    {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: waterNormals,
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined
    }
);
water.rotation.x = - Math.PI / 2;
water.position.y = 0.5;
scene.add(water);

// Cinematic Camera
createCinematicCamera(camera, controls);

// Effects
const timeOfDay = createTimeOfDay(directionalLight);
const smoke = createSmoke(scene);

// Animation loop
const animate = () => {
  controls.update();
  water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
  timeOfDay.update();
  smoke.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

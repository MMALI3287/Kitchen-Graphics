import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Refrigerator } from "./refrigerator.js";
import { Stove } from "./stove.js";
import { animateSteam, handleRefrigeratorDoor } from "./animations.js";
import { createCabinet, createMicrowave } from "./additionalFurniture.js";

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f5f5); // Light background for better visibility

// Camera setup
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 5);

// Renderer setup with anti-aliasing and color correction
const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  powerPreference: "high-performance" 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Make camera and renderer accessible to other modules
scene.camera = camera;
scene.renderer = renderer;

// Controls setup with constraints for better user experience
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Add smooth inertia to camera movement
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 10;
controls.maxPolarAngle = Math.PI / 1.5; // Prevent viewing from below floor
controls.minPolarAngle = Math.PI / 6; // Prevent extreme top-down view
controls.target.set(0, 1, 0); // Focus on center of scene
controls.update();

// Lighting setup
// Ambient light for base illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Main directional light for shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.normalBias = 0.02;
scene.add(directionalLight);

// Soft fill light from back
const fillLight = new THREE.DirectionalLight(0xffeedd, 0.5);
fillLight.position.set(-5, 8, -5);
scene.add(fillLight);

// Point light for realistic room illumination
const pointLight = new THREE.PointLight(0xffffff, 0.6, 10);
pointLight.position.set(0, 5, 2);
pointLight.castShadow = true;
pointLight.shadow.bias = -0.001;
scene.add(pointLight);

// Floor creation with realistic texture
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load("textures/floor.jpg");
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(5, 5);

const floorGeometry = new THREE.PlaneGeometry(15, 15);
const floorMaterial = new THREE.MeshStandardMaterial({
  map: floorTexture,
  roughness: 0.8,
  metalness: 0.1,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Simple walls
const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0xf0f0f0,
  roughness: 0.9,
  metalness: 0
});

// Back wall
const backWall = new THREE.Mesh(
  new THREE.PlaneGeometry(15, 10),
  wallMaterial
);
backWall.position.set(0, 5, -7.5);
backWall.receiveShadow = true;
scene.add(backWall);

// Left wall
const leftWall = new THREE.Mesh(
  new THREE.PlaneGeometry(15, 10),
  wallMaterial
);
leftWall.position.set(-7.5, 5, 0);
leftWall.rotation.y = Math.PI / 2;
leftWall.receiveShadow = true;
scene.add(leftWall);

// Right wall
const rightWall = new THREE.Mesh(
  new THREE.PlaneGeometry(15, 10),
  wallMaterial
);
rightWall.position.set(7.5, 5, 0);
rightWall.rotation.y = -Math.PI / 2;
rightWall.receiveShadow = true;
scene.add(rightWall);

// Create all kitchen appliances
// Refrigerator
const refrigerator = new Refrigerator();
refrigerator.model.position.set(-3, 1, -3);
refrigerator.model.castShadow = true;
refrigerator.model.receiveShadow = true;
scene.add(refrigerator.model);
refrigerator.addFoodItems(); // Add food items inside

// Stove
const stove = new Stove();
stove.model.position.set(2, 0.4, -0.5);
stove.model.castShadow = true;
stove.model.receiveShadow = true;
scene.add(stove.model);

// Cabinet
const cabinet = createCabinet();
cabinet.castShadow = true;
cabinet.receiveShadow = true;
scene.add(cabinet);

// Microwave
const microwave = createMicrowave();
microwave.castShadow = true;
microwave.receiveShadow = true;
scene.add(microwave);

// Setup steam animation system
const updateSteam = animateSteam(scene);

// Initialize refrigerator door interaction
const handleDoorAction = handleRefrigeratorDoor(refrigerator);

// Raycasting for interactive elements
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Handle mouse click interactions with raycasting
function onMouseClick(event) {
  // Update mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  // Update the raycaster with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);
  
  // Pass the click event to the refrigerator door handler
  handleDoorAction(event);
  
  // Check for interactions with stove knobs
  const intersects = raycaster.intersectObjects(
    stove.knobs.map(k => k.knob),
    false
  );
  
  if (intersects.length > 0) {
    // Find which knob was clicked
    const clickedKnob = intersects[0].object;
    for (let i = 0; i < stove.knobs.length; i++) {
      if (stove.knobs[i].knob === clickedKnob) {
        stove.toggleBurner(i);
        break;
      }
    }
  }
}

document.addEventListener("click", onMouseClick);

// Handle keyboard interactions
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    // Camera movement controls
    case "ArrowUp":
      camera.position.z -= 0.5;
      break;
    case "ArrowDown":
      camera.position.z += 0.5;
      break;
    case "ArrowLeft":
      camera.position.x -= 0.5;
      break;
    case "ArrowRight":
      camera.position.x += 0.5;
      break;
      
    // Microwave door control (spacebar)
    case " ":
      microwave.toggleDoor();
      break;
      
    // Cabinet doors control (c key)
    case "c":
    case "C":
      cabinet.toggleDoors();
      break;
      
    // Microwave light toggle (o key)
    case "o":
    case "O":
      microwave.toggleLight();
      break;
      
    // Start/stop microwave (m key)
    case "m":
    case "M":
      if (microwave.isRunning) {
        microwave.stop();
      } else {
        microwave.start();
      }
      break;
      
    // Oven door control (v key)
    case "v":
    case "V":
      if (stove.ovenDoor.rotation.x === 0) {
        stove.openOvenDoor();
      } else {
        stove.closeOvenDoor();
      }
      break;
  }
  
  controls.update();
});

// Clock for consistent time-based animations
const clock = new THREE.Clock();

// Main animation loop
function animate() {
  requestAnimationFrame(animate);
  
  const deltaTime = clock.getDelta();
  
  // Update controls with damping
  controls.update();
  
  // Update steam particle system
  if (updateSteam) {
    updateSteam(deltaTime);
  }
  
  // Update stove burners (for glow effect)
  stove.updateBurners(deltaTime);
  
  // Update microwave plate rotation if running
  if (microwave.update) {
    microwave.update(deltaTime);
  }
  
  // Render the scene
  renderer.render(scene, camera);
}

// Start animation loop
animate();

// Handle window resize for responsive design
window.addEventListener("resize", () => {
  // Update camera aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  // Update renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add help instructions in the corner
function addInstructions() {
  const instructions = document.createElement('div');
  instructions.style.position = 'absolute';
  instructions.style.bottom = '10px';
  instructions.style.left = '10px';
  instructions.style.backgroundColor = 'rgba(0,0,0,0.5)';
  instructions.style.color = 'white';
  instructions.style.padding = '10px';
  instructions.style.fontFamily = 'Arial, sans-serif';
  instructions.style.fontSize = '12px';
  instructions.style.borderRadius = '5px';
  instructions.style.pointerEvents = 'none';
  instructions.innerHTML = `
    <strong>Controls:</strong><br>
    - Click refrigerator to open/close door<br>
    - Click stove knobs to toggle burners<br>
    - Spacebar: toggle microwave door<br>
    - O: toggle microwave light<br>
    - M: start/stop microwave<br>
    - C: open/close cabinet doors<br>
    - V: open/close oven door<br>
    - Arrow keys: move camera<br>
    - Mouse drag: rotate view<br>
    - Mouse wheel: zoom
  `;
  document.body.appendChild(instructions);
}

addInstructions();
import * as THREE from "three";
import { reflectiveVertexShader, reflectiveFragmentShader } from "./shaders.js";

export class Refrigerator {
  constructor() {
    this.model = new THREE.Group();
    
    // Textures
    const textureLoader = new THREE.TextureLoader();
    const fridgeBodyTexture = textureLoader.load("textures/fridge-body.jpg");
    const fridgeDoorTexture = textureLoader.load("textures/fridge-door.jpg");
    fridgeBodyTexture.wrapS = THREE.RepeatWrapping;
    fridgeBodyTexture.wrapT = THREE.RepeatWrapping;
    fridgeBodyTexture.repeat.set(1, 1);
    
    // Reflective material using custom shader
    const reflectiveMaterial = new THREE.ShaderMaterial({
      uniforms: {
        baseColor: { value: new THREE.Color(0xf0f0f0) },
        roughness: { value: 0.2 },
        metalness: { value: 0.8 }
      },
      vertexShader: reflectiveVertexShader,
      fragmentShader: reflectiveFragmentShader
    });
    
    // Refrigerator body
    const bodyGeometry = new THREE.BoxGeometry(1, 2, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      map: fridgeBodyTexture,
      roughness: 0.2,
      metalness: 0.7
    });
    this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    this.model.add(this.body);
    
    // Create interior
    const interiorGeometry = new THREE.BoxGeometry(0.9, 1.9, 0.9);
    const interiorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      roughness: 0.9,
      metalness: 0.1
    });
    this.interior = new THREE.Mesh(interiorGeometry, interiorMaterial);
    this.interior.position.set(0, 0, 0);
    this.model.add(this.interior);
    
    // Create shelves
    const shelfGeometry = new THREE.BoxGeometry(0.85, 0.05, 0.85);
    const shelfMaterial = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      roughness: 0.5,
      metalness: 0.5
    });
    
    // Add multiple shelves
    for (let i = 0; i < 3; i++) {
      const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
      shelf.position.set(0, -0.5 + i * 0.5, 0);
      this.model.add(shelf);
    }
    
    // Internal light
    this.internalLight = new THREE.PointLight(0xffffdd, 0, 1);
    this.internalLight.position.set(0, 0, 0.3);
    this.model.add(this.internalLight);
    
    // Door group for animation
    this.doorObject = new THREE.Group();
    
    // Door
    const doorGeometry = new THREE.BoxGeometry(0.1, 2, 1);
    const doorMaterial = new THREE.MeshStandardMaterial({ 
      map: fridgeDoorTexture,
      roughness: 0.2,
      metalness: 0.7,
    });
    this.door = new THREE.Mesh(doorGeometry, doorMaterial);
    this.door.position.set(0, 0, 0);
    this.doorObject.add(this.door);
    
    // Door handle
    const handleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.2);
    const handleMaterial = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa,
      roughness: 0.1,
      metalness: 0.9
    });
    this.handle = new THREE.Mesh(handleGeometry, handleMaterial);
    this.handle.rotation.x = Math.PI / 2;
    this.handle.position.set(-0.15, 0, 0);
    this.doorObject.add(this.handle);
    
    // Position door at the front of the fridge
    this.doorObject.position.set(0.55, 0, 0);
    this.model.add(this.doorObject);
    
    // Origin of rotation is at the edge of the door
    this.doorObject.position.set(0.55, 0, -0.5);
    this.door.position.set(0, 0, 0.5);
    this.handle.position.set(-0.15, 0, 0.5);
  }
  
  // Open door with animation - this is called by the handler
  openDoor() {
    // This function is now handled by the animation system in animations.js
    // but we keep it for compatibility
    this.doorObject.rotation.y = Math.PI / 2;
    if (this.internalLight) {
      this.internalLight.intensity = 1;
    }
  }
  
  // Close door with animation - this is called by the handler
  closeDoor() {
    // This function is now handled by the animation system in animations.js
    // but we keep it for compatibility
    this.doorObject.rotation.y = 0;
    if (this.internalLight) {
      this.internalLight.intensity = 0;
    }
  }
  
  // Add some food items to the refrigerator
  addFoodItems() {
    // Milk carton
    const milkGeometry = new THREE.BoxGeometry(0.15, 0.3, 0.15);
    const milkMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const milk = new THREE.Mesh(milkGeometry, milkMaterial);
    milk.position.set(0.25, -0.7, 0.2);
    this.model.add(milk);
    
    // Vegetable (simple sphere)
    const vegetableGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const vegetableMaterial = new THREE.MeshStandardMaterial({ color: 0x2aad27 });
    const vegetable = new THREE.Mesh(vegetableGeometry, vegetableMaterial);
    vegetable.position.set(-0.2, -0.7, 0.25);
    this.model.add(vegetable);
    
    // Small container
    const containerGeometry = new THREE.CylinderGeometry(0.1, 0.08, 0.12, 16);
    const containerMaterial = new THREE.MeshStandardMaterial({ color: 0xe1a95f });
    const container = new THREE.Mesh(containerGeometry, containerMaterial);
    container.position.set(0, -0.2, 0.25);
    this.model.add(container);
  }
}
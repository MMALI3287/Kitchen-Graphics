import * as THREE from "three";
import { steamVertexShader, steamFragmentShader } from "./shaders.js";

// Advanced steam particle system
export function animateSteam(scene) {
  // Particle group to hold all steam particles
  const steamGroup = new THREE.Group();
  scene.add(steamGroup);
  steamGroup.position.set(3, 0.75, 0); // Position above stove
  
  // Particle settings
  const particleCount = 40;
  const particleSize = 0.07;
  const maxHeight = 1.5;
  const particles = [];
  
  // Custom shader material for realistic steam effect
  const steamMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(0xffffff) },
      opacity: { value: 0.6 }
    },
    vertexShader: steamVertexShader,
    fragmentShader: steamFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  
  // Create initial particles
  for (let i = 0; i < particleCount; i++) {
    createSteamParticle();
  }
  
  function createSteamParticle() {
    // Create particle geometry (plane facing camera)
    const geometry = new THREE.PlaneGeometry(particleSize, particleSize);
    const particle = new THREE.Mesh(geometry, steamMaterial.clone());
    
    // Random position around burners
    const burnerPositions = [
      { x: -0.3, z: -0.3 },
      { x: 0.3, z: -0.3 },
      { x: -0.3, z: 0.3 },
      { x: 0.3, z: 0.3 }
    ];
    
    const randomBurner = burnerPositions[Math.floor(Math.random() * burnerPositions.length)];
    const jitter = 0.1;
    
    // Position particle
    particle.position.set(
      randomBurner.x + (Math.random() * jitter * 2 - jitter),
      Math.random() * 0.2, // Start at slightly random height
      randomBurner.z + (Math.random() * jitter * 2 - jitter)
    );
    
    // Random rotation
    particle.rotation.z = Math.random() * Math.PI;
    
    // Set custom properties for animation
    particle.userData = {
      speed: 0.01 + Math.random() * 0.01,
      turbulence: 0.01,
      life: 0,
      maxLife: 2 + Math.random() * 2,
      size: particleSize,
      burnerOrigin: { x: randomBurner.x, z: randomBurner.z }
    };
    
    // Add to group
    steamGroup.add(particle);
    particles.push(particle);
    
    return particle;
  }
  
  // Animation loop (called from outside)
  let clock = new THREE.Clock();
  
  function updateSteam() {
    const time = clock.getElapsedTime();
    
    // Update each particle
    particles.forEach((particle, index) => {
      // Update life
      particle.userData.life += 0.016; // Approximate for 60fps
      
      // Lifecycle management
      if (particle.userData.life >= particle.userData.maxLife) {
        // Reset particle
        const burnerPositions = [
          { x: -0.3, z: -0.3 },
          { x: 0.3, z: -0.3 },
          { x: -0.3, z: 0.3 },
          { x: 0.3, z: 0.3 }
        ];
        const randomBurner = burnerPositions[Math.floor(Math.random() * burnerPositions.length)];
        const jitter = 0.1;
        
        particle.position.set(
          randomBurner.x + (Math.random() * jitter * 2 - jitter),
          Math.random() * 0.2,
          randomBurner.z + (Math.random() * jitter * 2 - jitter)
        );
        
        particle.userData.life = 0;
        particle.userData.burnerOrigin = { x: randomBurner.x, z: randomBurner.z };
        particle.userData.maxLife = 2 + Math.random() * 2;
        particle.visible = true;
        
        // Reset material opacity
        particle.material.uniforms.opacity.value = 0.6;
      }
      
      // Movement - rising with turbulence
      particle.position.y += particle.userData.speed;
      
      const lifeRatio = particle.userData.life / particle.userData.maxLife;
      
      // Add some horizontal drift based on sine wave
      particle.position.x += Math.sin(time * 2 + index) * 0.001;
      particle.position.z += Math.cos(time * 2 + index * 0.7) * 0.001;
      
      // Gradually drift away from burner origin
      particle.position.x += (particle.position.x - particle.userData.burnerOrigin.x) * 0.01;
      particle.position.z += (particle.position.z - particle.userData.burnerOrigin.z) * 0.01;
      
      // Size increase as it rises
      const growth = 1.0 + lifeRatio * 2.0;
      particle.scale.set(growth, growth, 1);
      
      // Fade out near end of life
      if (lifeRatio > 0.7) {
        particle.material.uniforms.opacity.value = 0.6 * (1.0 - (lifeRatio - 0.7) / 0.3);
      }
      
      // Always face camera
      particle.lookAt(scene.camera.position);
      
      // Update shader time
      particle.material.uniforms.time.value = time;
    });
  }
  
  return updateSteam;
}

// Refrigerator door animation handler
export function handleRefrigeratorDoor(refrigerator) {
  let isOpen = false;
  let animating = false;
  
  return function (event) {
    // Skip if already animating
    if (animating) return;
    
    // Use raycasting to detect if the refrigerator was clicked
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, event.target.scene.camera);
    
    const intersects = raycaster.intersectObject(refrigerator.model, true);
    
    if (intersects.length > 0) {
      animating = true;
      
      if (isOpen) {
        // Animated closing
        let currentAngle = refrigerator.doorObject.rotation.y;
        const targetAngle = 0;
        const animateClose = function() {
          currentAngle -= 0.1;
          if (currentAngle > targetAngle) {
            refrigerator.doorObject.rotation.y = currentAngle;
            requestAnimationFrame(animateClose);
          } else {
            refrigerator.doorObject.rotation.y = targetAngle;
            animating = false;
            // Turn off internal light
            if (refrigerator.internalLight) {
              refrigerator.internalLight.intensity = 0;
            }
          }
        };
        animateClose();
      } else {
        // Animated opening
        let currentAngle = refrigerator.doorObject.rotation.y;
        const targetAngle = Math.PI / 2;
        const animateOpen = function() {
          currentAngle += 0.1;
          if (currentAngle < targetAngle) {
            refrigerator.doorObject.rotation.y = currentAngle;
            requestAnimationFrame(animateOpen);
          } else {
            refrigerator.doorObject.rotation.y = targetAngle;
            animating = false;
            // Turn on internal light
            if (refrigerator.internalLight) {
              refrigerator.internalLight.intensity = 1;
            }
          }
        };
        animateOpen();
      }
      
      isOpen = !isOpen;
    }
  };
}

// Generic door animation utility
export function animateDoor(doorObject, isOpen, duration = 500) {
  return new Promise((resolve) => {
    const startAngle = doorObject.rotation.y;
    const targetAngle = isOpen ? Math.PI / 2 : 0;
    const startTime = Date.now();
    
    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease in-out function
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;
      
      doorObject.rotation.y = startAngle + (targetAngle - startAngle) * easeProgress;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        doorObject.rotation.y = targetAngle;
        resolve();
      }
    }
    
    animate();
  });
}
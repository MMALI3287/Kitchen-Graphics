import * as THREE from "three";

export class Stove {
  constructor() {
    this.model = new THREE.Group();

    const textureLoader = new THREE.TextureLoader();
    const stoveTopTexture = textureLoader.load("textures/stove-top.jpg");
    stoveTopTexture.wrapS = THREE.RepeatWrapping;
    stoveTopTexture.wrapT = THREE.RepeatWrapping;
    stoveTopTexture.repeat.set(1, 1);

    const metalTexture = textureLoader.load("textures/metal.jpg");
    metalTexture.wrapS = THREE.RepeatWrapping;
    metalTexture.wrapT = THREE.RepeatWrapping;
    metalTexture.repeat.set(1, 1);

    const bodyGeo = new THREE.BoxGeometry(1.2, 0.8, 1.2);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      map: metalTexture,
      roughness: 0.3,
      metalness: 0.7,
    });
    this.body = new THREE.Mesh(bodyGeo, bodyMaterial);
    this.model.add(this.body);

    const topGeo = new THREE.BoxGeometry(1.2, 0.05, 1.2);
    const topMaterial = new THREE.MeshStandardMaterial({
      map: stoveTopTexture,
      roughness: 0.7,
      metalness: 0.3,
    });
    const stoveTop = new THREE.Mesh(topGeo, topMaterial);
    stoveTop.position.y = 0.425;
    this.model.add(stoveTop);

    this.burners = [];
    const burnerPositions = [
      { x: -0.35, z: -0.35 },
      { x: 0.35, z: -0.35 },
      { x: -0.35, z: 0.35 },
      { x: 0.35, z: 0.35 },
    ];

    burnerPositions.forEach((pos, index) => {
      const burnerGroup = new THREE.Group();
      burnerGroup.position.set(pos.x, 0.45, pos.z);

      const burnerBaseGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.02, 32);
      const burnerBaseMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.7,
        metalness: 0.3,
      });
      const burnerBase = new THREE.Mesh(burnerBaseGeo, burnerBaseMaterial);
      burnerGroup.add(burnerBase);

      const createGrateLine = (x1, z1, x2, z2) => {
        const grateGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.3, 8);
        const grateMaterial = new THREE.MeshStandardMaterial({
          color: 0x333333,
          roughness: 0.8,
          metalness: 0.6,
        });
        const grate = new THREE.Mesh(grateGeo, grateMaterial);

        grate.position.set((x1 + x2) / 2, 0.03, (z1 + z2) / 2);

        const angle = Math.atan2(z2 - z1, x2 - x1);
        grate.rotation.y = angle;

        grate.rotation.x = Math.PI / 2;

        return grate;
      };

      const grateSize = 0.12;
      burnerGroup.add(
        createGrateLine(-grateSize, -grateSize, grateSize, grateSize)
      );
      burnerGroup.add(
        createGrateLine(-grateSize, grateSize, grateSize, -grateSize)
      );

      const elementGeo = new THREE.RingGeometry(0.05, 0.13, 32);
      const elementMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 1.0,
        metalness: 0.0,
        emissive: 0x000000,
        emissiveIntensity: 0,
      });
      const heatingElement = new THREE.Mesh(elementGeo, elementMaterial);
      heatingElement.rotation.x = -Math.PI / 2;
      heatingElement.position.y = -0.005;
      burnerGroup.add(heatingElement);

      this.burners.push({
        group: burnerGroup,
        element: heatingElement,
        isActive: false,
        intensity: 0,
      });

      this.model.add(burnerGroup);
    });

    this.knobs = [];
    for (let i = 0; i < 4; i++) {
      const knobGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.03, 32);
      const knobMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.5,
        metalness: 0.5,
      });
      const knob = new THREE.Mesh(knobGeo, knobMaterial);

      const xPos = -0.4 + i * 0.25;
      knob.position.set(xPos, 0.3, 0.55);
      knob.rotation.x = Math.PI / 2;

      const indicatorGeo = new THREE.BoxGeometry(0.045, 0.01, 0.01);
      const indicatorMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
      });
      const indicator = new THREE.Mesh(indicatorGeo, indicatorMaterial);
      indicator.position.set(0, 0.02, 0);
      knob.add(indicator);

      this.knobs.push({
        knob,
        linkedBurner: i,
        rotation: 0,
      });

      this.model.add(knob);
    }

    const ovenDoorGeo = new THREE.BoxGeometry(1, 0.6, 0.05);
    const ovenDoorMaterial = new THREE.MeshStandardMaterial({
      map: metalTexture,
      roughness: 0.3,
      metalness: 0.7,
    });
    this.ovenDoor = new THREE.Mesh(ovenDoorGeo, ovenDoorMaterial);
    this.ovenDoor.position.set(0, -0.1, 0.575);
    this.model.add(this.ovenDoor);

    const handleGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.8);
    const handleMaterial = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa,
      roughness: 0.1,
      metalness: 0.9,
    });
    const handle = new THREE.Mesh(handleGeo, handleMaterial);
    handle.rotation.z = Math.PI / 2;
    handle.position.set(0, 0, 0.05);
    this.ovenDoor.add(handle);

    const windowGeo = new THREE.PlaneGeometry(0.7, 0.3);
    const windowMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x111111,
      roughness: 0.1,
      metalness: 0.0,
      transparent: true,
      opacity: 0.8,
      transmission: 0.2,
    });
    const ovenWindow = new THREE.Mesh(windowGeo, windowMaterial);
    ovenWindow.position.set(0, 0, 0.03);
    this.ovenDoor.add(ovenWindow);
  }

  toggleBurner(index) {
    if (index >= 0 && index < this.burners.length) {
      const burner = this.burners[index];
      burner.isActive = !burner.isActive;

      const targetRotation = burner.isActive ? Math.PI / 2 : 0;
      const knob = this.knobs[index];

      const startRotation = knob.knob.rotation.z;
      const duration = 300;
      const startTime = Date.now();

      const animateKnob = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        knob.knob.rotation.z =
          startRotation + (targetRotation - startRotation) * progress;

        if (progress < 1) {
          requestAnimationFrame(animateKnob);
        }
      };

      animateKnob();

      return burner.isActive;
    }
    return false;
  }

  updateBurners(deltaTime) {
    this.burners.forEach((burner) => {
      if (burner.isActive && burner.intensity < 1) {
        burner.intensity = Math.min(burner.intensity + deltaTime * 2, 1);
      } else if (!burner.isActive && burner.intensity > 0) {
        burner.intensity = Math.max(burner.intensity - deltaTime * 2, 0);
      }

      const r = Math.floor(255 * burner.intensity);
      const g = Math.floor(100 * burner.intensity);
      burner.element.material.emissive.setRGB(r / 255, g / 255, 0);
      burner.element.material.emissiveIntensity = burner.intensity * 2;
    });
  }

  openOvenDoor() {
    const targetRotation = Math.PI / 4;
    const startRotation = this.ovenDoor.rotation.x;
    const duration = 500;
    const startTime = Date.now();

    const animateDoor = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);

      this.ovenDoor.rotation.x =
        startRotation + (targetRotation - startRotation) * easedProgress;

      if (progress < 1) {
        requestAnimationFrame(animateDoor);
      }
    };

    animateDoor();
  }

  closeOvenDoor() {
    const targetRotation = 0;
    const startRotation = this.ovenDoor.rotation.x;
    const duration = 500;
    const startTime = Date.now();

    const animateDoor = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);

      this.ovenDoor.rotation.x =
        startRotation + (targetRotation - startRotation) * easedProgress;

      if (progress < 1) {
        requestAnimationFrame(animateDoor);
      }
    };

    animateDoor();
  }
}

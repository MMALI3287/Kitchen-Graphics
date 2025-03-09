import * as THREE from "three";
import { animateDoor } from "./animations.js";

export function createCabinet() {
  const cabinetGroup = new THREE.Group();
  const textureLoader = new THREE.TextureLoader();

  const woodTexture = textureLoader.load("textures/light-yellow.jpg");
  woodTexture.wrapS = THREE.RepeatWrapping;
  woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set(2, 2);

  const countertopTexture = textureLoader.load("textures/marble.jpg");
  countertopTexture.wrapS = THREE.RepeatWrapping;
  countertopTexture.wrapT = THREE.RepeatWrapping;
  countertopTexture.repeat.set(2, 2);

  const baseMaterial = new THREE.MeshStandardMaterial({
    map: woodTexture,
    roughness: 0.7,
    metalness: 0.1,
  });

  const baseGeometry = new THREE.BoxGeometry(2, 1, 1);
  const baseCabinet = new THREE.Mesh(baseGeometry, baseMaterial);
  baseCabinet.position.set(0, 0.5, -1.5);
  cabinetGroup.add(baseCabinet);

  const countertopGeometry = new THREE.BoxGeometry(2.1, 0.05, 1.1);
  const countertopMaterial = new THREE.MeshStandardMaterial({
    map: countertopTexture,
    roughness: 0.3,
    metalness: 0.2,
    envMapIntensity: 1,
  });
  const countertop = new THREE.Mesh(countertopGeometry, countertopMaterial);
  countertop.position.set(0, 1.025, -1.5);
  cabinetGroup.add(countertop);

  const shelfGeometry = new THREE.BoxGeometry(1.9, 0.02, 0.9);
  const shelfMaterial = new THREE.MeshStandardMaterial({
    color: 0xdddddd,
    roughness: 0.8,
    metalness: 0.1,
  });
  const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
  shelf.position.set(0, 0.5, -1.5);
  cabinetGroup.add(shelf);

  const doorGeometry = new THREE.BoxGeometry(0.98, 0.98, 0.04);
  const doorMaterial = new THREE.MeshStandardMaterial({
    map: woodTexture,
    roughness: 0.7,
    metalness: 0.1,
  });

  const leftDoor = new THREE.Group();
  const leftDoorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
  leftDoorMesh.position.set(-0.49, 0, 0);
  leftDoor.add(leftDoorMesh);

  const handleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.15);
  const handleMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    roughness: 0.2,
    metalness: 0.8,
  });
  const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
  leftHandle.rotation.x = Math.PI / 2;
  leftHandle.position.set(-0.08, 0, 0.02);
  leftDoorMesh.add(leftHandle);

  leftDoor.position.set(-0.5, 0.5, -1);
  cabinetGroup.add(leftDoor);

  const rightDoor = new THREE.Group();
  const rightDoorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
  rightDoorMesh.position.set(0.49, 0, 0);
  rightDoor.add(rightDoorMesh);

  const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
  rightHandle.rotation.x = Math.PI / 2;
  rightHandle.position.set(0.08, 0, 0.02);
  rightDoorMesh.add(rightHandle);

  rightDoor.position.set(0.5, 0.5, -1);
  cabinetGroup.add(rightDoor);

  cabinetGroup.leftDoor = leftDoor;
  cabinetGroup.rightDoor = rightDoor;

  const createPlate = () => {
    const plateGroup = new THREE.Group();
    const plateGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.01, 32);
    const plateMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.7,
      metalness: 0.1,
    });
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    plate.rotation.x = Math.PI / 2;
    plateGroup.add(plate);
    return plateGroup;
  };

  for (let i = 0; i < 5; i++) {
    const plate = createPlate();
    plate.position.set(0.3, 0.51 + i * 0.02, -1.5);
    cabinetGroup.add(plate);
  }

  const glassGeometry = new THREE.CylinderGeometry(0.05, 0.04, 0.12, 16);
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0,
    metalness: 0,
    transparent: true,
    opacity: 0.3,
    transmission: 0.9,
  });
  const glass = new THREE.Mesh(glassGeometry, glassMaterial);
  glass.position.set(-0.3, 0.56, -1.5);
  cabinetGroup.add(glass);

  let doorAnimation = null;
  let isAnimating = false;

  cabinetGroup.openDoors = function () {
    if (isAnimating) return;
    isAnimating = true;

    if (doorAnimation) {
      cancelAnimationFrame(doorAnimation);
    }

    const targetAngle = Math.PI / 2;
    const startAngle = leftDoor.rotation.y;
    const duration = 500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeProgress = 1 - Math.pow(1 - progress, 3);

      leftDoor.rotation.y =
        startAngle + (targetAngle - startAngle) * easeProgress;
      rightDoor.rotation.y =
        startAngle + (-targetAngle - startAngle) * easeProgress;

      if (progress < 1) {
        doorAnimation = requestAnimationFrame(animate);
      } else {
        leftDoor.rotation.y = targetAngle;
        rightDoor.rotation.y = -targetAngle;
        isAnimating = false;
      }
    };

    animate();
  };

  cabinetGroup.closeDoors = function () {
    if (isAnimating) return;
    isAnimating = true;

    if (doorAnimation) {
      cancelAnimationFrame(doorAnimation);
    }

    const targetAngle = 0;
    const startAngleLeft = leftDoor.rotation.y;
    const startAngleRight = rightDoor.rotation.y;
    const duration = 500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeProgress = 1 - Math.pow(1 - progress, 3);

      leftDoor.rotation.y =
        startAngleLeft + (targetAngle - startAngleLeft) * easeProgress;
      rightDoor.rotation.y =
        startAngleRight + (targetAngle - startAngleRight) * easeProgress;

      if (progress < 1) {
        doorAnimation = requestAnimationFrame(animate);
      } else {
        leftDoor.rotation.y = targetAngle;
        rightDoor.rotation.y = targetAngle;
        isAnimating = false;
      }
    };

    animate();
  };

  cabinetGroup.toggleDoors = function () {
    if (leftDoor.rotation.y < 0.1) {
      cabinetGroup.openDoors();
    } else {
      cabinetGroup.closeDoors();
    }
  };

  return cabinetGroup;
}

export function createMicrowave() {
  const microwaveGroup = new THREE.Group();

  const microwaveGeometry = new THREE.BoxGeometry(0.6, 0.35, 0.45);
  const microwaveMaterial = new THREE.MeshStandardMaterial({
    color: 0x444444,
    roughness: 0.5,
    metalness: 0.7,
  });
  const microwave = new THREE.Mesh(microwaveGeometry, microwaveMaterial);
  microwaveGroup.add(microwave);

  const interiorGeometry = new THREE.BoxGeometry(0.56, 0.31, 0.41);
  const interiorMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    roughness: 0.7,
    metalness: 0.2,
  });
  const interior = new THREE.Mesh(interiorGeometry, interiorMaterial);
  microwave.add(interior);

  const doorGroup = new THREE.Group();

  const doorGeometry = new THREE.BoxGeometry(0.05, 0.34, 0.44);
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x000000,
    roughness: 0.0,
    metalness: 0.0,
    transparent: true,
    opacity: 0.5,
    transmission: 0.3,
  });
  const door = new THREE.Mesh(doorGeometry, glassMaterial);
  door.position.set(0, 0, 0);
  doorGroup.add(door);

  const doorFrameGeometry = new THREE.BoxGeometry(0.055, 0.35, 0.45);
  const doorFrameMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.5,
    metalness: 0.7,
  });

  const doorFrame = new THREE.Mesh(doorFrameGeometry, doorFrameMaterial);
  doorGroup.add(doorFrame);

  const handleGeometry = new THREE.BoxGeometry(0.02, 0.15, 0.02);
  const handleMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 0.2,
    metalness: 0.8,
  });
  const handle = new THREE.Mesh(handleGeometry, handleMaterial);
  handle.position.set(-0.04, 0, -0.18);
  doorGroup.add(handle);

  const createWindowGrid = () => {
    const gridGroup = new THREE.Group();
    const gridMaterial = new THREE.MeshBasicMaterial({ color: 0x444444 });

    for (let i = 0; i < 3; i++) {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(0.001, 0.26, 0.01),
        gridMaterial
      );
      line.position.set(0.01, 0, -0.12 + i * 0.12);
      gridGroup.add(line);
    }

    for (let i = 0; i < 3; i++) {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(0.001, 0.01, 0.35),
        gridMaterial
      );
      line.position.set(0.01, -0.12 + i * 0.12, 0);
      gridGroup.add(line);
    }

    return gridGroup;
  };

  const windowGrid = createWindowGrid();
  door.add(windowGrid);

  doorGroup.position.set(0.275, 0, 0);
  microwave.add(doorGroup);

  const panelGeometry = new THREE.BoxGeometry(0.15, 0.34, 0.1);
  const panelMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.9,
    metalness: 0.2,
  });
  const panel = new THREE.Mesh(panelGeometry, panelMaterial);
  panel.position.set(0.225, 0, -0.18);
  microwave.add(panel);

  const buttonGeometry = new THREE.BoxGeometry(0.02, 0.02, 0.01);
  const buttonMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.5,
    metalness: 0.5,
  });

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
      button.position.set(0.01, 0.12 - i * 0.06, -0.03 + j * 0.03);
      panel.add(button);
    }
  }

  const displayGeometry = new THREE.PlaneGeometry(0.12, 0.04);
  const displayMaterial = new THREE.MeshBasicMaterial({
    color: 0x22ff22,
    emissive: 0x22ff22,
    emissiveIntensity: 0.5,
  });
  const display = new THREE.Mesh(displayGeometry, displayMaterial);
  display.position.set(0.01, 0.13, 0);
  display.rotation.y = Math.PI / 2;
  panel.add(display);

  const plateGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.01, 32);
  const plateMaterial = new THREE.MeshStandardMaterial({
    color: 0xdddddd,
    roughness: 0.9,
    metalness: 0.1,
  });
  const plate = new THREE.Mesh(plateGeometry, plateMaterial);
  plate.rotation.x = Math.PI / 2;
  plate.position.set(0, -0.15, 0);
  interior.add(plate);

  const light = new THREE.PointLight(0xffffaa, 0, 0.5);
  light.position.set(0, 0, 0);
  interior.add(light);

  microwaveGroup.position.set(0, 1.25, -1.5);

  microwaveGroup.doorObject = doorGroup;
  microwaveGroup.light = light;
  microwaveGroup.plate = plate;

  let isAnimating = false;
  let doorAnimation = null;
  let isLightOn = false;
  let isRunning = false;

  microwaveGroup.openDoor = function () {
    if (isAnimating) return;
    isAnimating = true;

    if (doorAnimation) {
      cancelAnimationFrame(doorAnimation);
    }

    const targetAngle = -Math.PI / 2;
    const startAngle = doorGroup.rotation.y;
    const duration = 500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeProgress = 1 - Math.pow(1 - progress, 3);

      doorGroup.rotation.y =
        startAngle + (targetAngle - startAngle) * easeProgress;

      if (progress < 1) {
        doorAnimation = requestAnimationFrame(animate);
      } else {
        doorGroup.rotation.y = targetAngle;
        isAnimating = false;

        if (!isLightOn) {
          microwaveGroup.toggleLight();
        }
      }
    };

    animate();
  };

  microwaveGroup.closeDoor = function () {
    if (isAnimating) return;
    isAnimating = true;

    if (doorAnimation) {
      cancelAnimationFrame(doorAnimation);
    }

    const targetAngle = 0;
    const startAngle = doorGroup.rotation.y;
    const duration = 500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeProgress = 1 - Math.pow(1 - progress, 3);

      doorGroup.rotation.y =
        startAngle + (targetAngle - startAngle) * easeProgress;

      if (progress < 1) {
        doorAnimation = requestAnimationFrame(animate);
      } else {
        doorGroup.rotation.y = targetAngle;
        isAnimating = false;

        if (isLightOn && !isRunning) {
          microwaveGroup.toggleLight();
        }
      }
    };

    animate();
  };

  microwaveGroup.toggleDoor = function () {
    if (Math.abs(doorGroup.rotation.y) < 0.1) {
      microwaveGroup.openDoor();
    } else {
      microwaveGroup.closeDoor();
    }
  };

  microwaveGroup.toggleLight = function () {
    isLightOn = !isLightOn;
    light.intensity = isLightOn ? 1 : 0;
  };

  microwaveGroup.start = function () {
    isRunning = true;
    light.intensity = 1;
  };

  microwaveGroup.stop = function () {
    isRunning = false;

    if (Math.abs(doorGroup.rotation.y) < 0.1) {
      light.intensity = 0;
    }
  };

  microwaveGroup.update = function (deltaTime) {
    if (isRunning) {
      plate.rotation.z += deltaTime * 2;
    }
  };

  return microwaveGroup;
}

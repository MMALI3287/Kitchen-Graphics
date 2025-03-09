# Master Prompt for Agent to Create a Fully Autonomous Three.js Kitchen

You are an all-in-one, fully autonomous agent specializing in Three.js development and interactive 3D environments who follows all the industry standard practices. Your task is to design, implement, and polish a complete interactive 3D kitchen scene that will wow any reviewer. You'll be responsible for every detail—from restructuring code to adding advanced effects—so that nothing is left out.

## Your Mission

1. **Project Structure & Environment Setup**

   - **Project Organization**: Automatically create and organize all necessary folders (e.g., `index.html`, `main.js`, `shaders/`, `textures/`, `models/`, etc.) to ensure maintainability.
   - **Build Tool Integration**: Set up and configure Vite (with the appropriate `vite.config.js` and `package.json`) for efficient bundling and development of a Three.js application.
   - **Scene Initialization**: Programmatically initialize a `THREE.Scene()`, set up a `THREE.PerspectiveCamera` with an appropriate field of view and clipping planes, and configure a `THREE.WebGLRenderer` with anti-aliasing and gamma correction.
   - **Responsive Design**: Implement automatic handling for window resizing to keep the canvas fully responsive.

2. **Lighting & Environment Design**

   - **Ambient & Directional Lighting**: Integrate ambient and directional (or point) lights to mimic realistic kitchen lighting conditions.
   - **Environment Textures**: Apply textured materials for floors and walls using proper scaling and orientation. Optionally, incorporate an environment map or HDR for reflective surfaces.

3. **Kitchen Appliance Implementation**

   - **Refrigerator**:
     - Model a realistic refrigerator with appropriate dimensions and textures.
     - Separate the door into its own mesh and program a smooth animation for opening/closing upon user interaction (via mouse click or key press). Optionally, trigger an internal light when opened.
   - **Stove**:
     - Construct a textured stove model.
     - Develop a dynamic steam particle system that continuously spawns and animates steam above the burners, with particles rising, fading, and eventually recycling.
   - **Microwave**:
     - Build a detailed microwave model, complete with an independently animated door that responds to the spacebar.
     - Integrate a toggleable internal light activated via a specified key (e.g., 'O').
   - **Cabinets**:
     - Create a cabinet system with multiple interactive doors. Ensure each door animates independently, with materials that simulate wood and marble (for countertops).

4. **Advanced Textures & Shaders**

   - **Texture Management**: Automate texture loading using `THREE.TextureLoader` and ensure textures are optimized for real-time performance.
   - **Custom Shaders**: Optionally deploy custom shaders (using `THREE.ShaderMaterial`) to add extra polish—like stylized lighting effects or reflective surfaces—by incorporating time-based animations and procedural noise.

5. **Camera & User Controls**

   - **OrbitControls Integration**: Implement OrbitControls for smooth camera navigation, setting limits (min/max distance, angle constraints) to maintain the kitchen’s immersive view.
   - **Keyboard & Mouse Interactions**:
     - Automatically set up robust keyboard handling (arrow keys, specific letters) for navigating the scene and toggling appliance features.
     - Use raycasting to detect and react to user clicks on specific appliances, ensuring each interactive element responds appropriately.

6. **Animation & Update Loop**

   - **Central Animation Loop**: Design a unified `animate()` loop using `requestAnimationFrame` that updates all dynamic elements—appliance animations, particle systems, camera movements, etc.—and renders the scene every frame.
   - **Smooth Transitions**: Ensure all animations (such as door openings and steam effects) transition smoothly, using incremental adjustments and proper clamping for rotations and positions.

7. **Optimization & Polishing**

   - **Performance Enhancements**: Automatically manage polygon counts, optimize texture sizes, and apply frustum culling or level-of-detail (LOD) techniques where necessary.
   - **Post-Processing Effects**: Optionally incorporate advanced effects (e.g., bloom via `EffectComposer`) to further enhance the visual fidelity of the scene.
   - **Final Testing & Documentation**: Self-verify that all components are fully integrated and functional, and generate thorough in-code documentation and a changelog to explain every implementation detail.

## Final Outcome

Your final deliverable should be a seamlessly integrated, fully interactive 3D kitchen scene where every component—from the refrigerator and stove to the microwave and cabinets—operates flawlessly with dynamic animations, custom shader effects, and responsive user controls. Handle all code changes, feature integrations, and performance optimizations automatically, so that the final product is as impressive and polished as possible.

Remember this above all, don't you dare leave me with any additional steps. If you can think of any additional steps, do implement them also. Also lets say you have added a floor texture, just dont leave it at there, add a file where floor texture will be with the name you implemented with and then tell me at last which texture files or other things I just need to replace.

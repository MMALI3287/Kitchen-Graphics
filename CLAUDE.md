# CLAUDE.md - Guidance for Working in This Codebase

## Build and Development Commands
- Start development server: `npx vite`
- Build for production: `npx vite build`
- Preview production build: `npx vite preview`

## Code Style and Conventions
- Import organization: Core libraries first (Three.js), then external modules, then local imports
- Class-based approach for major components (Stove, Refrigerator)
- Consistent variable naming: camelCase for variables and functions, PascalCase for classes
- Animation functions should be kept in separate animation.js module

## Project Structure
- `/scripts`: Contains JavaScript modules for components and functionality
- `/textures`: All texture assets used by the 3D models
- `/model`: GLTF/GLB 3D models and associated files

## Best Practices
- Maintain separation of concerns (modeling, animation, interaction)
- Use Three.js Groups to organize related meshes
- Keep main.js as an orchestration file that imports and uses components
- Use ES modules for code organization
- Handle window resize events for responsive canvas